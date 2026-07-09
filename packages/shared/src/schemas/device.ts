import { Type, type Static } from "@sinclair/typebox";
import { Id } from "./common.js";
import { DeviceKindSchema } from "../enums.js";

export const DeviceInputSchema = Type.Object({
  kind: DeviceKindSchema,
  brand: Type.String({ minLength: 1 }),
  model: Type.String({ minLength: 1 }),
  imei: Type.Optional(Type.String()),
  color: Type.Optional(Type.String()),
  /** Cliente não pôde fornecer o IMEI (ex.: tela quebrada). */
  imeiUnavailable: Type.Optional(Type.Boolean()),
});
export type DeviceInput = Static<typeof DeviceInputSchema>;

export const DeviceSchema = Type.Object({
  id: Id,
  storeId: Id,
  kind: DeviceKindSchema,
  brand: Type.String(),
  model: Type.String(),
  imei: Type.Union([Type.String(), Type.Null()]),
  color: Type.Union([Type.String(), Type.Null()]),
  imeiUnavailable: Type.Boolean(),
});
export type Device = Static<typeof DeviceSchema>;

// ---- Lookup por IMEI (stub na Etapa 1) -------------------------------------
export const ImeiLookupQuerySchema = Type.Object({
  imei: Type.String({ minLength: 6 }),
});
export type ImeiLookupQuery = Static<typeof ImeiLookupQuerySchema>;

export const ImeiLookupResultSchema = Type.Object({
  imei: Type.String(),
  kind: DeviceKindSchema,
  brand: Type.String(),
  model: Type.String(),
  /** true quando veio de uma base real; false = heurística/mock. */
  matched: Type.Boolean(),
  /** Reservado para GSX/garantia (fase futura). */
  warranty: Type.Optional(
    Type.Object({
      covered: Type.Boolean(),
      source: Type.String(),
    }),
  ),
});
export type ImeiLookupResult = Static<typeof ImeiLookupResultSchema>;
