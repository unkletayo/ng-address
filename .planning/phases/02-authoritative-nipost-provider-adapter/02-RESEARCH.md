# Phase 2: Authoritative NIPOST Provider Adapter - Research

**Phase:** 2  
**Target Package:** `packages/nipost` (`@ng-address/nipost`)  
**Official API Docs:** [docs.postcode.gov.ng](https://docs.postcode.gov.ng/) (OpenAPI 3.1.0 at `api.postcode.gov.ng`)  
**Dependencies:** `@ng-address/core`  
**Date:** 2026-10-02

---

## 1. Official NIPOST Postcode API Specifications

NIPOST provides official REST endpoints via `https://api.postcode.gov.ng`:

### 1.1 Postcode Format (NDAPS 5-Segment)
- 12 characters across 5 segments: `AA-99-H77-BB-55`
  - `AA`: 2 alpha (State code, e.g. `EK`, `LA`, `FC`)
  - `99`: 2 numeric (LGA code, zero-filled, 01–99)
  - `H77`: 3 alphanumeric (District code)
  - `BB`: 2 alpha (Area code)
  - `55`: 2 numeric (Building unit code, zero-filled, 01–99)
- Three valid representation styles:
  - Formatted: `EK-01-A03-FK-01`
  - Display: `EK 01 A03 FK 01`
  - Compact: `EK01A03FK01`

### 1.2 Authentication & Key Types
- Authentication Header: `X-API-Key: <key>`
- Key Prefixes:
  - `nipost_test_...` / `nipost_live_...`: Secret keys (server-side only, full access level)
  - `nipost_pk_test_...` / `nipost_pk_live_...`: Publishable keys (client-side widget, level ≤ 3)
- Rate Limit Response Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### 1.3 Endpoints
- `GET /healthz`: Health check (no auth required)
- `GET /v1/lookup?code={code}&level={1|2|3|4|5}`:
  - Level 1: Validity check (`{ valid: boolean, postcode: string }`) — Free/Public
  - Level 2+: Returns `administrative_address` (`state_name`, `lga_name`, `locality_name`, `zone`) and `recent_house_address`
  - Level 3+: Returns `building_use_status`
- `GET /v1/search/reverse?lat={lat}&lng={lng}&max_distance_m={radius}`: Reverse geocoding (default 25m, max 250m) returning unit, area, district, state, and confidence.
- `GET /v1/search/nearby?lat={lat}&lng={lng}&radius={300}`: Radius search around coordinates.
- `GET /v1/search/autocomplete?q={q}`: Segment-aware suggestions.
- `POST /v1/assembly/assemble`: Assemble segments into `{ postcode, display, compact }`.
- `GET /v1/assembly/disassemble?code={code}`: Break postcode into 5 structured segments.

### 1.4 Response Envelopes
- Success: `{ "data": { ... } }`
- Error: `{ "error": { "code": "insufficient_credits" | "rate_limited" | ..., "message": "..." } }`

---

## 2. Technical Architecture & Adapter Design

### 2.1 Configuration Schema
```typescript
export interface NipostConfig {
  apiKey?: string;
  baseUrl?: string; // Default: 'https://api.postcode.gov.ng'
  level?: 1 | 2 | 3 | 4 | 5; // Default: 2
  timeoutMs?: number; // Default: 5000
  maxRetries?: number; // Default: 3
  retryDelayMs?: number; // Default: 500
  allowClientUsage?: boolean; // Default: false
}
```

### 2.2 Client-Side Isolation
Enforce secret key protection by checking `typeof window !== 'undefined'` when initialized with a secret key (`nipost_live_...` or `nipost_test_...`).

### 2.3 Status & Error Mapping
- `401`: `ProviderError` (`PROVIDER_AUTH_ERROR`)
- `402`: `ProviderError` (`INSUFFICIENT_CREDITS`)
- `403`: `ProviderError` (`PROVIDER_AUTH_ERROR` / Scope insufficient)
- `429`: `ProviderError` (`PROVIDER_RATE_LIMITED`)
- `5xx`: Exponential backoff with jitter, then `ProviderError` (`PROVIDER_UNAVAILABLE`)

---

## 3. Plan Decomposition

- **Plan 02-01**: Monorepo package scaffold, NDAPS format parsing/disassembly helpers, configuration schemas, resilient HTTP transport with `X-API-Key` headers, retry backoff, and server-side safety guards.
- **Plan 02-02**: `NipostProvider` implementation matching `docs.postcode.gov.ng` endpoints (`lookup`, `reverse`, `search`, `healthz`), normalization into `NigerianAddress` with `'nipost'` provenance, and unit test suite using real official test postcodes (`LA-11-W06-TC-10`, `FC-03-B06-AG-12`, `EN-05-V19-CD-22`).
