---
last_mapped_commit: 8ee1b9954b829144762fbb96036eb9d62ea0347b
last_mapped_at: 2026-10-02
---
# Technology Stack

**Analysis Date:** 2026-10-02

## Languages

**Primary:**
- TypeScript 5.x — Planned for all core packages, SDKs, CLI, and React components
- Markdown — Current specification artifacts (`docs/NG-Address-PRD.md`) and project planning

**Secondary:**
- JavaScript / Node.js — Build scripts, tooling configuration, runtime execution

## Runtime

**Environment:**
- Node.js >= 20.x (LTS) for backend SDK, CLI, and provider adapters
- Browser / DOM environments (Evergreen browsers) for React components (`@ng-address/react`)

**Package Manager:**
- pnpm / npm / yarn (monorepo workspaces recommended: pnpm workspaces or npm workspaces)
- Lockfile: `skills-lock.json` present; `pnpm-lock.yaml` / `package-lock.json` to be established during workspace bootstrap

## Frameworks & Libraries

**Core:**
- TypeScript strict mode — Universal type safety and interface contracts across monorepo packages
- React 18+ / 19+ — Frontend address capture and confirmation components (`@ng-address/react`)
- Commander.js / Clack / CAC — CLI tooling framework (`@ng-address/cli`)
- Zod / Valibot — Runtime schema validation, input parsing, and error mapping

**Testing:**
- Vitest / Jest — Unit and integration test runner for TypeScript packages
- Testing Library / Playwright — React component rendering, accessibility, and E2E workflow testing

**Build/Dev:**
- tsup / unbuild / Vite — Fast TypeScript bundling (ESM + CJS dual publishing)
- ESLint + Prettier / Biome — Linting and code formatting

## Key Dependencies (Planned & Reference)

**Critical:**
- `zod` / `valibot` — Nigerian address schema validation and provenance parsing
- `commander` / `cac` — CLI argument parsing and execution pipeline
- `cross-fetch` / native `fetch` — HTTP client abstraction for provider communication
- `clsx` / `tailwind-merge` / CSS Modules — Styling primitives for unstyled/styled React components

**Infrastructure:**
- Node.js built-ins: `node:crypto`, `node:https`, `node:fs`, `node:path`

## Configuration

**Environment:**
- Environment variables via `.env` / process environment:
  - `NIPOST_API_KEY` / `NIPOST_CLIENT_SECRET` — NIPOST NDAPS service credentials (server-side only)
  - `NG_ADDRESS_ENV` — `sandbox` | `production` environment selector
  - `NG_ADDRESS_CACHE` — Cache backend configuration (`memory`, `redis`, `disabled`)

**Build:**
- `tsconfig.json` (base + per-package configs)
- Monorepo package manifests (`packages/*/package.json`)

## Platform Requirements

**Development:**
- macOS, Linux, Windows with Node.js >= 20.x

**Production:**
- Distributed as npm packages under `@ng-address/*` scope (`@ng-address/core`, `@ng-address/nipost`, `@ng-address/react`, `@ng-address/cli`)
- Zero client-side leak of provider API credentials; server-side mediation architecture

---

*Stack analysis: 2026-10-02*
*Update after major dependency changes*
