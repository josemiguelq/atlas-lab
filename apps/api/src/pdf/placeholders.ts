import type { ServiceOrderEntity } from "../modules/service-order/service-order.domain.js";
import { brl, paymentLabel, datePtBr, dateTimePtBr } from "./format.js";

const PICKUP_DEADLINE_DAYS = 90;

/** Constrói o mapa de placeholders a partir da OS. */
export function buildPlaceholders(
  order: ServiceOrderEntity,
): Record<string, string> {
  const balanceDue = Math.max(order.totalValue - order.amountPaid, 0);
  return {
    customerName: order.customer.name,
    customerPhone: order.customer.phone ?? "—",
    deviceBrand: order.device.brand,
    deviceModel: order.device.model,
    deviceColor: order.device.color ?? "—",
    deviceImei: order.device.imeiUnavailable
      ? "Não fornecido — cliente sem acesso à tela"
      : (order.device.imei ?? "—"),
    totalValue: brl(order.totalValue),
    amountPaid: brl(order.amountPaid),
    balanceDue: brl(balanceDue),
    paymentMethod: paymentLabel(order.paymentMethod),
    deadline: datePtBr(order.desiredDeadline),
    pickupDeadlineDays: String(PICKUP_DEADLINE_DAYS),
    receivedBy: order.receivedBy ?? "—",
    issuedAt: dateTimePtBr(order.createdAt),
  };
}

/** Substitui `{{chave}}` no corpo do template. */
export function resolveTemplate(
  body: string,
  values: Record<string, string>,
): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? "");
}
