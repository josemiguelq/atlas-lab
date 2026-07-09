import { useState } from "react";
import { faceLabel, type DeviceFace } from "@atlas/shared";
import { useWizard, type LocalPhoto } from "../../../store/wizard.js";
import { PhoneFigure } from "../../device-2d/PhoneFigure.js";

const FACES: DeviceFace[] = ["front", "back"];

export function InspectionPhotosStep() {
  const defects = useWizard((s) => s.defects);
  const addDefect = useWizard((s) => s.addDefect);
  const removeDefect = useWizard((s) => s.removeDefect);
  const problemReport = useWizard((s) => s.problemReport);
  const setProblemReport = useWizard((s) => s.setProblemReport);
  const photos = useWizard((s) => s.photos);
  const addPhoto = useWizard((s) => s.addPhoto);
  const removePhoto = useWizard((s) => s.removePhoto);

  const [face, setFace] = useState<DeviceFace>("front");
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null);
  const [note, setNote] = useState("");

  const numbered = defects.map((d, i) => ({ ...d, n: i + 1 }));
  const markers = numbered
    .filter((d) => d.face === face)
    .map((d) => ({ x: d.x, y: d.y, n: d.n }));

  function confirm() {
    if (!pending || !note.trim()) return;
    addDefect({ face, x: pending.x, y: pending.y, note: note.trim() });
    setPending(null);
    setNote("");
  }

  function onFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file, idx) => {
      const photo: LocalPhoto = {
        id: `${Date.now()}-${idx}-${file.name}`,
        blob: file,
        previewUrl: URL.createObjectURL(file),
        label: `Foto ${photos.length + idx + 1}`,
      };
      addPhoto(photo);
    });
  }

  return (
    <div className="space-y-6">
      {/* Relato do problema */}
      <div>
        <label className="label">Relato do problema</label>
        <textarea
          className="field h-24 resize-none"
          value={problemReport}
          onChange={(e) => setProblemReport(e.target.value)}
          placeholder="Descreva o problema relatado pelo cliente…"
        />
      </div>

      {/* Desenho + marcação lado a lado */}
      <div>
        <p className="mb-3 text-sm text-slate-500">
          Toque no aparelho para marcar onde está o defeito. Alterne entre{" "}
          <strong>frente</strong> e <strong>verso</strong>.
        </p>

        {/* seletor de face */}
        <div className="mb-4 flex max-w-[200px] rounded-lg bg-slate-100 p-1">
          {FACES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFace(f);
                setPending(null);
              }}
              className={[
                "flex-1 rounded-md py-1.5 text-sm font-medium transition",
                face === f ? "bg-white text-brand-700 shadow-sm" : "text-slate-500",
              ].join(" ")}
            >
              {faceLabel(f)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <PhoneFigure
            face={face}
            markers={markers}
            pending={pending}
            onPick={(x, y) => {
              setPending({ x, y });
              setNote("");
            }}
            className="max-w-[160px]"
          />

          {/* nota da marcação provisória */}
          {pending && (
            <div className="flex-1 rounded-xl bg-brand-50 p-4">
              <p className="text-xs font-medium text-brand-700">
                Nova marcação em {faceLabel(face)}
              </p>
              <textarea
                className="field mt-2 h-24 resize-none"
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex.: tela trincada, riscado, amassado, câmera embaçada…"
              />
              <div className="mt-2 flex gap-2">
                <button className="btn-primary flex-1" onClick={confirm} disabled={!note.trim()}>
                  Adicionar
                </button>
                <button className="btn-ghost" onClick={() => setPending(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* lista de marcações */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Marcações ({numbered.length})
        </h3>
        <ul className="mt-2 space-y-2">
          {numbered.map((d) => (
            <li
              key={d.n}
              className="flex items-start justify-between gap-2 rounded-lg bg-white p-3 text-sm ring-1 ring-slate-100"
            >
              <div className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {d.n}
                </span>
                <div>
                  <span className="font-medium text-slate-700">
                    {faceLabel(d.face)}
                  </span>
                  <span className="block text-slate-500">{d.note}</span>
                </div>
              </div>
              <button
                className="text-xs text-red-500 hover:underline"
                onClick={() => removeDefect(numbered.indexOf(d))}
              >
                remover
              </button>
            </li>
          ))}
          {numbered.length === 0 && (
            <li className="text-sm text-slate-400">Nenhuma marcação ainda.</li>
          )}
        </ul>
      </div>

      {/* Fotos */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Fotos
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Tire fotos do aparelho (frente, costas e detalhes marcados).
        </p>

        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-200 py-6 text-sm text-slate-500 hover:border-brand-400 hover:bg-brand-50/40">
          <span className="text-xl">📷</span>
          Toque para tirar/enviar fotos
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>

        {photos.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {photos.map((p) => (
              <div key={p.id} className="group relative">
                <img
                  src={p.previewUrl}
                  alt={p.label}
                  className="h-20 w-full rounded-lg object-cover ring-1 ring-slate-200"
                />
                <button
                  onClick={() => removePhoto(p.id)}
                  className="absolute right-1 top-1 hidden rounded-full bg-black/60 px-2 py-0.5 text-xs text-white group-hover:block"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
