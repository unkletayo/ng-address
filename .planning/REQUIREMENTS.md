# Requirements: NG Address

**Defined:** 2026-10-02
**Core Value:** Make Nigerian locations as easy for software to understand as they are for Nigerians to describe — without compromising developer experience, data ownership, or runtime safety.

## v1 Requirements

Requirements for initial release. Each maps directly to roadmap phases.

### Core Domain & Schemas (`@ng-address/core`)

- [ ] **CORE-01**: Define canonical `NigerianAddress` TypeScript interface (building, street, area, district, ward, LGA, state, postcode, coordinates, provider metadata, verification status).
- [ ] **CORE-02**: Implement field-level data provenance model (`FieldSource`: `user`, `nipost`, `osm`, `derived`) with retrieval timestamps.
- [ ] **CORE-03**: Provide offline postcode syntax validation function `isValidPostcodeFormat(postcode)` with strict regex and format checks.
- [ ] **CORE-04**: Implement deterministic address normalization (casing, whitespace trimming, standard LGA & State taxonomy reconciliation across 36 states + FCT).
- [ ] **CORE-05**: Define structured `AddressError` hierarchy with typed error codes (`INVALID_INPUT`, `INVALID_POSTCODE`, `NOT_FOUND`, `PROVIDER_UNAVAILABLE`, `AUTHENTICATION_FAILED`, `RATE_LIMITED`, `TIMEOUT`, `PROVIDER_ERROR`).
- [ ] **CORE-06**: Define standard `AddressProvider` interface and `ProviderCapabilities` contract for pluggable provider adapters.

### NIPOST Provider Adapter (`@ng-address/nipost`)

- [ ] **NIPOST-01**: Implement `NipostProvider` adhering to `AddressProvider` contract for NIPOST NDAPS endpoints.
- [ ] **NIPOST-02**: Support digital postcode resolution (`resolvePostcode`) returning normalized `NigerianAddress` with `source: "nipost"`.
- [ ] **NIPOST-03**: Secure server-side credential handling with zero token exposure to client-side bundles.
- [ ] **NIPOST-04**: Implement exponential backoff retry mechanism for transient network failures and 5xx provider responses.
- [ ] **NIPOST-05**: Map upstream HTTP errors, rate-limit headers (429), and auth failures (401/403) to standardized `AddressError` codes.

### React Component SDK (`@ng-address/react`)

- [ ] **REACT-01**: Provide `<NigerianAddressInput />` component supporting free-text address and digital postcode entry modes.
- [ ] **REACT-02**: Implement `useAddressResolution` and `usePostcodeLookup` React hooks with loading, error, and resolved states.
- [ ] **REACT-03**: Provide address confirmation card/modal displaying resolved location details for explicit user acceptance.
- [ ] **REACT-04**: Comply with WCAG 2.2 AA accessibility standards (ARIA combobox/input attributes, visible focus indicators, contrast >= 4.5:1).
- [ ] **REACT-05**: Full keyboard navigation support (Arrow navigation, Enter selection, Escape dismiss).

### Developer CLI Tooling (`@ng-address/cli`)

- [ ] **CLI-01**: Implement `ng-address lookup <postcode>` to resolve digital postcodes from the command line.
- [ ] **CLI-02**: Implement `ng-address validate <address>` to validate structured or free-text Nigerian addresses.
- [ ] **CLI-03**: Implement `ng-address normalize <input>` to demonstrate deterministic address normalization.
- [ ] **CLI-04**: Support formatted output modes (human-readable tables, pretty JSON) and environment variable configuration (`NIPOST_API_KEY`).

### Documentation & Reference Examples

- [ ] **DOCS-01**: Getting Started Guide with 10-minute quickstart integration path.
- [ ] **DOCS-02**: Security & Privacy Architecture Guide (credential isolation, data minimization, no raw database scraping).
- [ ] **DOCS-03**: Provider Integration & Custom Adapter Guide.
- [ ] **DOCS-04**: Next.js (App Router) reference integration example with server-side proxy route.
- [ ] **DOCS-05**: Express.js backend API reference integration example.

## v2 Requirements

Deferred to future releases. Tracked for product roadmap evolution.

### Caching & High Throughput

- **CACHE-01**: In-memory LRU cache adapter for high-speed local postcode lookup deduplication.
- **CACHE-02**: Redis distributed cache adapter for scaled microservice architectures.

### Batch & Migration Tooling

- **MIGR-01**: `ng-address migrate` CLI command for bulk offline batch processing of CSV / database address records with rate throttling.

### E-Commerce Integrations

- **ECOM-01**: WooCommerce / WordPress plugin for Nigerian postcode capture at checkout.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Competing Postcode Database | We build developer tooling and integration infrastructure; scraping or duplicating NDAPS violates licensing and data ownership |
| Turn-by-Turn Navigation / Map Tiles | General mapping is out of scope; focus is strictly address capture, validation, and resolution |
| Identity & Residency Verification | Location resolution does not prove individual identity, tenancy, or legal property ownership |
| Client-Side Direct NIPOST Auth | Provider credentials must never be embedded in public client/browser applications |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Pending |
| CORE-02 | Phase 1 | Pending |
| CORE-03 | Phase 1 | Pending |
| CORE-04 | Phase 1 | Pending |
| CORE-05 | Phase 1 | Pending |
| CORE-06 | Phase 1 | Pending |
| NIPOST-01 | Phase 2 | Pending |
| NIPOST-02 | Phase 2 | Pending |
| NIPOST-03 | Phase 2 | Pending |
| NIPOST-04 | Phase 2 | Pending |
| NIPOST-05 | Phase 2 | Pending |
| REACT-01 | Phase 3 | Pending |
| REACT-02 | Phase 3 | Pending |
| REACT-03 | Phase 3 | Pending |
| REACT-04 | Phase 3 | Pending |
| REACT-05 | Phase 3 | Pending |
| CLI-01 | Phase 4 | Pending |
| CLI-02 | Phase 4 | Pending |
| CLI-03 | Phase 4 | Pending |
| CLI-04 | Phase 4 | Pending |
| DOCS-01 | Phase 5 | Pending |
| DOCS-02 | Phase 5 | Pending |
| DOCS-03 | Phase 5 | Pending |
| DOCS-04 | Phase 5 | Pending |
| DOCS-05 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-10-02*
*Last updated: 2026-10-02 after initial definition*
