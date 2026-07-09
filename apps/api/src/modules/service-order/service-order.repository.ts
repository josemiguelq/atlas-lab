import type {
  CustomerInput,
  DeviceInput,
  DefectInput,
  CheckInput,
  OrderItemInput,
  BudgetInput,
} from "@atlas/shared";
import type { ServiceOrderEntity, PhotoEntity } from "./service-order.domain.js";

export interface CreateServiceOrderData {
  storeId: string;
  customer: CustomerInput;
  device: DeviceInput;
  devicePowersOn: boolean;
  defects: DefectInput[];
  checks: CheckInput[];
  items: OrderItemInput[];
  budget: BudgetInput;
  termsTemplateId: string;
  signaturePath: string | null;
}

export interface AddPhotoData {
  storagePath: string;
  url: string | null;
  label: string | null;
}

/**
 * Contrato de acesso a dados da OS. Nenhuma query SQL vaza para os controllers.
 * Implementações: memória (mock) e Supabase.
 */
export interface ServiceOrderRepository {
  create(data: CreateServiceOrderData): Promise<ServiceOrderEntity>;
  findById(storeId: string, id: string): Promise<ServiceOrderEntity | null>;
  addPhoto(
    storeId: string,
    orderId: string,
    photo: AddPhotoData,
  ): Promise<PhotoEntity | null>;
  setPdfUrl(storeId: string, orderId: string, pdfUrl: string): Promise<void>;
}
