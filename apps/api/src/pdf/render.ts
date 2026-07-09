import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { TermsTemplate } from "@atlas/shared";
import type { ServiceOrderEntity } from "../modules/service-order/service-order.domain.js";
import { ServiceOrderPdf } from "./service-order.pdf.js";
import { buildPlaceholders, resolveTemplate } from "./placeholders.js";

/** Gera o PDF da OS como Buffer, resolvendo o template escolhido. */
export async function renderServiceOrderPdf(params: {
  order: ServiceOrderEntity;
  template: TermsTemplate;
  signatureUrl: string | null;
}): Promise<Buffer> {
  const resolvedTerms = resolveTemplate(
    params.template.body,
    buildPlaceholders(params.order),
  );
  const element = createElement(ServiceOrderPdf, {
    order: params.order,
    resolvedTerms,
    signatureUrl: params.signatureUrl,
  }) as unknown as ReactElement<DocumentProps>;
  return renderToBuffer(element);
}
