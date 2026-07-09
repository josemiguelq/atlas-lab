import { FunctionalChecks } from "./FunctionalChecks.js";

export function FunctionalStep() {
  return (
    <div>
      <p className="mb-3 text-sm text-slate-500">
        Teste cada função do aparelho e marque o resultado.
      </p>
      <FunctionalChecks />
    </div>
  );
}
