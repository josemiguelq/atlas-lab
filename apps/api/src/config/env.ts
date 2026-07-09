/**
 * Configuração de ambiente. Sem dependências externas: lê `process.env` e
 * aplica defaults que permitem rodar em modo mock (sem Supabase).
 * Node 20+ carrega `.env` automaticamente com a flag `--env-file`; em dev o
 * `tsx` script pode ser trocado, mas aqui mantemos leitura direta de env.
 */

export type DbMode = "mock" | "supabase";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

const dbMode = (process.env.ATLAS_DB ?? "mock") as DbMode;

export const env = {
  port: Number(process.env.PORT ?? 3333),
  host: process.env.HOST ?? "0.0.0.0",
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  isDev: process.env.NODE_ENV !== "production",

  dbMode,
  defaultStoreId:
    process.env.DEFAULT_STORE_ID ?? "00000000-0000-0000-0000-000000000001",

  // Só validados quando realmente usados (modo supabase).
  get supabaseUrl() {
    return required("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "atlas",
} as const;
