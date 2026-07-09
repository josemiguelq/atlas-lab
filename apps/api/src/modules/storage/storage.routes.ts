import type { FastifyTypedInstance } from "../../types.js";

/**
 * Serve arquivos do storage em memória (modo mock) para que fotos/PDFs tenham
 * uma URL acessível. No modo supabase os arquivos vêm da URL pública do bucket.
 */
export async function storageRoutes(app: FastifyTypedInstance) {
  app.get("/storage/*", async (request, reply) => {
    const path = decodeURIComponent(
      (request.params as Record<string, string>)["*"] ?? "",
    );
    const bytes = app.ctx.storage.read(path);
    if (!bytes) return reply.code(404).send({ message: "Arquivo não encontrado" });

    const contentType = path.endsWith(".pdf")
      ? "application/pdf"
      : path.endsWith(".png")
        ? "image/png"
        : "application/octet-stream";
    return reply.header("content-type", contentType).send(bytes);
  });
}
