import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { faceLabel, type DeviceFace } from "@atlas/shared";
import { api } from "../lib/api.js";
import { brl } from "../lib/format.js";
import { PhoneFigure } from "../features/device-2d/PhoneFigure.js";

export function ViewOrderPage() {
  const { id = "" } = useParams();
  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.getServiceOrder(id),
  });

  if (isLoading) return <p className="text-slate-400">Carregando…</p>;
  if (error || !order)
    return <p className="text-red-500">OS não encontrada.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            OS #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-slate-500">
            {order.customer.name} · {order.device.brand} {order.device.model}
          </p>
        </div>
        {order.pdfUrl && (
          <a className="btn-primary" href={order.pdfUrl} target="_blank" rel="noreferrer">
            📄 PDF
          </a>
        )}
      </div>

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Marcações ({order.defects.length})
        </h2>
        {order.defects.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhuma marcação.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr]">
            <div className="flex justify-center gap-4">
              {(["front", "back"] as DeviceFace[]).map((f) => {
                const ms = order.defects
                  .map((d, i) => ({ ...d, n: i + 1 }))
                  .filter((d) => d.face === f)
                  .map((d) => ({ x: d.x, y: d.y, n: d.n }));
                return (
                  <div key={f} className="w-24">
                    <p className="mb-1 text-center text-xs text-slate-400">
                      {faceLabel(f)}
                    </p>
                    <PhoneFigure face={f} markers={ms} />
                  </div>
                );
              })}
            </div>
            <ul className="space-y-1 text-sm">
              {order.defects.map((d, i) => (
                <li key={d.id} className="flex gap-2 border-b border-slate-50 py-1">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="font-medium">{faceLabel(d.face)}</span>
                  <span className="text-slate-500">— {d.note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {order.photos.length > 0 && (
        <section className="card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Fotos
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {order.photos.map((p) =>
              p.url ? (
                <img
                  key={p.id}
                  src={p.url}
                  alt={p.label ?? "foto"}
                  className="h-28 w-full rounded-lg object-cover ring-1 ring-slate-200"
                />
              ) : null,
            )}
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Financeiro
        </h2>
        <ul className="space-y-1 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>{i.description}</span>
              <span className="font-medium">{brl(i.value)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm">
          <span>Total</span>
          <strong>{brl(order.totalValue)}</strong>
        </div>
        <div className="flex justify-between text-sm text-slate-500">
          <span>Pago na entrada</span>
          <span>{brl(order.amountPaid)}</span>
        </div>
      </section>

      <Link to="/os/new" className="btn-ghost">
        ← Nova OS
      </Link>
    </div>
  );
}
