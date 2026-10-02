# Phase 2: Authoritative NIPOST Provider Adapter - Research

**Phase:** 2  
**Target Package:** `packages/nipost` (`@ng-address/nipost`)  
**Dependencies:** `@ng-address/core`  
**Date:** 2026-10-02

---

## 1. Domain & Architecture Overview

The `@ng-address/nipost` package provides the authoritative adapter for resolving Nigerian addresses and postal codes through NIPOST (Nigerian Postal Service) NDAPS / API endpoints.

### Key Objectives
1. **Contract Implementation**: Implement `AddressProvider` from `@ng-address/core`.
2. **Server-Side Security**: Enforce server-only execution. Prevent API keys from leaking into browser bundles via runtime environment checks (`typeof window !== 'undefined'` guard).
3. **Resilience & Rate Limiting**: Handle network turbulence, rate limits (HTTP 429), and upstream outages (HTTP 5xx) with jittered exponential backoff and request throttling.
4. **Error Mapping**: Translate upstream HTTP errors and empty responses into structured `AddressError` hierarchy.
5. **Data Transformation & Provenance**: Parse and normalize raw NIPOST payloads into canonical `NigerianAddress` instances with `FieldSource: 'nipost'`.

---

## 2. Technical Decisions & Patterns

### 2.1 Package Setup
- **Name:** `@ng-address/nipost`
- **Dependencies:** `@ng-address/core` (workspace protocol `workspace:*`), `zod`
- **Bundler:** `tsup` configured for dual ESM (`dist/index.js`) and CJS (`dist/index.cjs`) output with type declarations (`dist/index.d.ts`).
- **Testing:** `vitest` with mock HTTP handlers (`msw` or native fetch mocking).

### 2.2 Client Safety Guard
```typescript
if (typeof window !== "undefined" && !config.allowClientUsage) {
  throw new ConfigurationError("NipostProvider cannot be initialized in client-side bundles.");
}
```

### 2.3 Retry and Rate Limiting
- Configurable retry attempts (default: 3).
- Jittered exponential backoff: $T = \min(\text{maxDelay}, \text{baseDelay} \times 2^{\text{attempt}} + \text{jitter})$.
- Concurrency limiter / token bucket for outbound requests.

### 2.4 Error Translation Map
- `401 / 403`: `ProviderError` (code: `PROVIDER_AUTH_ERROR`)
- `404`: Returns empty result or `InvalidPostcodeError` when an explicit postcode lookup fails to locate an entry.
- `429`: `ProviderError` (code: `PROVIDER_RATE_LIMITED`) with `retryAfterMs` metadata if `Retry-After` header is present.
- `500 / 502 / 503 / 504`: `ProviderError` (code: `PROVIDER_UNAVAILABLE`)
- Network timeouts: `ProviderError` (code: `PROVIDER_TIMEOUT`)

---

## 3. Plan Decomposition

- **Plan 02-01: Package Scaffolding & HTTP Client**: Monorepo package scaffold, configuration types, HTTP transport layer with retry logic, rate limiting, and client-side guards.
- **Plan 02-02: NipostProvider Implementation & Test Suite**: Complete `AddressProvider` methods (`lookupPostcode`, `reverseGeocode`, `search`, `healthCheck`), payload normalization into `NigerianAddress`, and integration unit tests.
