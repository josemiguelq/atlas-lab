import type { StoragePort, StoredFile } from "./storage.port.js";

/**
 * Armazenamento em memória para o modo mock. Os bytes ficam num Map e são
 * servidos via `GET /storage/*`. Suficiente para percorrer o wizard sem Supabase.
 */
export class MockStorageAdapter implements StoragePort {
  private files = new Map<string, Buffer>();

  constructor(private readonly publicBaseUrl: string) {}

  async upload({
    path,
    data,
  }: {
    path: string;
    data: Buffer;
    contentType: string;
  }): Promise<StoredFile> {
    this.files.set(path, data);
    return { path };
  }

  getPublicUrl(path: string): string | null {
    return `${this.publicBaseUrl}/storage/${path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
  }

  read(path: string): Buffer | null {
    return this.files.get(path) ?? null;
  }
}
