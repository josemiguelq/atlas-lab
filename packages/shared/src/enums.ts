import { Type, type Static } from "@sinclair/typebox";

/** Cria um schema de union literal a partir de um array `as const`. */
function literalUnion<const T extends readonly string[]>(values: T) {
  return Type.Union(values.map((v) => Type.Literal(v)));
}

// ---- Tipos de aparelho -----------------------------------------------------
export const DEVICE_KINDS = ["phone", "headphone", "smartwatch"] as const;
export const DeviceKindSchema = literalUnion(DEVICE_KINDS);
export type DeviceKind = Static<typeof DeviceKindSchema>;

// ---- Status da OS ----------------------------------------------------------
export const ORDER_STATUSES = [
  "draft",
  "open",
  "in_progress",
  "done",
  "delivered",
  "canceled",
] as const;
export const OrderStatusSchema = literalUnion(ORDER_STATUSES);
export type OrderStatus = Static<typeof OrderStatusSchema>;

// ---- Face do aparelho (frente / verso) -------------------------------------
export const DEVICE_FACES = ["front", "back"] as const;
export const DeviceFaceSchema = literalUnion(DEVICE_FACES);
export type DeviceFace = Static<typeof DeviceFaceSchema>;

// ---- Checklists (físico / funcional) ---------------------------------------
export const CHECK_TYPES = ["physical", "functional"] as const;
export const CheckTypeSchema = literalUnion(CHECK_TYPES);
export type CheckType = Static<typeof CheckTypeSchema>;

export const PHYSICAL_CHECK_KEYS = ["bent", "swollen_battery"] as const;
export const FUNCTIONAL_CHECK_KEYS = [
  "camera",
  "sound",
  "loud_speaker",
  "microphone",
  "buttons",
  "touch",
] as const;
export const CHECK_KEYS = [
  ...PHYSICAL_CHECK_KEYS,
  ...FUNCTIONAL_CHECK_KEYS,
] as const;
export const CheckKeySchema = literalUnion(CHECK_KEYS);
export type CheckKey = Static<typeof CheckKeySchema>;

export const CHECK_STATUSES = ["ok", "fail", "na"] as const;
export const CheckStatusSchema = literalUnion(CHECK_STATUSES);
export type CheckStatus = Static<typeof CheckStatusSchema>;

// ---- Itens (peças / serviços) ----------------------------------------------
export const ITEM_KINDS = ["part", "service"] as const;
export const ItemKindSchema = literalUnion(ITEM_KINDS);
export type ItemKind = Static<typeof ItemKindSchema>;

// ---- Métodos de pagamento --------------------------------------------------
export const PAYMENT_METHODS = [
  "cash",
  "pix",
  "credit",
  "debit",
  "transfer",
  "other",
] as const;
export const PaymentMethodSchema = literalUnion(PAYMENT_METHODS);
export type PaymentMethod = Static<typeof PaymentMethodSchema>;
