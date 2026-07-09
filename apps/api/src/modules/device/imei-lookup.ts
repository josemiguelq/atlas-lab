import type { ImeiLookupResult } from "@atlas/shared";

/**
 * Lookup por IMEI — STUB da Etapa 1. Usa o TAC (primeiros 8 dígitos) para
 * inferir o modelo a partir de uma pequena tabela local. Numa fase futura,
 * troca-se por uma base real (GSX/TAC) sem mudar o contrato.
 */
const TAC_TABLE: Record<string, { model: string }> = {
  "35328511": { model: "iPhone 13" },
  "35674108": { model: "iPhone 14" },
  "35123456": { model: "iPhone 15 Pro" },
  "35946110": { model: "iPhone 12" },
};

export function lookupImei(imeiRaw: string): ImeiLookupResult {
  const imei = imeiRaw.replace(/\D/g, "");
  const tac = imei.slice(0, 8);
  const hit = TAC_TABLE[tac];
  return {
    imei,
    kind: "phone",
    brand: "Apple",
    model: hit?.model ?? "iPhone (modelo a confirmar)",
    matched: Boolean(hit),
  };
}
