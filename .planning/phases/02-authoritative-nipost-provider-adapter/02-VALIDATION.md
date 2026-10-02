# Phase 2: Authoritative NIPOST Provider Adapter - Validation Plan

**Phase:** 2  
**Target Package:** `packages/nipost`  
**Date:** 2026-10-02

---

## Verification Criteria

### 1. Monorepo Package Integration
- Package `@ng-address/nipost` installs dependencies via `pnpm install` without conflicts.
- Imports types and schemas directly from `@ng-address/core`.
- Dual build generates clean ESM, CommonJS, and TypeScript declarations.

### 2. Client-Side Isolation
- Initializing `NipostProvider` when `window` is defined throws `ConfigurationError` unless explicitly overridden.

### 3. HTTP Client & Resilience
- HTTP requests include `Authorization: Bearer <API_KEY>` or configured header structure.
- Network timeouts (e.g. abort signals) throw `ProviderError` with code `PROVIDER_TIMEOUT`.
- HTTP 500/503 responses trigger retry backoff with jitter and succeed if subsequent attempts resolve.
- HTTP 429 errors respect retry-after header or throw typed rate-limit error.

### 4. Address Normalization & Provenance
- `lookupPostcode('100001')` parses upstream JSON response into canonical `NigerianAddress`.
- Provenance on resolved fields shows `source: 'nipost'`.
- Missing or malformed payloads reject cleanly with typed error details.

### 5. Test Suite Verification
- Vitest suite executes with 100% passing test assertions covering:
  - Constructor configuration validation.
  - Client-side execution guard.
  - HTTP retry and backoff behavior.
  - Postcode lookup, reverse geocode, and search method implementations.
  - Upstream error translation.
