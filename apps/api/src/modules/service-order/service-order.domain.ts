import type {
  DeviceKind,
  OrderStatus,
  DeviceFace,
  CheckType,
  CheckKey,
  CheckStatus,
  ItemKind,
  PaymentMethod,
} from "@atlas/shared";

/**
 * Entidades de domínio (representação interna, próxima das linhas do banco).
 * O diplomat traduz estas entidades para os DTOs de API.
 */

export interface CustomerEntity {
  id: string;
  storeId: string;
  name: string;
  phone: string | null;
  email: string | null;
  doc: string | null;
}

export interface DeviceEntity {
  id: string;
  storeId: string;
  kind: DeviceKind;
  brand: string;
  model: string;
  imei: string | null;
  color: string | null;
  imeiUnavailable: boolean;
}

export interface DefectEntity {
  id: string;
  face: DeviceFace;
  x: number;
  y: number;
  note: string;
}

export interface CheckEntity {
  id: string;
  type: CheckType;
  key: CheckKey;
  status: CheckStatus;
  note: string | null;
}

export interface OrderItemEntity {
  id: string;
  kind: ItemKind;
  description: string;
  value: number;
}

export interface PhotoEntity {
  id: string;
  storagePath: string;
  url: string | null;
  label: string | null;
}

export interface ServiceOrderEntity {
  id: string;
  storeId: string;
  status: OrderStatus;
  customer: CustomerEntity;
  device: DeviceEntity;
  devicePowersOn: boolean;
  defects: DefectEntity[];
  checks: CheckEntity[];
  items: OrderItemEntity[];
  photos: PhotoEntity[];
  desiredDeadline: string | null;
  totalValue: number;
  amountPaid: number;
  paymentMethod: PaymentMethod | null;
  receivedBy: string | null;
  termsTemplateId: string | null;
  signaturePath: string | null;
  pdfUrl: string | null;
  createdAt: string;
}
