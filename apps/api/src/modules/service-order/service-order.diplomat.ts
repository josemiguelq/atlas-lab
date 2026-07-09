import type { ServiceOrder, Photo } from "@atlas/shared";
import type {
  ServiceOrderEntity,
  PhotoEntity,
} from "./service-order.domain.js";

/**
 * Diplomat: traduz entidades de domínio para os DTOs de API (contrato público).
 * Mantém a fronteira entre o modelo interno e o payload exposto.
 */

export function photoToDto(entity: PhotoEntity): Photo {
  return {
    id: entity.id,
    storagePath: entity.storagePath,
    url: entity.url,
    label: entity.label,
  };
}

export function serviceOrderToDto(entity: ServiceOrderEntity): ServiceOrder {
  return {
    id: entity.id,
    storeId: entity.storeId,
    status: entity.status,
    customer: {
      id: entity.customer.id,
      storeId: entity.customer.storeId,
      name: entity.customer.name,
      phone: entity.customer.phone,
      email: entity.customer.email,
      doc: entity.customer.doc,
    },
    device: {
      id: entity.device.id,
      storeId: entity.device.storeId,
      kind: entity.device.kind,
      brand: entity.device.brand,
      model: entity.device.model,
      imei: entity.device.imei,
      color: entity.device.color,
      imeiUnavailable: entity.device.imeiUnavailable,
    },
    devicePowersOn: entity.devicePowersOn,
    defects: entity.defects.map((d) => ({
      id: d.id,
      face: d.face,
      x: d.x,
      y: d.y,
      note: d.note,
    })),
    checks: entity.checks.map((c) => ({
      id: c.id,
      type: c.type,
      key: c.key,
      status: c.status,
      note: c.note ?? undefined,
    })),
    items: entity.items.map((i) => ({
      id: i.id,
      kind: i.kind,
      description: i.description,
      value: i.value,
    })),
    photos: entity.photos.map(photoToDto),
    desiredDeadline: entity.desiredDeadline,
    totalValue: entity.totalValue,
    amountPaid: entity.amountPaid,
    paymentMethod: entity.paymentMethod,
    receivedBy: entity.receivedBy,
    termsTemplateId: entity.termsTemplateId,
    signaturePath: entity.signaturePath,
    pdfUrl: entity.pdfUrl,
    createdAt: entity.createdAt,
  };
}
