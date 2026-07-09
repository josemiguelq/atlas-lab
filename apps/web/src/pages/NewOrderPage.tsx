import { useEffect } from "react";
import { Wizard } from "../features/wizard/Wizard.js";
import { useWizard } from "../store/wizard.js";

export function NewOrderPage() {
  const reset = useWizard((s) => s.reset);

  // Começa sempre com um rascunho limpo.
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Nova Ordem de Serviço
      </h1>
      <Wizard />
    </div>
  );
}
