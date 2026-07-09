import { Type } from "@sinclair/typebox";
import type { FastifyTypedInstance } from "../../types.js";
import { TermsTemplateSchema } from "@atlas/shared";
import { env } from "../../config/env.js";

export async function termsTemplateRoutes(app: FastifyTypedInstance) {
  app.get(
    "/terms-templates",
    { schema: { response: { 200: Type.Array(TermsTemplateSchema) } } },
    async () => app.ctx.termsTemplates.list(env.defaultStoreId),
  );
}
