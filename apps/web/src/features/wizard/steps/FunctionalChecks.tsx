import { useWizard } from "../../../store/wizard.js";
import { CheckRow } from "./CheckRow.js";

const FUNCTIONAL = [
  { key: "camera", title: "Câmera (frontal e traseira)" },
  { key: "sound", title: "Som / microfone na chamada" },
  { key: "loud_speaker", title: "Alto-falante (viva-voz)" },
  { key: "touch", title: "Touch da tela" },
  { key: "buttons", title: "Botões (power, volume)" },
] as const;

export function FunctionalChecks() {
  const powersOn = useWizard((s) => s.devicePowersOn);
  const setPowersOn = useWizard((s) => s.setDevicePowersOn);

  return (
    <div>
      <label className="mb-3 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={powersOn}
          onChange={(e) => setPowersOn(e.target.checked)}
        />
        O aparelho liga e permite testes funcionais
      </label>

      {powersOn ? (
        <>
          <p className="mb-2 text-sm text-slate-500">
            Teste cada função e marque o resultado.
          </p>
          {FUNCTIONAL.map((f) => (
            <CheckRow
              key={f.key}
              type="functional"
              checkKey={f.key}
              title={f.title}
              okLabel="Funciona"
              failLabel="Não funciona"
            />
          ))}
        </>
      ) : (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          Aparelho não liga — testes funcionais pulados. Isso será registrado na
          OS.
        </p>
      )}
    </div>
  );
}
