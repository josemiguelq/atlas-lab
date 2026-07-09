import { randomUUID } from "node:crypto";
import type { ServiceOrderEntity, PhotoEntity } from "./service-order.domain.js";
import type {
  ServiceOrderRepository,
  CreateServiceOrderData,
  AddPhotoData,
} from "./service-order.repository.js";

/** Implementação em memória (modo mock). Não persiste entre reinícios. */
export class InMemoryServiceOrderRepository implements ServiceOrderRepository {
  private orders = new Map<string, ServiceOrderEntity>();

  async create(data: CreateServiceOrderData): Promise<ServiceOrderEntity> {
    const now = new Date().toISOString();
    const order: ServiceOrderEntity = {
      id: randomUUID(),
      storeId: data.storeId,
      status: "open",
      customer: {
        id: randomUUID(),
        storeId: data.storeId,
        name: data.customer.name,
        phone: data.customer.phone ?? null,
        email: data.customer.email ?? null,
        doc: data.customer.doc ?? null,
      },
      device: {
        id: randomUUID(),
        storeId: data.storeId,
        kind: data.device.kind,
        brand: data.device.brand,
        model: data.device.model,
        imei: data.device.imei ?? null,
        color: data.device.color ?? null,
        imeiUnavailable: data.device.imeiUnavailable ?? false,
      },
      devicePowersOn: data.devicePowersOn,
      defects: data.defects.map((d) => ({ id: randomUUID(), ...d })),
      checks: data.checks.map((c) => ({
        id: randomUUID(),
        type: c.type,
        key: c.key,
        status: c.status,
        note: c.note ?? null,
      })),
      items: data.items.map((i) => ({ id: randomUUID(), ...i })),
      photos: [],
      desiredDeadline: data.budget.desiredDeadline ?? null,
      totalValue: data.budget.totalValue,
      amountPaid: data.budget.amountPaid ?? 0,
      paymentMethod: data.budget.paymentMethod ?? null,
      receivedBy: data.budget.receivedBy ?? null,
      termsTemplateId: data.termsTemplateId,
      signaturePath: data.signaturePath,
      pdfUrl: null,
      createdAt: now,
    };
    this.orders.set(order.id, order);
    return structuredClone(order);
  }

  async findById(
    storeId: string,
    id: string,
  ): Promise<ServiceOrderEntity | null> {
    const order = this.orders.get(id);
    if (!order || order.storeId !== storeId) return null;
    return structuredClone(order);
  }

  async addPhoto(
    storeId: string,
    orderId: string,
    photo: AddPhotoData,
  ): Promise<PhotoEntity | null> {
    const order = this.orders.get(orderId);
    if (!order || order.storeId !== storeId) return null;
    const entity: PhotoEntity = {
      id: randomUUID(),
      storagePath: photo.storagePath,
      url: photo.url,
      label: photo.label,
    };
    order.photos.push(entity);
    return structuredClone(entity);
  }

  async setPdfUrl(
    storeId: string,
    orderId: string,
    pdfUrl: string,
  ): Promise<void> {
    const order = this.orders.get(orderId);
    if (!order || order.storeId !== storeId) return;
    order.pdfUrl = pdfUrl;
  }
}
