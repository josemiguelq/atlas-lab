import type { StoragePort, StoredFile } from "./storage.port.js";
import { getSupabase } from "../supabase.js";
import { env } from "../../config/env.js";

/** Adaptador de Storage sobre o Supabase Storage. */
export class SupabaseStorageAdapter implements StoragePort {
  private readonly bucket = env.storageBucket;

  async upload({
    path,
    data,
    contentType,
  }: {
    path: string;
    data: Buffer;
    contentType: string;
  }): Promise<StoredFile> {
    const { error } = await getSupabase()
      .storage.from(this.bucket)
      .upload(path, data, { contentType, upsert: true });
    if (error) throw error;
    return { path };
  }

  getPublicUrl(path: string): string | null {
    const { data } = getSupabase().storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl ?? null;
  }

  read(): Buffer | null {
    // No modo supabase os arquivos são servidos diretamente pela URL pública.
    return null;
  }
}
