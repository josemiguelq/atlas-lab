import { WIZARD_STEPS, useWizard, type WizardState } from "../../store/wizard.js";
import { WizardProgress } from "./WizardProgress.js";
import { CustomerStep } from "./steps/CustomerStep.js";
import { DeviceStep } from "./steps/DeviceStep.js";
import { InspectionPhotosStep } from "./steps/InspectionPhotosStep.js";
import { PhysicalFunctionalStep } from "./steps/PhysicalFunctionalStep.js";
import { BudgetStep } from "./steps/BudgetStep.js";
import { TermsStep } from "./steps/TermsStep.js";
import { FinalizeStep } from "./steps/FinalizeStep.js";

interface StepDef {
  Component: () => JSX.Element;
  canProceed?: (s: WizardState) => boolean;
}

const STEPS: StepDef[] = [
  { Component: CustomerStep, canProceed: (s) => s.customer.name.trim().length > 0 },
  { Component: DeviceStep, canProceed: (s) => s.device.model.trim().length > 0 },
  { Component: InspectionPhotosStep },
  { Component: PhysicalFunctionalStep },
  { Component: BudgetStep },
  { Component: TermsStep, canProceed: (s) => Boolean(s.termsTemplateId) },
  { Component: FinalizeStep },
];

export function Wizard() {
  const state = useWizard();
  const { step, next, prev } = state;
  const current = STEPS[step]!;
  const isLast = step === WIZARD_STEPS.length - 1;
  const canProceed = current.canProceed ? current.canProceed(state) : true;

  return (
    <div>
      <WizardProgress />
      <div className="card">
        <h2 className="mb-1 text-xl font-semibold tracking-tight">
          {WIZARD_STEPS[step]}
        </h2>
        <div className="mt-5">
          <current.Component />
        </div>
      </div>

      {!isLast && (
        <div className="mt-6 flex items-center justify-between">
          <button
            className="btn-ghost"
            onClick={prev}
            disabled={step === 0}
          >
            ← Voltar
          </button>
          <button className="btn-primary" onClick={next} disabled={!canProceed}>
            Continuar →
          </button>
        </div>
      )}
    </div>
  );
}
