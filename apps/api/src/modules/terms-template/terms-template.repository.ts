import type { TermsTemplate } from "@atlas/shared";
import { getSupabase } from "../../infra/supabase.js";
import { DEFAULT_TERMS_TEMPLATES } from "./terms-template.defaults.js";

export interface TermsTemplateRepository {
  list(storeId: string): Promise<TermsTemplate[]>;
  findById(storeId: string, id: string): Promise<TermsTemplate | null>;
}

/** Modo mock: serve os templates globais padrão. */
export class InMemoryTermsTemplateRepository implements TermsTemplateRepository {
  async list(): Promise<TermsTemplate[]> {
    return DEFAULT_TERMS_TEMPLATES;
  }
  async findById(_storeId: string, id: string): Promise<TermsTemplate | null> {
    return DEFAULT_TERMS_TEMPLATES.find((t) => t.id === id) ?? null;
  }
}

/** Modo supabase: templates globais (store_id null) + os da loja. */
export class SupabaseTermsTemplateRepository
  implements TermsTemplateRepository
{
  async list(storeId: string): Promise<TermsTemplate[]> {
    const { data, error } = await getSupabase()
      .from("terms_templates")
      .select("*")
      .or(`store_id.is.null,store_id.eq.${storeId}`)
      .order("is_default", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRow);
  }

  async findById(storeId: string, id: string): Promise<TermsTemplate | null> {
    const { data, error } = await getSupabase()
      .from("terms_templates")
      .select("*")
      .eq("id", id)
      .or(`store_id.is.null,store_id.eq.${storeId}`)
      .maybeSingle();
    if (error) throw error;
    return data ? mapRow(data) : null;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): TermsTemplate {
  return {
    id: row.id,
    storeId: row.store_id,
    name: row.name,
    body: row.body,
    isDefault: row.is_default,
  };
}
