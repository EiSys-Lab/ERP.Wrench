# Wrench — ERP Oficina

ERP para oficinas autoelétricas. Controle de Ordens de Serviço (peças + mão de obra), estoque, clientes/veículos e faturamento.

**Status:** Front End First — Fase 1 (shell navegável). Backend .NET entra depois do frontend aprovado.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind v4, shadcn (Base UI), Motion v12, TanStack Query v5, Zustand v5, Recharts, cmdk
- **Backend (Fase 4):** .NET 10, FastEndpoints, MediatR, EF Core 10, PostgreSQL 17, Redis 7
- **Design:** Ethereal Glass (Awwwards-tier) — dark default + light, accent ciano elétrico

## Como rodar (desenvolvimento local)

### Opção 1 — Script `.bat` (recomendado no Windows)

```bat
install.bat     :: instala dependências do frontend (uma vez)
dev.bat         :: sobe o frontend em http://localhost:3000
```

### Opção 2 — Manual

```bash
cd src/frontend
bun install      # ou npm install
bun dev          # ou npm run dev
```

Abra http://localhost:3000 → redireciona para `/login`.
**Login mock:** qualquer email/senha (pré-preenchido `admin@wrench.com.br` / `Admin@123`).

## Docker (produção containerizada)

```bat
docker-up.bat           :: sobe só o frontend em container
docker-up.bat db        :: sobe postgres + redis (para o backend futuro)
docker-up.bat all       :: sobe frontend + postgres + redis
docker-down.bat         :: para e remove containers (volumes preservados)
docker-down.bat purge   :: para tudo E apaga volumes (dados do banco)
```

### Portas

| Serviço   | Porta host | Observação |
|-----------|------------|------------|
| Frontend  | 3000       | Next.js |
| Backend   | 5012       | .NET (Fase 4) |
| Postgres  | 5434       | DB `wrench_oficina`, user/pass `wrench` (5432=Indagor, 5433=RFClub) |
| Redis     | 6380       | Cache |

## Estrutura

```
ERP-Oficina/
├── *.bat                    :: scripts de automação (dev, docker, install, build, db)
├── docker-compose.yml       :: frontend + postgres + redis
├── .env.example             :: variáveis de ambiente (copiar para .env)
├── Docs/                    :: documentação técnica (a criar)
├── CONTROLE SAIDA...xlsx    :: planilha original (fonte de requisitos)
└── src/
    └── frontend/            :: Next.js 16 (foco atual)
        ├── Dockerfile
        ├── docker-compose.yml
        └── src/
            ├── app/             :: App Router (rotas)
            ├── components/      :: Atomic Design (atoms/molecules/organisms/templates)
            ├── features/        :: feature-sliced (a criar na Fase 2)
            ├── lib/             :: utils, motion, api-client, navigation, formatters
            └── store/           :: Zustand (auth, nav, favorites, command-palette)
```

## Fases

- ✅ **Fase 0** — Setup + Design System Ethereal Glass
- ✅ **Fase 1** — Shell navegável (login, SideNav, TopBar, Command Palette, Workspace)
- ⏳ **Fase 2** — Módulos com mock (Workspace/Dashboard, Ordens de Serviço, Catálogo, Clientes, Estoque)
- ⏳ **Fase 3** — Polimento + aprovação
- ⏸️ **Fase 4-7** — Backend .NET Clean Arch + integração
