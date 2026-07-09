import type {
  CreateServiceOrder,
  ServiceOrder,
  TermsTemplate,
  ImeiLookupResult,
  Photo,
} from "@atlas/shared";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    ...((init?.headers as Record<string, string>) ?? {}),
  };
  // Só declara JSON quando há corpo — evita o erro do Fastify
  // "Body cannot be empty when content-type is set to 'application/json'"
  // em POSTs sem body (ex.: gerar PDF).
  if (init?.body != null) headers["content-type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Erro ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listTermsTemplates: () => request<TermsTemplate[]>("/terms-templates"),

  lookupImei: (imei: string) =>
    request<ImeiLookupResult>(`/devices/lookup?imei=${encodeURIComponent(imei)}`),

  createServiceOrder: (input: CreateServiceOrder) =>
    request<ServiceOrder>("/service-orders", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  getServiceOrder: (id: string) =>
    request<ServiceOrder>(`/service-orders/${id}`),

  generatePdf: (id: string) =>
    request<{ pdfUrl: string }>(`/service-orders/${id}/pdf`, { method: "POST" }),

  async uploadPhoto(orderId: string, file: Blob, label: string): Promise<Photo> {
    const form = new FormData();
    form.append("label", label);
    form.append("file", file, "photo.jpg");
    const res = await fetch(`${BASE_URL}/service-orders/${orderId}/photos`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error(`Falha no upload (${res.status})`);
    return res.json() as Promise<Photo>;
  },
};
