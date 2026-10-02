# NG Address

## What This Is

NG Address is an open-source developer infrastructure layer for Nigerian address workflows. It provides a standardized software layer (canonical TypeScript schemas, provider adapters, React UI components, CLI tooling, and testing utilities) to capture, normalize, resolve, validate, and store Nigerian location references while integrating with authoritative providers such as NIPOST's National Digital Alphanumeric Postcode System (NDAPS).

## Core Value

Make Nigerian locations as easy for software to understand as they are for Nigerians to describe — without compromising developer experience, data ownership, or runtime safety.

## Business Context

- **Customer:** Application developers, ecommerce platforms, logistics providers, fintechs, and property companies building for the Nigerian market.
- **Revenue model:** Open-source core infrastructure (Apache-2.0 / MIT); potential future optional hosted proxy/caching services.
- **Success metric:** Number of successful Nigerian address-resolution workflows completed through NG Address with zero credential leaks.
- **Strategy notes:** [NG-Address-PRD.md](file:///Users/Camyn/Desktop/workspace/projects/ng-address/docs/NG-Address-PRD.md)

## Requirements

### Validated

- ✓ Comprehensive Product Requirements Document established — `docs/NG-Address-PRD.md`
- ✓ Codebase mapping and architectural baseline recorded — `.planning/codebase/`

### Active

- [ ] **Monorepo & Build Infrastructure:** Bootstrap pnpm/npm workspace with `@ng-address/core`, `@ng-address/nipost`, `@ng-address/react`, and `@ng-address/cli`.
- [ ] **Core Schema & Primitives (`@ng-address/core`):** Define `NigerianAddress`, `AddressProvider` interface, Zod/Valibot runtime validation, structured `AddressError` hierarchy, and data provenance tracking (`FieldSource`).
- [ ] **NIPOST Provider Adapter (`@ng-address/nipost`):** Implement authoritative NDAPS API client, request/response normalization, authentication management, rate limit handling, and exponential backoff retry policy.
- [ ] **React Component SDK (`@ng-address/react`):** Build accessible (`WCAG 2.2 AA`), keyboard-navigable `<NigerianAddressInput />`, digital postcode input, address resolution states, and confirmation modal.
- [ ] **CLI Tooling (`@ng-address/cli`):** Provide terminal commands for `lookup`, `validate`, `search`, and `normalize`.
- [ ] **Developer Documentation & Examples:** Deliver getting-started guide, security/privacy documentation, provider setup guide, and reference Next.js / Express example apps.

### Out of Scope

- **Competing Postcode Database:** Scraping, duplicating, or redistributing NDAPS database contents without authorization.
- **Consumer Map / Navigation App:** Building turn-by-turn navigation, tile servers, or general-purpose mapping systems.
- **Identity / Residency Verification:** Conflating location resolution with KYC identity, tenant verification, or legal property ownership verification.
- **Emergency Dispatch Operations:** Specialized real-time 911/emergency dispatch platform workflows.

## Context

- **Authoritative Provider:** NIPOST's NDAPS provides national digital postcodes for location resolution.
- **Real-World Complexity:** Nigerian address input frequently relies on landmarks, descriptive directions, and colloquial area names requiring conservative normalization.
- **Security & Privacy Boundary:** Provider credentials must remain server-side; address capture must follow data minimization principles.

## Constraints

- **Tech Stack:** TypeScript strict mode, Node.js >= 20.x, React 18+/19+, ESM + CJS dual package exports.
- **Licensing & Legal:** Strict adherence to NIPOST NDAPS terms of service; no bulk extraction or unlicensed database mirroring.
- **Security:** Zero client-side API key exposure; HTTPS-only provider communication.
- **Accessibility:** WCAG 2.2 AA compliant UI components.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo Architecture (`packages/*`) | Clear boundary separation between core types, provider adapters, UI, and CLI | — Pending |
| Provider Adapter Contract (`AddressProvider`) | Enables multi-provider support (NIPOST, OSM, Google Maps) without breaking consuming apps | — Pending |
| Data Provenance by Default (`FieldSource`) | Distinguishes user-entered data from provider-verified data, preventing fabricated certainty | — Pending |
| Server-Side Mediation for Auth | Prevents leaking sensitive NIPOST API credentials into browser client bundles | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Business Context check (if present) — customer, revenue model, success metric still accurate?
4. Audit Out of Scope — reasons still valid?
5. Update Context with current state

---
*Last updated: 2026-10-02 after initialization*
