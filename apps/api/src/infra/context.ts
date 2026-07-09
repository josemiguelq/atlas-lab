import { env } from "../config/env.js";
import type { StoragePort } from "./storage/storage.port.js";
import { MockStorageAdapter } from "./storage/mock-storage.adapter.js";
import { SupabaseStorageAdapter } from "./storage/supabase-storage.adapter.js";
import type { ServiceOrderRepository } from "../modules/service-order/service-order.repository.js";
import { InMemoryServiceOrderRepository } from "../modules/service-order/service-order.repository.memory.js";
import { SupabaseServiceOrderRepository } from "../modules/service-order/service-order.repository.supabase.js";
import type { TermsTemplateRepository } from "../modules/terms-template/terms-template.repository.js";
import {
  InMemoryTermsTemplateRepository,
  SupabaseTermsTemplateRepository,
} from "../modules/terms-template/terms-template.repository.js";

export interface AppContext {
  storage: StoragePort;
  serviceOrders: ServiceOrderRepository;
  termsTemplates: TermsTemplateRepository;
}

/** Monta o contexto (injeção de dependência) conforme o modo de banco. */
export function createContext(): AppContext {
  if (env.dbMode === "supabase") {
    return {
      storage: new SupabaseStorageAdapter(),
      serviceOrders: new SupabaseServiceOrderRepository(),
      termsTemplates: new SupabaseTermsTemplateRepository(),
    };
  }
  const baseUrl = `http://localhost:${env.port}`;
  return {
    storage: new MockStorageAdapter(baseUrl),
    serviceOrders: new InMemoryServiceOrderRepository(),
    termsTemplates: new InMemoryTermsTemplateRepository(),
  };
}
