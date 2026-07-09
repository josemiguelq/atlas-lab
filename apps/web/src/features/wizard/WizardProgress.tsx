import { WIZARD_STEPS, useWizard } from "../../store/wizard.js";

export function WizardProgress() {
  const step = useWizard((s) => s.step);
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1.5">
        {WIZARD_STEPS.map((_, i) => (
          <div
            key={i}
            className={[
              "h-1.5 flex-1 rounded-full transition",
              i < step
                ? "bg-brand-500"
                : i === step
                  ? "bg-brand-400"
                  : "bg-slate-200",
            ].join(" ")}
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-medium text-slate-400">
        Passo {step + 1} de {WIZARD_STEPS.length} · {WIZARD_STEPS[step]}
      </p>
    </div>
  );
}
