import type { DeviceFace } from "../enums.js";

/**
 * Desenho esquemático de um telefone (frente/verso) num viewBox fixo.
 * A mesma especificação alimenta o marcador clicável (web) e o PDF, para que
 * a posição normalizada (0..1) das marcações caia no mesmo lugar nos dois.
 */
export const PHONE_VIEWBOX = { width: 120, height: 240 } as const;

export interface FigureRRect {
  kind: "rrect";
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  fill: string;
  stroke?: string;
}

export interface FigureCircle {
  kind: "circle";
  cx: number;
  cy: number;
  r: number;
  fill: string;
  stroke?: string;
}

export type FigureShape = FigureRRect | FigureCircle;

const BODY_FILL = "#eef2f7";
const PANEL_FILL = "#dbe3ec";
const DETAIL_FILL = "#c3cedb";
const STROKE = "#94a3b8";

const FRONT: FigureShape[] = [
  { kind: "rrect", x: 6, y: 4, w: 108, h: 232, rx: 24, fill: BODY_FILL, stroke: STROKE },
  { kind: "rrect", x: 13, y: 14, w: 94, h: 212, rx: 16, fill: PANEL_FILL, stroke: STROKE },
  { kind: "rrect", x: 48, y: 20, w: 24, h: 7, rx: 3, fill: DETAIL_FILL }, // dynamic island
];

const BACK: FigureShape[] = [
  { kind: "rrect", x: 6, y: 4, w: 108, h: 232, rx: 24, fill: BODY_FILL, stroke: STROKE },
  { kind: "rrect", x: 14, y: 14, w: 46, h: 46, rx: 12, fill: PANEL_FILL, stroke: STROKE }, // módulo de câmera
  { kind: "circle", cx: 27, cy: 27, r: 7, fill: DETAIL_FILL, stroke: STROKE },
  { kind: "circle", cx: 47, cy: 27, r: 7, fill: DETAIL_FILL, stroke: STROKE },
  { kind: "circle", cx: 37, cy: 47, r: 7, fill: DETAIL_FILL, stroke: STROKE },
  { kind: "circle", cx: 54, cy: 18, r: 3, fill: "#f8fafc", stroke: STROKE }, // flash
  { kind: "circle", cx: 60, cy: 140, r: 10, fill: DETAIL_FILL }, // logo
];

export function phoneFigure(face: DeviceFace): FigureShape[] {
  return face === "back" ? BACK : FRONT;
}

export function faceLabel(face: DeviceFace): string {
  return face === "back" ? "Verso" : "Frente";
}
