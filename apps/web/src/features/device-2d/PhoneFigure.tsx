import { PHONE_VIEWBOX, phoneFigure, type DeviceFace } from "@atlas/shared";

export interface FigureMarker {
  x: number;
  y: number;
  n: number;
}

interface Props {
  face: DeviceFace;
  markers: FigureMarker[];
  pending?: { x: number; y: number } | null;
  onPick?: (x: number, y: number) => void;
  className?: string;
}

/**
 * Desenho 2D do aparelho (frente/verso) com pinos das marcações sobrepostos.
 * Responsivo: mantém o aspecto do viewBox; os pinos usam posição percentual,
 * então acompanham qualquer largura. Se `onPick`, o clique vira coordenada
 * normalizada (0..1).
 */
export function PhoneFigure({
  face,
  markers,
  pending,
  onPick,
  className,
}: Props) {
  const { width, height } = PHONE_VIEWBOX;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!onPick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    onPick(x, y);
  }

  return (
    <div
      className={[
        "relative mx-auto w-full",
        onPick ? "cursor-crosshair" : "",
        className ?? "",
      ].join(" ")}
      style={{ aspectRatio: `${width} / ${height}` }}
      onClick={handleClick}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {phoneFigure(face).map((s, i) =>
          s.kind === "rrect" ? (
            <rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx={s.rx}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={s.stroke ? 1 : 0}
            />
          ) : (
            <circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={s.stroke ? 1 : 0}
            />
          ),
        )}
      </svg>

      {/* pinos das marcações */}
      {markers.map((m) => (
        <span
          key={m.n}
          className="pointer-events-none absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white shadow"
          style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%` }}
        >
          {m.n}
        </span>
      ))}

      {/* pino provisório */}
      {pending && (
        <span
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-2 border-white bg-brand-500 shadow"
          style={{ left: `${pending.x * 100}%`, top: `${pending.y * 100}%` }}
        />
      )}
    </div>
  );
}
