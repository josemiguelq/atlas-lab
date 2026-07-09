import { CheckRow } from "./CheckRow.js";
import { FunctionalChecks } from "./FunctionalChecks.js";

export function PhysicalFunctionalStep() {
  return (
    <div>
      <p className="mb-4 text-sm text-slate-500">
        Confirme o estado físico e os testes funcionais do aparelho.
      </p>

      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Estado físico
      </h3>
      <CheckRow
        type="physical"
        checkKey="bent"
        title="O aparelho está reto (não está torto/empenado)?"
        okLabel="Está reto"
        failLabel="Está torto"
      />
      <CheckRow
        type="physical"
        checkKey="swollen_battery"
        title="A bateria está normal (não está inchada)?"
        hint="Bateria inchada exige cuidado no manuseio."
        okLabel="Normal"
        failLabel="Inchada"
      />

      <h3 className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Testes funcionais
      </h3>
      <FunctionalChecks />
    </div>
  );
}
