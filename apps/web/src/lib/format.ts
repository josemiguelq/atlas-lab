export function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseMoney(input: string): number {
  const n = Number(input.replace(/[^\d.,-]/g, "").replace(".", "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

// ---- IMEI -------------------------------------------------------------------

/** Mantém só dígitos e limita ao tamanho do IMEI (15). */
export function imeiDigits(input: string): string {
  return input.replace(/\D/g, "").slice(0, 15);
}

/**
 * Máscara de exibição no padrão GSMA: TAC(8) · SNR(6) · CD(1).
 * Ex.: "353285110123456" -> "35328511 012345 6"
 */
export function formatImei(input: string): string {
  const d = imeiDigits(input);
  return [d.slice(0, 8), d.slice(8, 14), d.slice(14, 15)]
    .filter(Boolean)
    .join(" ");
}

/** Valida os 15 dígitos do IMEI pelo dígito verificador (Luhn). */
export function isValidImei(input: string): boolean {
  const d = imeiDigits(input);
  if (d.length !== 15) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let n = Number(d[i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}
