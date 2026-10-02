# Project Research Summary

**Project:** NG Address
**Domain:** Nigerian Address Infrastructure & Developer Tooling
**Researched:** 2026-10-02
**Confidence:** HIGH

## Executive Summary

NG Address provides standard, open-source developer infrastructure for Nigerian address workflows. It bridges the gap between official national postcode infrastructure (NIPOST NDAPS) and software applications across ecommerce, fintech, logistics, and public services.

The recommended architectural approach is a clean TypeScript monorepo using pnpm workspaces. The core domain schema and validation engine (`@ng-address/core`) are decoupled from specific provider implementations (`@ng-address/nipost`), user interface components (`@ng-address/react`), and CLI developer utilities (`@ng-address/cli`).

Key risks such as credential leakage, provider rate limiting, and address ambiguity are mitigated through server-side mediation patterns, exponential backoff retries, explicit field-level data provenance (`FieldSource`), and conservative normalization.

## Key Findings

### Recommended Stack

- **Monorepo:** pnpm workspaces + TypeScript 5.x strict mode.
- **Core Packages:** `@ng-address/core`, `@ng-address/nipost`, `@ng-address/react`, `@ng-address/cli`.
- **Validation & Runtime:** Zod / Valibot for schema parsing, native fetch for HTTP resilience.
- **Build & Distribution:** tsup for ESM + CJS dual publishing with TypeScript declarations.
- **Testing:** Vitest for unit tests, React Testing Library + axe-core for component accessibility, Playwright for E2E workflows.

### Expected Features

**Must have (table stakes):**
- Canonical `NigerianAddress` schema with state/LGA hierarchy and coordinates.
- Field-level data provenance model (`FieldSource`).
- Offline postcode format validator (`isValidPostcodeFormat`).
- Authoritative NIPOST NDAPS adapter with retry logic and error mapping.
- Accessible, keyboard-navigable React address & postcode capture component.
- Developer CLI for lookup, validation, and normalization.

**Should have (competitive):**
- In-memory and Redis caching strategies.
- Batch CSV/database address migration utilities.
- Next.js and Express reference integration examples.

**Defer (v2+):**
- Hosted proxy/cache cloud API.
- WooCommerce / WordPress e-commerce plugins.
- Multi-provider automatic failover mesh.

### Architecture Approach

A Ports & Adapters (Hexagonal) architecture where `@ng-address/core` defines the `AddressProvider` contract. Consumer apps and UI components interact with the high-level client interface without exposure to raw provider HTTP payloads.

### Critical Pitfalls

1. **Fabricating Certainty:** Avoid forcing informal address descriptions into rigid street numbers without provider confirmation. Always retain `raw` input and track provenance.
2. **Credential Leaks:** Strictly enforce server-side execution for NIPOST API keys.
3. **Format vs Existence Confusion:** Differentiate offline syntax checks from online entity resolution.
4. **Provider Flakiness:** Implement exponential backoff, structured error hierarchy (`AddressError`), and configurable timeouts.

## Implications for Roadmap

Suggested phase structure:

### Phase 1: Monorepo Foundation & Core Primitives (`@ng-address/core`)
- **Rationale:** Establish workspace tooling, build system, schemas, provenance model, validation, and provider contracts before any network or UI code.
- **Delivers:** `pnpm-workspace.yaml`, `@ng-address/core` package, `NigerianAddress` types, Zod schemas, error hierarchy, unit test suite.
- **Avoids:** Uncoordinated schema drift across packages.

### Phase 2: Authoritative NIPOST Provider Adapter (`@ng-address/nipost`)
- **Rationale:** Build the official integration against NDAPS endpoints with resilience and security.
- **Delivers:** `@ng-address/nipost` package, HTTP client, response normalization, retry mechanism, contract test suite.
- **Avoids:** Client-side credential leakage and unhandled provider error crashes.

### Phase 3: React Component SDK (`@ng-address/react`)
- **Rationale:** Give frontend developers accessible, ready-to-use UI components for postcode and address capture.
- **Delivers:** `@ng-address/react` package, `<NigerianAddressInput />`, postcode input hooks, confirmation UI, WCAG 2.2 AA accessibility tests.
- **Avoids:** Inaccessible forms and confusing validation UX.

### Phase 4: Developer CLI Tooling (`@ng-address/cli`)
- **Rationale:** Enable rapid testing, scripting, and backend terminal workflows.
- **Delivers:** `@ng-address/cli` package with `lookup`, `validate`, `search`, and `normalize` commands.

### Phase 5: Documentation, Reference Examples & Quality Verification
- **Rationale:** Ensure developers can onboard in under 10 minutes with end-to-end working reference implementations.
- **Delivers:** Next.js and Express example apps, getting started guide, security guide, CI workflows.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Standard TypeScript monorepo with modern tooling |
| Features | HIGH | Thoroughly documented in NG-Address-PRD.md |
| Architecture | HIGH | Ports & Adapters with clear security boundaries |
| Pitfalls | HIGH | Explicit mitigations for credential security and data provenance |

**Overall confidence:** HIGH

## Sources

### Primary (HIGH confidence)
- `docs/NG-Address-PRD.md` — Comprehensive Product Requirements Document
- NIPOST NDAPS Public Architecture Documentation & API Specifications
- WCAG 2.2 Accessibility Guidelines & W3C ARIA Authoring Practices

---
*Research completed: 2026-10-02*
*Ready for roadmap: yes*
