import type { PaymentMethod } from "@atlas/shared";

export function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Dinheiro",
  pix: "Pix",
  credit: "Cartão de crédito",
  debit: "Cartão de débito",
  transfer: "Transferência",
  other: "Outro",
};

export function paymentLabel(method: PaymentMethod | null): string {
  return method ? (PAYMENT_LABELS[method] ?? "—") : "—";
}

export function dateTimePtBr(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function datePtBr(iso: string | null): string {
  if (!iso) return "a combinar";
  return new Date(iso).toLocaleDateString("pt-BR");
}
