import { Type, type Static } from "@sinclair/typebox";
import { Id } from "./common.js";

export const TermsTemplateSchema = Type.Object({
  id: Id,
  storeId: Type.Union([Id, Type.Null()]), // null = template global
  name: Type.String(),
  /**
   * Corpo com placeholders `{{campo}}` resolvidos na geração do PDF.
   * Ex.: {{customerName}}, {{totalValue}}, {{amountPaid}}, {{deadline}},
   * {{paymentMethod}}, {{receivedBy}}, {{issuedAt}}, {{pickupDeadlineDays}}.
   */
  body: Type.String(),
  isDefault: Type.Boolean(),
});
export type TermsTemplate = Static<typeof TermsTemplateSchema>;
