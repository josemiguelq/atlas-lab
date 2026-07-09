import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api.js";
import { useWizard } from "../../../store/wizard.js";
import { brl } from "../../../lib/format.js";

type Status = "idle" | "submitting" | "done" | "error";

export function FinalizeStep() {
  const state = useWizard();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const { createdOrder, pdfUrl } = state;

  async function submit() {
    setStatus("submitting");
    setError(null);
    try {
      const order = await api.createServiceOrder(state.buildPayload());
      state.setCreatedOrder(order);

      // Sobe as fotos capturadas para a OS recém-criada.
      for (const photo of state.photos) {
        await api.uploadPhoto(order.id, photo.blob, photo.label);
      }

      const { pdfUrl } = await api.generatePdf(order.id);
      state.setPdfUrl(pdfUrl);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar a OS");
      setStatus("error");
    }
  }

  if (status === "done" && createdOrder) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          ✅
        </div>
        <h3 className="mt-3 text-lg font-semibold">OS criada com sucesso!</h3>
        <p className="mt-1 text-sm text-slate-500">
          #{createdOrder.id.slice(0, 8).toUpperCase()} · {createdOrder.customer.name}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {pdfUrl && (
            <a className="btn-primary" href={pdfUrl} target="_blank" rel="noreferrer">
              📄 Abrir / imprimir PDF
            </a>
          )}
          <Link className="btn-ghost" to={`/os/${createdOrder.id}`}>
            Ver OS
          </Link>
          <button
            className="btn-ghost"
            onClick={() => {
              state.reset();
            }}
          >
            Nova OS
          </button>
        </div>
      </div>
    );
  }

  const balance = Math.max(state.budget.totalValue - state.budget.amountPaid, 0);

  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">
        Revise o resumo e gere a Ordem de Serviço.
      </p>
      <dl className="grid grid-cols-2 gap-y-2 rounded-xl bg-slate-50 p-4 text-sm">
        <dt className="text-slate-400">Cliente</dt>
        <dd className="text-right font-medium">{state.customer.name || "—"}</dd>
        <dt className="text-slate-400">Aparelho</dt>
        <dd className="text-right font-medium">
          {state.device.brand} {state.device.model || "—"}
        </dd>
        <dt className="text-slate-400">Defeitos marcados</dt>
        <dd className="text-right font-medium">{state.defects.length}</dd>
        <dt className="text-slate-400">Fotos</dt>
        <dd className="text-right font-medium">{state.photos.length}</dd>
        <dt className="text-slate-400">Total</dt>
        <dd className="text-right font-medium">{brl(state.budget.totalValue)}</dd>
        <dt className="text-slate-400">Pago / Saldo</dt>
        <dd className="text-right font-medium">
          {brl(state.budget.amountPaid)} / {brl(balance)}
        </dd>
      </dl>

      {!state.signatureDataUrl && (
        <p className="mt-3 text-xs text-amber-600">
          Dica: volte ao passo de termos para capturar a assinatura do cliente.
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex items-center justify-between">
        <button
          className="btn-ghost"
          onClick={state.prev}
          disabled={status === "submitting"}
        >
          ← Voltar
        </button>
        <button
          className="btn-primary"
          onClick={submit}
          disabled={status === "submitting" || !state.termsTemplateId}
        >
          {status === "submitting" ? "Gerando…" : "Gerar OS"}
        </button>
      </div>
    </div>
  );
}
