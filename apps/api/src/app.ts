import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { env } from "./config/env.js";
import { createContext, type AppContext } from "./infra/context.js";
import type { FastifyTypedInstance } from "./types.js";
import { NotFoundError, ValidationError } from "./modules/service-order/service-order.service.js";
import { serviceOrderRoutes } from "./modules/service-order/service-order.routes.js";
import { deviceRoutes } from "./modules/device/device.routes.js";
import { termsTemplateRoutes } from "./modules/terms-template/terms-template.routes.js";
import { storageRoutes } from "./modules/storage/storage.routes.js";

export async function buildApp(ctx: AppContext = createContext()) {
  const app = Fastify({
    logger: env.isDev
      ? { transport: { target: "pino-pretty" } }
      : true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.decorate("ctx", ctx);

  await app.register(cors, { origin: env.webOrigin });
  await app.register(multipart, { limits: { fileSize: 15 * 1024 * 1024 } });

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error instanceof NotFoundError) {
      return reply.code(404).send({ message: error.message });
    }
    if (error instanceof ValidationError) {
      return reply.code(400).send({ message: error.message });
    }
    if (error.statusCode && error.statusCode < 500) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    reply.log.error(error);
    return reply.code(500).send({ message: "Erro interno" });
  });

  app.get("/health", async () => ({ status: "ok", db: env.dbMode }));

  const typed = app as unknown as FastifyTypedInstance;
  await typed.register(serviceOrderRoutes);
  await typed.register(deviceRoutes);
  await typed.register(termsTemplateRoutes);
  await typed.register(storageRoutes);

  return app;
}
