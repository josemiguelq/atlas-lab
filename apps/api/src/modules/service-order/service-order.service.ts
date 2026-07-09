import { randomUUID } from "node:crypto";
import type { CreateServiceOrder } from "@atlas/shared";
import type { AppContext } from "../../infra/context.js";
import type { ServiceOrderEntity, PhotoEntity } from "./service-order.domain.js";
import { renderServiceOrderPdf } from "../../pdf/render.js";

export class NotFoundError extends Error {}
export class ValidationError extends Error {}

/** Decodifica uma data-URL base64 em buffer + content-type. */
function decodeDataUrl(dataUrl: string): { buffer: Buffer; contentType: string } {
  const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl);
  if (!match) throw new ValidationError("data-url inválida");
  return {
    contentType: match[1]!,
    buffer: Buffer.from(match[2]!, "base64"),
  };
}

export class ServiceOrderService {
  constructor(
    private readonly ctx: AppContext,
    private readonly storeId: string,
  ) {}

  async create(input: CreateServiceOrder): Promise<ServiceOrderEntity> {
    // Valida que o template existe antes de persistir.
    const template = await this.ctx.termsTemplates.findById(
      this.storeId,
      input.terms.templateId,
    );
    if (!template) {
      throw new ValidationError("Template de termos inexistente");
    }

    // Sobe a assinatura (se houver) antes de criar a OS.
    let signaturePath: string | null = null;
    if (input.terms.signatureDataUrl) {
      const { buffer, contentType } = decodeDataUrl(input.terms.signatureDataUrl);
      const stored = await this.ctx.storage.upload({
        path: `signatures/${randomUUID()}.png`,
        data: buffer,
        contentType,
      });
      signaturePath = stored.path;
    }

    return this.ctx.serviceOrders.create({
      storeId: this.storeId,
      customer: input.customer,
      device: input.device,
      devicePowersOn: input.devicePowersOn,
      defects: input.defects,
      checks: input.checks,
      items: input.items,
      budget: input.budget,
      termsTemplateId: input.terms.templateId,
      signaturePath,
    });
  }

  async getById(id: string): Promise<ServiceOrderEntity> {
    const order = await this.ctx.serviceOrders.findById(this.storeId, id);
    if (!order) throw new NotFoundError("OS não encontrada");
    return order;
  }

  async addPhoto(
    orderId: string,
    file: { buffer: Buffer; contentType: string; filename: string },
    label: string | null,
  ): Promise<PhotoEntity> {
    const safeName = file.filename.replace(/[^\w.-]/g, "_");
    const path = `orders/${orderId}/photos/${randomUUID()}-${safeName}`;
    await this.ctx.storage.upload({
      path,
      data: file.buffer,
      contentType: file.contentType,
    });
    const photo = await this.ctx.serviceOrders.addPhoto(this.storeId, orderId, {
      storagePath: path,
      url: this.ctx.storage.getPublicUrl(path),
      label,
    });
    if (!photo) throw new NotFoundError("OS não encontrada");
    return photo;
  }

  async generatePdf(orderId: string): Promise<string> {
    const order = await this.getById(orderId);
    const template = order.termsTemplateId
      ? await this.ctx.termsTemplates.findById(this.storeId, order.termsTemplateId)
      : null;
    if (!template) throw new ValidationError("Template de termos indisponível");

    const signatureUrl = order.signaturePath
      ? this.ctx.storage.getPublicUrl(order.signaturePath)
      : null;

    const buffer = await renderServiceOrderPdf({
      order,
      template,
      signatureUrl,
    });

    const path = `orders/${order.id}/os-${order.id.slice(0, 8)}.pdf`;
    await this.ctx.storage.upload({
      path,
      data: buffer,
      contentType: "application/pdf",
    });
    const pdfUrl = this.ctx.storage.getPublicUrl(path);
    if (!pdfUrl) throw new Error("Não foi possível obter URL do PDF");
    await this.ctx.serviceOrders.setPdfUrl(this.storeId, order.id, pdfUrl);
    return pdfUrl;
  }
}
