# Phase 1: Monorepo Foundation & Core Primitives — Research

**Phase:** 01-monorepo-foundation-core-primitives
**Date:** 2026-10-02

## 1. Monorepo Architecture & Workspace Layout

### Package Hierarchy
We establish a pnpm workspace with TypeScript 5 strict mode:
- Root directory: `pnpm-workspace.yaml`, `package.json`, `tsconfig.base.json`, `vitest.workspace.ts`
- `packages/core/`: The zero-network domain foundation (`@ng-address/core`)
- Target packages for subsequent phases: `packages/provider-nipost`, `packages/react`, `packages/cli`

### Build System & Tooling
- Dual packaging (ESM + CJS): `tsup` generates `dist/index.mjs`, `dist/index.cjs`, and `dist/index.d.ts`.
- Runtime validation: `zod` for parsing and contract enforcement.
- Testing: `vitest` configured at workspace root and per-package.

## 2. Core Schema & Data Provenance

### Canonical Address Model
```typescript
export type VerificationStatus = 
  | "EXACT"
  | "MATCHED"
  | "PARTIAL"
  | "UNRESOLVED"
  | "AMBIGUOUS"
  | "INVALID";

export interface FieldSource {
  source: "user" | "nipost" | "osm" | "derived";
  retrievedAt?: string;
}

export interface NigerianAddress {
  raw?: string;
  building?: {
    number?: string;
    name?: string;
    unit?: string;
  };
  street?: string;
  area?: string;
  district?: string;
  administrative: {
    ward?: string;
    lga?: string;
    state?: string;
  };
  postcode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  provenance?: Record<string, FieldSource>;
  verification?: {
    status: VerificationStatus;
    method?: string;
    verifiedAt?: string;
  };
}
```

### Nigerian Administrative Taxonomy
- 36 states + Federal Capital Territory (FCT)
- 774 Local Government Areas (LGAs)
- Pre-compiled static lookup maps for instant normalization and typo correction.

## 3. Postcode Syntax & Normalization

- Format validation: NDAPS alphanumeric pattern check.
- Normalization pipeline:
  1. Whitespace trimming and case standardisation.
  2. State name alias resolution (e.g. "F.C.T", "Abuja FCT" -> "Federal Capital Territory").
  3. LGA canonical naming and association checks.

## 4. Error Model & Provider Contract

### Structured Error Codes
```typescript
export type AddressErrorCode =
  | "INVALID_INPUT"
  | "INVALID_POSTCODE"
  | "NOT_FOUND"
  | "PROVIDER_UNAVAILABLE"
  | "AUTHENTICATION_FAILED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "PROVIDER_ERROR"
  | "UNSUPPORTED_OPERATION";
```

### Provider Contract
```typescript
export interface ProviderCapabilities {
  search: boolean;
  postcodeLookup: boolean;
  reverseGeocode: boolean;
  validation: boolean;
}

export interface AddressProvider {
  readonly name: string;
  readonly capabilities: ProviderCapabilities;
  resolvePostcode(postcode: string): Promise<AddressResolution>;
  search?(query: AddressSearchQuery): Promise<AddressSearchResult[]>;
  reverseGeocode?(coords: Coordinates): Promise<AddressResolution>;
  validate?(address: AddressInput): Promise<AddressValidation>;
}
```

## Validation Architecture

- Vitest runs test suites across `packages/core/test/**/*.test.ts`.
- Zero-external network requirement for core tests.
- 100% coverage target on postcode validation regex and administrative lookup maps.

---
*Research completed: 2026-10-02*
