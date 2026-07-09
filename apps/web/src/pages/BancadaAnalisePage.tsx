import { PanicFullIphone } from "../features/panic/PanicFullIphone.js";

type Tool = {
  id: string;
  label: string;
  description: string;
  component?: () => JSX.Element;
  disabled?: boolean;
};

const TOOLS: Tool[] = [
  {
    id: "panic-full-iphone",
    label: "Panic Full iPhone",
    description: "Analisa arquivos .ips de panic do iOS e exibe as principais informações do crash do kernel.",
    component: PanicFullIphone,
  },
  {
    id: "identificador-foto",
    label: "Identificador de celular por foto",
    description: "Identifica o modelo exato do iPhone a partir de uma foto do aparelho.",
    disabled: true,
  },
  {
    id: "validador-compatibilidade",
    label: "Validador de compatibilidade",
    description: "Verifica se duas peças ou modelos são compatíveis entre si.",
    disabled: true,
  },
];

export function BancadaAnalisePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Bancada • Análise</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ferramentas para diagnóstico e analysis de dispositivos.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {TOOLS.map((tool) => (
          <section
            key={tool.id}
            className={`card ${tool.disabled ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">{tool.label}</h2>
              {tool.disabled && (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                  Em breve
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
            {tool.component && <div className="mt-3"><tool.component /></div>}
          </section>
        ))}
      </div>
    </div>
  );
}
