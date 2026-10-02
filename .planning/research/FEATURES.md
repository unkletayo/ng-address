# Feature Research & Scoping

**Domain:** Nigerian Address Developer Infrastructure
**Date:** 2026-10-02

## Feature Taxonomy

### 1. Table Stakes (Must Have for MVP)

- **Standard Nigerian Address Schema (`@ng-address/core`):**
  - Building (number, name, unit)
  - Street, Area, District
  - Administrative hierarchy: State, LGA (Local Government Area), Ward
  - Digital Postcode format validation
  - Geographic coordinates (latitude, longitude)
  - Data Provenance (`FieldSource`: `user`, `nipost`, `osm`, `derived`)
- **Address Validation & Normalization:**
  - Deterministic whitespace, casing, and prefix cleaning
  - LGA and State name reconciliation (36 states + FCT, 774 LGAs)
  - Postcode syntax validator (`isValidPostcodeFormat`)
- **Authoritative NIPOST Adapter (`@ng-address/nipost`):**
  - Postcode lookup and address resolution
  - Structured error mapping (`AddressError` with standardized codes)
  - Exponential backoff retry for transient network/server failures
  - Server-side authentication handling
- **React Address Component (`@ng-address/react`):**
  - Search / Free-text and Postcode capture input
  - Resolution loading and error states
  - Confirmation modal / review card
  - Keyboard navigation and ARIA labels (WCAG 2.2 AA)
- **CLI Tooling (`@ng-address/cli`):**
  - `ng-address lookup <postcode>`
  - `ng-address validate <address>`
  - `ng-address search <query>`
- **Developer Documentation & Examples:**
  - Setup guides, API reference, Next.js / Express integration examples.

### 2. Differentiators (Should Have - v1.1)

- **Local Cache Strategies:** Configurable in-memory and Redis adapters for caching validated postcodes.
- **Batch Processing & Data Migration:** CLI command `ng-address migrate` for normalizing legacy CSV/database address tables.
- **Provider Fallback:** Seamless fallback between NIPOST, OpenStreetMap, and custom location backends.

### 3. Out of Scope / Deferred (v2+)

- Recreating a competing full postcode database snapshot.
- Bulk scraping or unauthorized duplication of NDAPS records.
- Consumer navigation apps or mapping tile servers.
- Identity verification, KYC, or tenancy/property ownership validation.

---
*Features research: 2026-10-02*
