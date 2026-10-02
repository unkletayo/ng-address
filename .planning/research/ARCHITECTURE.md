# Architectural Patterns & Research

**Domain:** Multi-Package TypeScript SDK & Location Services Integration
**Date:** 2026-10-02

## Core Architecture Decisions

### 1. Hexagonal / Ports & Adapters Architecture

```text
[ Consumers: Web App / Mobile / Backend / CLI ]
                      │
                      ▼ (Application Port)
       ┌──────────────────────────────┐
       │   NG Address Core Engine     │
       │  - Schema & Normalization    │
       │  - Provenance Enforcement    │
       │  - Validation Logic          │
       └──────────────────────────────┘
                      │
                      ▼ (Provider Port: AddressProvider interface)
       ┌──────────────────────────────┐
       │     Provider Adapters        │
       │  - NIPOST NDAPS Adapter      │
       │  - Mock / Test Adapter       │
       │  - (Future) OSM / Custom     │
       └──────────────────────────────┘
```

### 2. Provider Abstraction Contract

```typescript
export interface AddressProvider {
  readonly name: string;
  readonly capabilities: ProviderCapabilities;
  
  resolvePostcode(postcode: string): Promise<AddressResolution>;
  search?(query: AddressSearchQuery): Promise<AddressSearchResult[]>;
  reverseGeocode?(coords: Coordinates): Promise<AddressResolution>;
  validate?(address: AddressInput): Promise<AddressValidation>;
}
```

### 3. Separation of Concerns & Security Boundary

- **Client vs Server SDK Separation:**
  - Browser apps should interact with application backend API proxies rather than embedding upstream NIPOST provider API keys directly.
  - `@ng-address/react` provides components that can be configured with a custom resolution endpoint URL or custom backend fetcher.
  - `@ng-address/nipost` runs in Node.js server environments, Edge runtime (Next.js API routes), or CLI.

---
*Architecture research: 2026-10-02*
