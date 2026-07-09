import type {
  FastifyInstance,
  FastifyBaseLogger,
  RawServerDefault,
} from "fastify";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { AppContext } from "./infra/context.js";

/** Instância Fastify com o type provider do TypeBox. */
export type FastifyTypedInstance = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

declare module "fastify" {
  interface FastifyInstance {
    ctx: AppContext;
  }
}
