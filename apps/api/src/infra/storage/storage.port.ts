/**
 * Porta de armazenamento de arquivos. Hoje implementada por Supabase Storage;
 * no futuro pode ser trocada por um adaptador S3 sem tocar nos serviços.
 */
export interface StoredFile {
  path: string;
}

export interface StoragePort {
  upload(params: {
    path: string;
    data: Buffer;
    contentType: string;
  }): Promise<StoredFile>;

  /** URL pública (ou assinada) para exibir/baixar o arquivo. */
  getPublicUrl(path: string): string | null;

  /** Recupera bytes (usado pelo modo mock que serve arquivos via HTTP). */
  read(path: string): Buffer | null;
}
