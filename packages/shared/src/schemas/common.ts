import { Type } from "@sinclair/typebox";

/** UUID (v4) — usamos string simples para não travar em ambientes de teste. */
export const Id = Type.String({ minLength: 1 });

/** Valor monetário em BRL (reais, com centavos). */
export const Money = Type.Number({ minimum: 0 });

/** Data ISO (YYYY-MM-DD ou date-time). */
export const IsoDate = Type.String({ minLength: 1 });

/** Data-URL base64 (ex.: PNG de assinatura). */
export const DataUrl = Type.String({
  pattern: "^data:.*;base64,.*$",
});

export const OptionalString = Type.Optional(Type.String());
