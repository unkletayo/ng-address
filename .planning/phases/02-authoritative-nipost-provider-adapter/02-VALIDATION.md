# Phase 2: Authoritative NIPOST Provider Adapter - Validation Plan

**Phase:** 2  
**Target Package:** `packages/nipost` (`@ng-address/nipost`)  
**Official API Docs:** [docs.postcode.gov.ng](https://docs.postcode.gov.ng/)  
**Date:** 2026-10-02

---

## Verification Criteria

### 1. Monorepo Integration & Build
- `@ng-address/nipost` builds ESM, CommonJS, and TypeScript declarations using `tsup`.
- Cleanly depends on `@ng-address/core`.

### 2. Official Endpoint & Authentication Contracts
- Default `baseUrl` connects to `https://api.postcode.gov.ng`.
- Outbound authenticated requests send `X-API-Key: <key>`.
- Client-side initialization with a secret key (`nipost_live_...` or `nipost_test_...`) throws `ConfigurationError` when `window` is detected.
- Health check requests `GET /healthz` without requiring authentication headers.

### 3. Resilience & Rate Limiting
- Upstream HTTP 5xx responses trigger exponential backoff retry loop with jitter.
- Upstream HTTP 429 errors parse `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers and map cleanly to `ProviderError` with code `PROVIDER_RATE_LIMITED`.
- Upstream HTTP 402 errors map to `ProviderError` with code `INSUFFICIENT_CREDITS`.

### 4. NDAPS Address Normalization & Provenance
- Calling `lookupPostcode('LA-11-W06-TC-10')` or compact `'LA11W06TC10'` requests `GET /v1/lookup?code=...&level=2` and normalizes the payload:
  - `state`: Normalizes `administrative_address.state_name` ("LAGOS") to canonical state code/name.
  - `lga`: Normalizes `administrative_address.lga_name`.
  - `street`: Extracts street from `recent_house_address.recent`.
  - `provenance`: Attaches `source: 'nipost'` to all returned fields.
- Calling `reverseGeocode({ latitude, longitude })` queries `GET /v1/search/reverse` and constructs a valid `NigerianAddress`.

### 5. Automated Test Suite
- Vitest suite covers:
  - NDAPS 5-segment postcode parsing, formatting, and disassembly.
  - `X-API-Key` headers and secret key safety guards.
  - Mocked HTTP responses for `GET /v1/lookup`, `GET /v1/search/reverse`, `GET /v1/search/nearby`, and `GET /healthz`.
  - Test fixtures utilizing official doc samples (`AK-11-I61-ZF-12`, `BA-02-M67-BL-69`, `EB-13-G95-FR-90`, `EN-05-V19-CD-22`, `FC-03-B06-AG-12`, `KN-31-F82-WJ-80`, `LA-11-W06-TC-10`, `OG-14-T18-BN-16`).
