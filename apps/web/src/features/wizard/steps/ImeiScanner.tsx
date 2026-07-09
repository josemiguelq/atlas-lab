import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";

interface Props {
  onDetected: (digits: string) => void;
  onClose: () => void;
}

/**
 * Lê o código de barras do IMEI (Code 128 na caixa/bandeja do SIM) usando a
 * câmera traseira. Extrai os 15 dígitos e devolve ao formulário.
 */
export function ImeiScanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let controls: IScannerControls | undefined;
    let cancelled = false;

    reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current!,
        (result, _err, ctrl) => {
          controls = ctrl;
          if (cancelled) {
            ctrl.stop();
            return;
          }
          if (result) {
            const digits = result.getText().replace(/\D/g, "");
            if (digits.length >= 15) {
              ctrl.stop();
              onDetectedRef.current(digits.slice(0, 15));
            }
          }
        },
      )
      .then((ctrl) => {
        controls = ctrl;
        if (cancelled) ctrl.stop();
      })
      .catch(() =>
        setError(
          "Não foi possível acessar a câmera. Verifique as permissões do navegador.",
        ),
      );

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-semibold">Escanear IMEI</h3>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="relative bg-black">
          <video
            ref={videoRef}
            className="h-64 w-full object-cover"
            autoPlay
            muted
            playsInline
          />
          {/* guia de enquadramento */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-4/5 rounded-lg border-2 border-brand-400/90" />
          </div>
        </div>
        <div className="px-4 py-3 text-xs text-slate-500">
          {error ?? "Aponte para o código de barras do IMEI (caixa ou bandeja do chip)."}
        </div>
      </div>
    </div>
  );
}
