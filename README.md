# Atlas

Sistema para oficinas de conserto de aparelhos — Geração de OS, ERP de clientes, Tutoriais e Financeiro.

Monolito organizado como **monorepo pnpm**.

## Estrutura

```
apps/
  api/       Fastify + TypeScript (API dedicada)
  web/       Vite + React + React Three Fiber (SPA)
packages/
  shared/    Contratos: schemas TypeBox + tipos + config de hotspots do 3D
supabase/    Migrations SQL + seed
```

## Etapa 1 (foco atual)

Fluxo de criação de OS (estilo tutorial, passo a passo) + modelo 3D do iPhone.
**Sem login** — loja padrão semeada, endpoints abertos. Foco em iPhone.

## Como rodar

```bash
pnpm install

# Supabase local (requer Supabase CLI)
supabase start
supabase db reset          # aplica migrations + seed

# copie apps/api/.env.example -> apps/api/.env e preencha
# copie apps/web/.env.example -> apps/web/.env

pnpm dev                   # sobe api (:3333) e web (:5173) em paralelo
```

Sem Supabase local, a API roda em **modo mock** (`ATLAS_DB=mock`), suficiente para
percorrer o wizard e ver o modelo 3D sem banco.

## Padrões de projeto

- Sem SQL no controller → **repository**.
- **diplomat** = camada DTO/mapper (domínio ↔ payload de API).
- Contratos únicos em `packages/shared` (TypeBox), consumidos por API e web.
- Storage abstraído por **porta** (`StoragePort`), hoje Supabase Storage, futuro S3.
