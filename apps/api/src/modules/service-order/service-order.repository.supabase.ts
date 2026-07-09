import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "../../infra/supabase.js";
import type {
  ServiceOrderEntity,
  PhotoEntity,
  DefectEntity,
  CheckEntity,
  OrderItemEntity,
} from "./service-order.domain.js";
import type {
  ServiceOrderRepository,
  CreateServiceOrderData,
  AddPhotoData,
} from "./service-order.repository.js";

/** Implementação sobre o Postgres do Supabase. Concentra todo o SQL/queries. */
export class SupabaseServiceOrderRepository implements ServiceOrderRepository {
  private get db(): SupabaseClient {
    return getSupabase();
  }

  async create(data: CreateServiceOrderData): Promise<ServiceOrderEntity> {
    const { data: customer, error: cErr } = await this.db
      .from("customers")
      .insert({
        store_id: data.storeId,
        name: data.customer.name,
        phone: data.customer.phone ?? null,
        email: data.customer.email ?? null,
        doc: data.customer.doc ?? null,
      })
      .select("id")
      .single();
    if (cErr) throw cErr;

    const { data: device, error: dErr } = await this.db
      .from("devices")
      .insert({
        store_id: data.storeId,
        kind: data.device.kind,
        brand: data.device.brand,
        model: data.device.model,
        imei: data.device.imei ?? null,
        color: data.device.color ?? null,
        imei_unavailable: data.device.imeiUnavailable ?? false,
      })
      .select("id")
      .single();
    if (dErr) throw dErr;

    const { data: order, error: oErr } = await this.db
      .from("service_orders")
      .insert({
        store_id: data.storeId,
        customer_id: customer.id,
        device_id: device.id,
        status: "open",
        device_powers_on: data.devicePowersOn,
        desired_deadline: data.budget.desiredDeadline ?? null,
        total_value: data.budget.totalValue,
        amount_paid: data.budget.amountPaid ?? 0,
        payment_method: data.budget.paymentMethod ?? null,
        received_by: data.budget.receivedBy ?? null,
        terms_template_id: data.termsTemplateId,
        signature_path: data.signaturePath,
      })
      .select("id")
      .single();
    if (oErr) throw oErr;

    if (data.defects.length) {
      const { error } = await this.db.from("service_order_defects").insert(
        data.defects.map((x) => ({
          order_id: order.id,
          face: x.face,
          pos_x: x.x,
          pos_y: x.y,
          note: x.note,
        })),
      );
      if (error) throw error;
    }
    if (data.checks.length) {
      const { error } = await this.db.from("service_order_checks").insert(
        data.checks.map((x) => ({
          order_id: order.id,
          type: x.type,
          key: x.key,
          status: x.status,
          note: x.note ?? null,
        })),
      );
      if (error) throw error;
    }
    if (data.items.length) {
      const { error } = await this.db.from("service_order_items").insert(
        data.items.map((x) => ({
          order_id: order.id,
          kind: x.kind,
          description: x.description,
          value: x.value,
        })),
      );
      if (error) throw error;
    }

    const created = await this.findById(data.storeId, order.id);
    if (!created) throw new Error("Falha ao reler OS recém-criada");
    return created;
  }

  async findById(
    storeId: string,
    id: string,
  ): Promise<ServiceOrderEntity | null> {
    const { data: order, error } = await this.db
      .from("service_orders")
      .select(
        `id, store_id, status, device_powers_on, desired_deadline, total_value,
         amount_paid, payment_method, received_by, terms_template_id,
         signature_path, pdf_url, created_at,
         customer:customers(*), device:devices(*),
         defects:service_order_defects(*), checks:service_order_checks(*),
         items:service_order_items(*), photos:service_order_photos(*)`,
      )
      .eq("store_id", storeId)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!order) return null;
    return mapRow(order);
  }

  async addPhoto(
    storeId: string,
    orderId: string,
    photo: AddPhotoData,
  ): Promise<PhotoEntity | null> {
    const order = await this.findById(storeId, orderId);
    if (!order) return null;
    const { data, error } = await this.db
      .from("service_order_photos")
      .insert({
        order_id: orderId,
        storage_path: photo.storagePath,
        url: photo.url,
        label: photo.label,
      })
      .select("*")
      .single();
    if (error) throw error;
    return {
      id: data.id,
      storagePath: data.storage_path,
      url: data.url,
      label: data.label,
    };
  }

  async setPdfUrl(
    storeId: string,
    orderId: string,
    pdfUrl: string,
  ): Promise<void> {
    const { error } = await this.db
      .from("service_orders")
      .update({ pdf_url: pdfUrl })
      .eq("store_id", storeId)
      .eq("id", orderId);
    if (error) throw error;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): ServiceOrderEntity {
  const customer = Array.isArray(row.customer) ? row.customer[0] : row.customer;
  const device = Array.isArray(row.device) ? row.device[0] : row.device;
  return {
    id: row.id,
    storeId: row.store_id,
    status: row.status,
    customer: {
      id: customer.id,
      storeId: customer.store_id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      doc: customer.doc,
    },
    device: {
      id: device.id,
      storeId: device.store_id,
      kind: device.kind,
      brand: device.brand,
      model: device.model,
      imei: device.imei,
      color: device.color,
      imeiUnavailable: device.imei_unavailable ?? false,
    },
    devicePowersOn: row.device_powers_on,
    defects: (row.defects ?? []).map(
      (d: any): DefectEntity => ({
        id: d.id,
        face: d.face,
        x: Number(d.pos_x),
        y: Number(d.pos_y),
        note: d.note,
      }),
    ),
    checks: (row.checks ?? []).map(
      (c: any): CheckEntity => ({
        id: c.id,
        type: c.type,
        key: c.key,
        status: c.status,
        note: c.note,
      }),
    ),
    items: (row.items ?? []).map(
      (i: any): OrderItemEntity => ({
        id: i.id,
        kind: i.kind,
        description: i.description,
        value: Number(i.value),
      }),
    ),
    photos: (row.photos ?? []).map(
      (p: any): PhotoEntity => ({
        id: p.id,
        storagePath: p.storage_path,
        url: p.url,
        label: p.label,
      }),
    ),
    desiredDeadline: row.desired_deadline,
    totalValue: Number(row.total_value),
    amountPaid: Number(row.amount_paid),
    paymentMethod: row.payment_method,
    receivedBy: row.received_by,
    termsTemplateId: row.terms_template_id,
    signaturePath: row.signature_path,
    pdfUrl: row.pdf_url,
    createdAt: row.created_at,
  };
}
