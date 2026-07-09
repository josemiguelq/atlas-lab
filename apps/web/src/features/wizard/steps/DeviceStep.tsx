import { useState } from "react";
import { api } from "../../../lib/api.js";
import { useWizard } from "../../../store/wizard.js";
import { formatImei, imeiDigits, isValidImei } from "../../../lib/format.js";
import { ImeiScanner } from "./ImeiScanner.js";
import { IPHONE_COLORS } from "../../../lib/iphone.js";

const IPHONE_MODELS = [
  "iPhone 11",
  "iPhone 12",
  "iPhone 13",
  "iPhone 14",
  "iPhone 15",
  "iPhone 15 Pro",
];

export function DeviceStep() {
  const device = useWizard((s) => s.device);
  const setDevice = useWizard((s) => s.setDevice);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [scanOpen, setScanOpen] = useState(false);

  const digits = imeiDigits(device.imei ?? "");
  const complete = digits.length === 15;
  const valid = isValidImei(digits);
  const unavailable = device.imeiUnavailable ?? false;

  async function lookup() {
    if (digits.length < 8) return;
    setLoading(true);
    setMsg(null);
    try {
      const r = await api.lookupImei(digits);
      setDevice({ brand: r.brand, model: r.model, kind: r.kind });
      setMsg(
        r.matched
          ? `Identificado: ${r.brand} ${r.model}`
          : "IMEI não encontrado na base — confirme o modelo manualmente.",
      );
    } catch {
      setMsg("Falha ao consultar o IMEI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">IMEI</label>
        <div className="flex gap-2">
          <input
            className="field font-mono tracking-wider disabled:bg-slate-100 disabled:text-slate-400"
            value={unavailable ? "" : formatImei(device.imei ?? "")}
            onChange={(e) => setDevice({ imei: imeiDigits(e.target.value) })}
            placeholder={unavailable ? "Sem acesso ao IMEI" : "35328511 012345 6"}
            inputMode="numeric"
            disabled={unavailable}
            aria-invalid={complete && !valid}
          />
          <button
            type="button"
            className="btn-ghost px-3"
            onClick={() => setScanOpen(true)}
            title="Escanear IMEI com a câmera"
            disabled={unavailable}
          >
            📷
          </button>
          <button
            className="btn-ghost whitespace-nowrap"
            onClick={lookup}
            disabled={loading || unavailable || digits.length < 8}
          >
            {loading ? "Buscando…" : "Buscar por IMEI"}
          </button>
        </div>

        {!unavailable && (
          <div className="mt-1 flex items-center justify-between text-xs">
            <span
              className={
                complete
                  ? valid
                    ? "text-emerald-600"
                    : "text-red-500"
                  : "text-slate-400"
              }
            >
              {complete
                ? valid
                  ? "✓ IMEI válido"
                  : "✗ Dígito verificador inválido"
                : `${digits.length}/15 dígitos · disque *#06# no aparelho`}
            </span>
          </div>
        )}
        {msg && !unavailable && (
          <p className="mt-1 text-xs text-brand-600">{msg}</p>
        )}

        <label className="mt-2 flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={unavailable}
            onChange={(e) =>
              setDevice({
                imeiUnavailable: e.target.checked,
                imei: e.target.checked ? undefined : device.imei,
              })
            }
          />
          Sem acesso ao IMEI (tela quebrada / aparelho não liga)
        </label>
        {unavailable && (
          <p className="mt-1 text-xs text-amber-600">
            Será registrado na OS e no PDF que o cliente não pôde fornecer o IMEI.
          </p>
        )}
      </div>

      <div>
        <label className="label">Marca</label>
        <input
          className="field"
          value={device.brand}
          onChange={(e) => setDevice({ brand: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Modelo *</label>
        <input
          className="field"
          list="iphone-models"
          value={device.model}
          onChange={(e) => setDevice({ model: e.target.value })}
          placeholder="Ex.: iPhone 13"
        />
        <datalist id="iphone-models">
          {IPHONE_MODELS.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </div>
      <div>
        <label className="label">Cor</label>
        <select
          className="field"
          value={device.color ?? ""}
          onChange={(e) => setDevice({ color: e.target.value })}
        >
          <option value="">Selecione…</option>
          {IPHONE_COLORS.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {scanOpen && (
        <ImeiScanner
          onDetected={(d) => {
            setDevice({ imei: d });
            setScanOpen(false);
          }}
          onClose={() => setScanOpen(false)}
        />
      )}
    </div>
  );
}
