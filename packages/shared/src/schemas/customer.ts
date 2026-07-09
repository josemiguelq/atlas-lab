import { Type, type Static } from "@sinclair/typebox";
import { Id } from "./common.js";

export const CustomerInputSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  phone: Type.Optional(Type.String()),
  email: Type.Optional(Type.String({ format: "email" })),
  doc: Type.Optional(Type.String()), // CPF ou CNPJ
});
export type CustomerInput = Static<typeof CustomerInputSchema>;

export const CustomerSchema = Type.Object({
  id: Id,
  storeId: Id,
  name: Type.String(),
  phone: Type.Union([Type.String(), Type.Null()]),
  email: Type.Union([Type.String(), Type.Null()]),
  doc: Type.Union([Type.String(), Type.Null()]),
});
export type Customer = Static<typeof CustomerSchema>;
