import type { FastifyTypedInstance } from "../../types.js";
import {
  ImeiLookupQuerySchema,
  ImeiLookupResultSchema,
} from "@atlas/shared";
import { lookupImei } from "./imei-lookup.js";

export async function deviceRoutes(app: FastifyTypedInstance) {
  app.get(
    "/devices/lookup",
    {
      schema: {
        querystring: ImeiLookupQuerySchema,
        response: { 200: ImeiLookupResultSchema },
      },
    },
    async (request) => lookupImei(request.query.imei),
  );
}
