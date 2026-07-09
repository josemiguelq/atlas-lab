import type { FastifyTypedInstance } from "../../types.js";
import {
  CreateServiceOrderSchema,
  ServiceOrderSchema,
  OrderIdParamsSchema,
  GeneratePdfResultSchema,
} from "@atlas/shared";
import { env } from "../../config/env.js";
import { ServiceOrderService } from "./service-order.service.js";
import {
  serviceOrderToDto,
  photoToDto,
} from "./service-order.diplomat.js";

export async function serviceOrderRoutes(app: FastifyTypedInstance) {
  const service = () => new ServiceOrderService(app.ctx, env.defaultStoreId);

  app.post(
    "/service-orders",
    {
      schema: {
        body: CreateServiceOrderSchema,
        response: { 201: ServiceOrderSchema },
      },
    },
    async (request, reply) => {
      const order = await service().create(request.body);
      return reply.code(201).send(serviceOrderToDto(order));
    },
  );

  app.get(
    "/service-orders/:id",
    {
      schema: {
        params: OrderIdParamsSchema,
        response: { 200: ServiceOrderSchema },
      },
    },
    async (request) => {
      const order = await service().getById(request.params.id);
      return serviceOrderToDto(order);
    },
  );

  // Upload de fotos (multipart). Sem schema de body por ser multipart.
  app.post(
    "/service-orders/:id/photos",
    { schema: { params: OrderIdParamsSchema } },
    async (request, reply) => {
      const file = await request.file();
      if (!file) {
        return reply.code(400).send({ message: "Arquivo ausente" });
      }
      const buffer = await file.toBuffer();
      const label =
        typeof file.fields.label === "object" &&
        file.fields.label &&
        "value" in file.fields.label
          ? String((file.fields.label as { value: unknown }).value)
          : null;
      const photo = await service().addPhoto(
        request.params.id,
        { buffer, contentType: file.mimetype, filename: file.filename },
        label,
      );
      return reply.code(201).send(photoToDto(photo));
    },
  );

  app.post(
    "/service-orders/:id/pdf",
    {
      schema: {
        params: OrderIdParamsSchema,
        response: { 200: GeneratePdfResultSchema },
      },
    },
    async (request) => {
      const pdfUrl = await service().generatePdf(request.params.id);
      return { pdfUrl };
    },
  );
}
