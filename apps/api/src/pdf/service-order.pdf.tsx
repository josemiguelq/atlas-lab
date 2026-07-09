import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Svg,
  Rect,
  Circle,
} from "@react-pdf/renderer";
import {
  PHONE_VIEWBOX,
  phoneFigure,
  faceLabel,
  type DeviceFace,
} from "@atlas/shared";
import type { ServiceOrderEntity } from "../modules/service-order/service-order.domain.js";
import { brl } from "./format.js";

interface NumberedDefect {
  n: number;
  face: DeviceFace;
  x: number;
  y: number;
  note: string;
}

/** Desenha a figura do aparelho (frente ou verso) com os pinos das marcações. */
function DefectFigure({
  face,
  defects,
}: {
  face: DeviceFace;
  defects: NumberedDefect[];
}) {
  const { width, height } = PHONE_VIEWBOX;
  const w = 92;
  const h = (w * height) / width;
  return (
    <View style={{ alignItems: "center", marginRight: 18 }}>
      <Text style={{ fontSize: 8, color: "#666", marginBottom: 2 }}>
        {faceLabel(face)}
      </Text>
      <Svg width={w} height={h} viewBox={`0 0 ${width} ${height}`}>
        {phoneFigure(face).map((s, i) =>
          s.kind === "rrect" ? (
            <Rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx={s.rx}
              ry={s.rx}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={s.stroke ? 1 : 0}
            />
          ) : (
            <Circle
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
        {defects.map((d) => (
          <Circle
            key={d.n}
            cx={d.x * width}
            cy={d.y * height}
            r={8}
            fill="#dc2626"
            stroke="#ffffff"
            strokeWidth={1.5}
          />
        ))}
      </Svg>
      {defects.length > 0 && (
        <Text style={{ fontSize: 7, color: "#999", marginTop: 1 }}>
          {defects.map((d) => d.n).join(", ")}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  h1: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  meta: { fontSize: 9, color: "#666", marginBottom: 12 },
  notice: {
    marginBottom: 12,
    padding: 6,
    borderRadius: 4,
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontSize: 9,
  },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    borderBottom: "1px solid #ddd",
    paddingBottom: 2,
  },
  terms: { fontSize: 9.5, lineHeight: 1.5, whiteSpace: "pre-wrap" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  rowLabel: { flex: 1 },
  rowValue: { fontFamily: "Helvetica-Bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1px solid #333",
    marginTop: 4,
    paddingTop: 4,
  },
  signatureBox: { marginTop: 24, alignItems: "center" },
  signatureImg: { width: 220, height: 90, objectFit: "contain" },
  signatureLine: {
    width: 240,
    borderTop: "1px solid #333",
    marginTop: 4,
    paddingTop: 4,
    textAlign: "center",
    fontSize: 9,
  },
});

export interface ServiceOrderPdfProps {
  order: ServiceOrderEntity;
  resolvedTerms: string;
  signatureUrl: string | null;
}

export function ServiceOrderPdf({
  order,
  resolvedTerms,
  signatureUrl,
}: ServiceOrderPdfProps) {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const numberedDefects: NumberedDefect[] = order.defects.map((d, i) => ({
    n: i + 1,
    face: d.face,
    x: d.x,
    y: d.y,
    note: d.note,
  }));
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Ordem de Serviço #{shortId}</Text>
        <Text style={styles.meta}>
          {order.customer.name} • {order.device.brand} {order.device.model}
        </Text>

        {order.device.imeiUnavailable && (
          <View style={styles.notice}>
            <Text>
              O cliente não pôde fornecer o IMEI do aparelho (sem acesso à tela).
            </Text>
          </View>
        )}

        {order.defects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Marcações do aparelho ({order.defects.length})
            </Text>
            <View style={{ flexDirection: "row", marginBottom: 6 }}>
              <DefectFigure
                face="front"
                defects={numberedDefects.filter((d) => d.face === "front")}
              />
              <DefectFigure
                face="back"
                defects={numberedDefects.filter((d) => d.face === "back")}
              />
            </View>
            {numberedDefects.map((d) => (
              <View key={d.n} style={styles.row}>
                <Text style={styles.rowLabel}>
                  {d.n}. {faceLabel(d.face)}
                </Text>
                <Text>{d.note}</Text>
              </View>
            ))}
          </View>
        )}

        {order.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Peças e serviços</Text>
            {order.items.map((i) => (
              <View key={i.id} style={styles.row}>
                <Text style={styles.rowLabel}>
                  [{i.kind === "part" ? "Peça" : "Serviço"}] {i.description}
                </Text>
                <Text style={styles.rowValue}>R$ {brl(i.value)}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.rowLabel}>Total</Text>
              <Text style={styles.rowValue}>R$ {brl(order.totalValue)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Pago na entrada</Text>
              <Text>R$ {brl(order.amountPaid)}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Termos</Text>
          <Text style={styles.terms}>{resolvedTerms}</Text>
        </View>

        <View style={styles.signatureBox}>
          {signatureUrl ? (
            <Image style={styles.signatureImg} src={signatureUrl} />
          ) : null}
          <Text style={styles.signatureLine}>{order.customer.name}</Text>
        </View>
      </Page>
    </Document>
  );
}
