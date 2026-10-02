# Technology Stack Research

**Domain:** Nigerian Address Infrastructure / Developer SDKs
**Date:** 2026-10-02
**Status:** Validated

## Recommended Architecture & Workspace

### 1. Monorepo Structure
- **Package Manager:** `pnpm` workspaces (fast, deterministic disk space sharing, strict dependency resolution).
- **Workspace Packages:**
  - `@ng-address/core` — Canonical TypeScript types, schemas, validation primitives, error types, provider interfaces.
  - `@ng-address/nipost` — NIPOST NDAPS provider client, auth adapter, and response mapper.
  - `@ng-address/react` — React component library (`<NigerianAddressInput />`, postcode input hooks, accessible confirmation UI).
  - `@ng-address/cli` — Command-line interface (`ng-address lookup`, `validate`, `search`).

### 2. Core Libraries & Validation
- **Schema Validation:** `zod` (v3) / `valibot`
  - Provides type inference and runtime validation.
  - Zero dependencies for core schemas.
- **HTTP & Resilience:** Native `fetch` with `ky` or standard fetch abstraction + exponential backoff retry utility.
- **Build Tooling:** `tsup` (esbuild-backed, generates `.d.ts`, `.mjs`, and `.cjs` dual distribution).

### 3. Frontend & Accessibility
- **UI Primitive Base:** Radix UI / React primitives or headless custom accessible combobox.
- **Styling Strategy:** Unstyled with accessible data attributes + optional Tailwind / CSS classes.
- **Accessibility:** Tested against WCAG 2.2 AA using `axe-core` and keyboard navigation contracts.

### 4. Testing & CI/CD
- **Unit & Integration Testing:** `vitest` with native ESM and TypeScript coverage.
- **E2E & Component Testing:** `playwright` + `@testing-library/react`.
- **Linting & Formatting:** ESLint + Prettier or Biome.

---
*Stack research: 2026-10-02*
