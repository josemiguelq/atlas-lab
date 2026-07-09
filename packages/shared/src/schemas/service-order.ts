import { Type, type Static } from "@sinclair/typebox";
import { Id, Money, IsoDate, DataUrl } from "./common.js";
import {
  OrderStatusSchema,
  DeviceFaceSchema,
  CheckTypeSchema,
  CheckKeySchema,
  CheckStatusSchema,
  ItemKindSchema,
  PaymentMethodSchema,
} from "../enums.js";
import { CustomerInputSchema, CustomerSchema } from "./customer.js";
import { DeviceInputSchema, DeviceSchema } from "./device.js";

// ---- Sub-objetos do wizard -------------------------------------------------

/**
 * Passo 3: marcação de defeito na figura 2D. Posição livre em coordenadas
 * normalizadas (0..1) sobre a frente ou o verso do aparelho.
 */
export const DefectInputSchema = Type.Object({
  face: DeviceFaceSchema,
  x: Type.Number({ minimum: 0, maximum: 1 }),
  y: Type.Number({ minimum: 0, maximum: 1 }),
  note: Type.String({ minLength: 1 }),
});
export type DefectInput = Static<typeof DefectInputSchema>;

/** Passos 4 e 6: item de checklist físico/funcional. */
export const CheckInputSchema = Type.Object({
  type: CheckTypeSchema,
  key: CheckKeySchema,
  status: CheckStatusSchema,
  note: Type.Optional(Type.String()),
});
export type CheckInput = Static<typeof CheckInputSchema>;

/** Passo 7: peça a trocar ou serviço a executar. */
export const OrderItemInputSchema = Type.Object({
  kind: ItemKindSchema,
  description: Type.String({ minLength: 1 }),
  value: Money,
});
export type OrderItemInput = Static<typeof OrderItemInputSchema>;

/** Passo 7: orçamento e valores. */
export const BudgetInputSchema = Type.Object({
  desiredDeadline: Type.Optional(IsoDate),
  totalValue: Money,
  amountPaid: Type.Optional(Money),
  paymentMethod: Type.Optional(PaymentMethodSchema),
  receivedBy: Type.Optional(Type.String()),
});
export type BudgetInput = Static<typeof BudgetInputSchema>;

/** Passo 8: termos + assinatura. */
export const TermsInputSchema = Type.Object({
  templateId: Id,
  signatureDataUrl: Type.Optional(DataUrl),
});
export type TermsInput = Static<typeof TermsInputSchema>;

// ---- Payload de criação da OS (draft completo do wizard) -------------------
export const CreateServiceOrderSchema = Type.Object({
  customer: CustomerInputSchema,
  device: DeviceInputSchema,
  devicePowersOn: Type.Boolean({ default: true }),
  defects: Type.Array(DefectInputSchema, { default: [] }),
  checks: Type.Array(CheckInputSchema, { default: [] }),
  items: Type.Array(OrderItemInputSchema, { default: [] }),
  budget: BudgetInputSchema,
  terms: TermsInputSchema,
});
export type CreateServiceOrder = Static<typeof CreateServiceOrderSchema>;

// ---- Sub-objetos de resposta (com ids) -------------------------------------
export const DefectSchema = Type.Composite([
  Type.Object({ id: Id }),
  DefectInputSchema,
]);
export type Defect = Static<typeof DefectSchema>;

export const CheckSchema = Type.Composite([
  Type.Object({ id: Id }),
  CheckInputSchema,
]);
export type Check = Static<typeof CheckSchema>;

export const OrderItemSchema = Type.Composite([
  Type.Object({ id: Id }),
  OrderItemInputSchema,
]);
export type OrderItem = Static<typeof OrderItemSchema>;

export const PhotoSchema = Type.Object({
  id: Id,
  storagePath: Type.String(),
  url: Type.Union([Type.String(), Type.Null()]),
  label: Type.Union([Type.String(), Type.Null()]),
});
export type Photo = Static<typeof PhotoSchema>;

// ---- Resposta completa da OS -----------------------------------------------
export const ServiceOrderSchema = Type.Object({
  id: Id,
  storeId: Id,
  status: OrderStatusSchema,
  customer: CustomerSchema,
  device: DeviceSchema,
  devicePowersOn: Type.Boolean(),
  defects: Type.Array(DefectSchema),
  checks: Type.Array(CheckSchema),
  items: Type.Array(OrderItemSchema),
  photos: Type.Array(PhotoSchema),
  desiredDeadline: Type.Union([Type.String(), Type.Null()]),
  totalValue: Money,
  amountPaid: Money,
  paymentMethod: Type.Union([PaymentMethodSchema, Type.Null()]),
  receivedBy: Type.Union([Type.String(), Type.Null()]),
  termsTemplateId: Type.Union([Id, Type.Null()]),
  signaturePath: Type.Union([Type.String(), Type.Null()]),
  pdfUrl: Type.Union([Type.String(), Type.Null()]),
  createdAt: Type.String(),
});
export type ServiceOrder = Static<typeof ServiceOrderSchema>;

// ---- Params / respostas auxiliares -----------------------------------------
export const OrderIdParamsSchema = Type.Object({ id: Id });
export type OrderIdParams = Static<typeof OrderIdParamsSchema>;

export const GeneratePdfResultSchema = Type.Object({
  pdfUrl: Type.String(),
});
export type GeneratePdfResult = Static<typeof GeneratePdfResultSchema>;
