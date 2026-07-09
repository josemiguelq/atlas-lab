import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import SignatureCanvas from "react-signature-canvas";
import { api } from "../../../lib/api.js";
import { useWizard } from "../../../store/wizard.js";

export function TermsStep() {
  const termsTemplateId = useWizard((s) => s.termsTemplateId);
  const setTermsTemplate = useWizard((s) => s.setTermsTemplate);
  const setSignature = useWizard((s) => s.setSignature);
  const signatureDataUrl = useWizard((s) => s.signatureDataUrl);
  const sigRef = useRef<SignatureCanvas>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Ajusta a resolução do canvas ao container para que o traço caia no lugar
  // certo no mobile (canvas esticado por CSS desalinha o ponteiro).
  useEffect(() => {
    const canvas = sigRef.current?.getCanvas();
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const resize = () => {
      canvas.width = wrap.clientWidth;
      canvas.height = 160;
      setSignature(undefined);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["terms-templates"],
    queryFn: api.listTermsTemplates,
  });

  const selected = templates?.find((t) => t.id === termsTemplateId);

  function saveSignature() {
    const canvas = sigRef.current;
    if (!canvas || canvas.isEmpty()) return;
    setSignature(canvas.toDataURL("image/png"));
  }

  function clearSignature() {
    sigRef.current?.clear();
    setSignature(undefined);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-600">
          Modelo de termos
        </h3>
        {isLoading && <p className="text-sm text-slate-400">Carregando…</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {templates?.map((t) => (
            <button
              key={t.id}
              onClick={() => setTermsTemplate(t.id)}
              className={[
                "rounded-xl border p-4 text-left transition",
                termsTemplateId === t.id
                  ? "border-brand-500 ring-2 ring-brand-100"
                  : "border-slate-200 hover:border-slate-300",
              ].join(" ")}
            >
              <p className="text-sm font-medium text-slate-700">{t.name}</p>
              {t.isDefault && (
                <span className="text-[10px] font-semibold uppercase text-brand-500">
                  Padrão
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-slate-600">Prévia</h3>
          <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            {selected.body}
          </pre>
          <p className="mt-1 text-[11px] text-slate-400">
            Os campos entre chaves são preenchidos automaticamente no PDF.
          </p>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-600">
          Assinatura do cliente
        </h3>
        <div
          ref={wrapRef}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <SignatureCanvas
            ref={sigRef}
            penColor="#111827"
            onEnd={saveSignature}
            canvasProps={{ className: "block touch-none" }}
          />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <button className="btn-ghost" onClick={clearSignature}>
            Limpar
          </button>
          <span className="text-xs text-slate-400">
            {signatureDataUrl ? "✓ Assinatura capturada" : "Assine acima"}
          </span>
        </div>
      </div>
    </div>
  );
}
