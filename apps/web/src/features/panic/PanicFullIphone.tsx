import { useRef, useState } from "react";

type PanicData = Record<string, unknown> & {
  bug_type?: string;
  os_version?: string;
  timestamp?: string;
  incident_id?: string;
  panicString?: string;
  cpuType?: string;
};

export function PanicFullIphone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [raw, setRaw] = useState<string | null>(null);
  const [parsed, setParsed] = useState<PanicData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"parsed" | "raw">("parsed");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setParsed(null);
    setRaw(null);

    if (!file.name.endsWith(".ips") && !file.name.endsWith(".json")) {
      setError("Formato esperado: .ips (ou .json)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setRaw(text);
      try {
        const obj = JSON.parse(text) as PanicData;
        setParsed(obj);
      } catch {
        setError("Não foi possível interpretar o arquivo como JSON.");
      }
    };
    reader.onerror = () => setError("Erro ao ler o arquivo.");
    reader.readAsText(file);
  }

  return (
    <div className="mt-3 space-y-4">
      {/* Upload */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept=".ips,.json"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-ghost"
        >
          📂 Selecionar arquivo .ips
        </button>
        <span className="ml-3 text-xs text-slate-400">
          {inputRef.current?.files?.[0]?.name ?? "nenhum arquivo"}
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Painel de análise */}
      {parsed && (
        <div className="space-y-4">
          {/* Toggle parsed/raw */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("parsed")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                mode === "parsed"
                  ? "bg-brand-100 text-brand-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Interpretado
            </button>
            <button
              type="button"
              onClick={() => setMode("raw")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                mode === "raw"
                  ? "bg-brand-100 text-brand-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Bruto
            </button>
          </div>

          {mode === "raw" && raw && (
            <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
              {raw}
            </pre>
          )}

          {mode === "parsed" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoCard label="Bug Type" value={parsed.bug_type ?? "—"} />
              <InfoCard label="iOS Version" value={parsed.os_version ?? "—"} />
              <InfoCard label="Timestamp" value={parsed.timestamp ?? "—"} />
              <InfoCard label="Incident ID" value={parsed.incident_id ?? "—"} />
              {parsed.panicString && (
                <div className="sm:col-span-2">
                  <InfoCard label="Panic String" value={parsed.panicString} />
                </div>
              )}
              {parsed.cpuType && (
                <InfoCard label="CPU Type" value={String(parsed.cpuType)} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 break-all text-sm font-mono text-slate-800">
        {value}
      </p>
    </div>
  );
}
