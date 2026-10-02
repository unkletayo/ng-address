# External Integrations

**Analysis Date:** 2026-10-02

## Provider Integrations

### 1. NIPOST NDAPS (National Digital Alphanumeric Postcode System)
- **Role:** Authoritative national postcode provider for Nigeria
- **Authentication:** Server-side API Key / Bearer Token / OAuth credentials
- **Adapter Location:** `packages/provider-nipost/` (`@ng-address/nipost`)
- **Key Operations:**
  - Postcode syntax check and resolution
  - Address lookup by digital postcode
  - Geocoding and reverse geocoding (where provider API supports)
  - Address verification and metadata retrieval
- **Constraints & Governance:**
  - Strictly no scraping, bulk extraction, or unauthorized database duplication
  - Server-side invocation only — provider credentials must never be exposed to browser clients
  - Respect provider rate limits with exponential backoff and retry policies
  - Transparent provenance tracking (`source: "nipost"`)

### 2. Extensible Provider Architecture
- **Interface:** `AddressProvider` contract defined in `@ng-address/core` (`packages/core/src/provider.ts`)
- **Capabilities Matrix:**
  - `search: boolean`
  - `postcodeLookup: boolean`
  - `reverseGeocode: boolean`
  - `validation: boolean`
- **Future / Alternative Providers:** OpenStreetMap (Nominatim), Google Maps Geocoding API, custom enterprise internal databases

## Storage & Caching Layer

- **Supported Strategies:**
  - `memory` — In-memory LRU cache for short-lived session deduplication
  - `redis` — Distributed cache for high-throughput backend services
  - `disabled` — Direct passthrough for compliance or strict freshness requirements
- **Cache Invalidation & TTL:** Configurable per provider; respect provider terms regarding data retention

## Downstream Ecosystem Integrations (Post-MVP)

- **E-commerce & Platforms:**
  - WooCommerce / WordPress plugin (`integrations/woocommerce`)
  - Shopify / Custom checkout address validators
- **Database Adapters:**
  - Reference relational schemas (PostgreSQL / MySQL) with LGA, State, Ward, and Postcode columns
  - Data migration scripts (`ng-address migrate`)

---

*Integrations analysis: 2026-10-02*
*Update when external integrations change*
