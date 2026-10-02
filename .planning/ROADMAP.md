# Roadmap: NG Address

## Overview

NG Address delivers standard, open-source developer infrastructure for Nigerian address workflows. This roadmap spans 5 sequential phases: establishing the core schemas, provenance engine, and provider contracts (`@ng-address/core`), implementing the authoritative NIPOST NDAPS adapter (`@ng-address/nipost`), building accessible React components (`@ng-address/react`), developing the developer CLI (`@ng-address/cli`), and delivering end-to-end reference applications and documentation.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Monorepo Foundation & Core Primitives** - Bootstrap workspace and build `@ng-address/core` with schemas, provenance, validation, and error hierarchy.
- [ ] **Phase 2: Authoritative NIPOST Provider Adapter** - Build `@ng-address/nipost` adapter with secure server auth, rate limiting, and exponential retry.
- [ ] **Phase 3: React Component SDK** - Build accessible (`WCAG 2.2 AA`), keyboard-navigable `<NigerianAddressInput />` and confirmation flow in `@ng-address/react`.
- [ ] **Phase 4: Developer CLI Tooling** - Build `@ng-address/cli` with terminal commands for lookup, validation, search, and formatting.
- [ ] **Phase 5: Documentation, Reference Integrations & CI/CD** - Deliver Next.js & Express reference apps, guides, and automated testing pipelines.

## Phase Details

### Phase 1: Monorepo Foundation & Core Primitives
**Goal**: Establish pnpm monorepo structure and deliver `@ng-address/core` with strict TypeScript types, runtime Zod validation, offline postcode validation, deterministic normalization, and structured `AddressError` hierarchy.
**Depends on**: Nothing (first phase)
**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06
**Success Criteria** (what must be TRUE):
  1. `NigerianAddress` TypeScript types and runtime Zod schemas accurately represent building, street, LGA, State, postcode, and coordinates.
  2. `FieldSource` provenance model captures data origins (`user`, `nipost`, `osm`, `derived`) and prevents fabricated certainty.
  3. `isValidPostcodeFormat()` accurately validates digital postcode syntax offline.
  4. Address normalization standardizes casing, whitespace, and 36 states + FCT / 774 LGA names.
  5. `AddressProvider` contract is published and ready for adapter implementations.
**Plans**: TBD

### Phase 2: Authoritative NIPOST Provider Adapter
**Goal**: Implement `@ng-address/nipost` adapter connecting to NIPOST NDAPS services with server-side credential isolation, rate limit resilience, and error mapping.
**Depends on**: Phase 1
**Requirements**: NIPOST-01, NIPOST-02, NIPOST-03, NIPOST-04, NIPOST-05
**Success Criteria** (what must be TRUE):
  1. `NipostProvider` fulfills `AddressProvider` contract and resolves valid postcodes into normalized `NigerianAddress` objects.
  2. Credentials remain strictly server-side with zero exposure in client bundles.
  3. Transient network failures and HTTP 5xx responses trigger exponential backoff retries with jitter.
  4. Upstream HTTP errors (401, 403, 429, 500) map cleanly to typed `AddressError` instances.
**Plans**: TBD

### Phase 3: React Component SDK
**Goal**: Build `@ng-address/react` with accessible address inputs, postcode lookup hooks, loading/error states, and a location confirmation dialog.
**Depends on**: Phase 1, Phase 2
**Requirements**: REACT-01, REACT-02, REACT-03, REACT-04, REACT-05
**Success Criteria** (what must be TRUE):
  1. `<NigerianAddressInput />` supports fluid switching between free-text and digital postcode search.
  2. React hooks manage resolution lifecycle (idle, loading, resolved, error) predictably.
  3. Confirmation UI presents resolved location details for user verification prior to form submission.
  4. Passes automated WCAG 2.2 AA accessibility audit with full keyboard navigability (Arrow keys, Enter, Escape).
**Plans**: TBD

### Phase 4: Developer CLI Tooling
**Goal**: Build `@ng-address/cli` offering terminal commands for rapid lookup, address validation, and format conversion.
**Depends on**: Phase 1, Phase 2
**Requirements**: CLI-01, CLI-02, CLI-03, CLI-04
**Success Criteria** (what must be TRUE):
  1. `ng-address lookup <postcode>` resolves addresses from the command line.
  2. `ng-address validate <address>` performs offline syntax and normalization checks.
  3. `ng-address normalize <input>` outputs cleaned, structured address representations.
  4. Supports JSON and tabular output formatting with `NIPOST_API_KEY` environment variable integration.
**Plans**: TBD

### Phase 5: Documentation, Reference Integrations & CI/CD
**Goal**: Produce production-ready Next.js App Router and Express reference applications, comprehensive setup/security documentation, and GitHub Actions CI pipelines.
**Depends on**: Phase 1, Phase 2, Phase 3, Phase 4
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05
**Success Criteria** (what must be TRUE):
  1. A new developer can complete a working postcode resolution integration in under 10 minutes following the quickstart guide.
  2. Next.js reference app demonstrates secure server-side proxy route pattern.
  3. Express backend example demonstrates robust address validation and normalization API endpoints.
  4. CI pipeline runs automated linting, type-checking, secret scanning, and cross-package unit/integration test suites.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Monorepo Foundation & Core Primitives | 0/TBD | Not started | - |
| 2. Authoritative NIPOST Provider Adapter | 0/TBD | Not started | - |
| 3. React Component SDK | 0/TBD | Not started | - |
| 4. Developer CLI Tooling | 0/TBD | Not started | - |
| 5. Documentation, Reference Integrations & CI/CD | 0/TBD | Not started | - |
