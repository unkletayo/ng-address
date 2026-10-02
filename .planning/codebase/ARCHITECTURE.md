# Architecture

**Analysis Date:** 2026-10-02

## Pattern Overview

**Overall:** Modular Monorepo with Layered Architecture & Provider Adapter Pattern

**Key Characteristics:**
- **Provider-Agnostic Core:** Core package (`@ng-address/core`) defines data schemas, error codes, and provider contracts with zero external network dependencies.
- **Pluggable Providers:** Provider adapters (starting with `@ng-address/nipost`) implement the standard provider contract to communicate with external APIs.
- **Frontend & CLI Consumers:** UI SDK (`@ng-address/react`) and Command-Line Interface (`@ng-address/cli`) consume the SDK without direct coupling to provider network protocols.
- **Provenance-Aware Domain Model:** Every resolved field tracks its origin (`user`, `nipost`, `osm`, `derived`), ensuring no fabricated certainty.

## Layers

```text
+-------------------------------------------------------------+
|                      Consumer Layer                         |
|   React Components (@ng-address/react) | CLI Tooling (@ng-address/cli) |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                       SDK / Client                          |
|             NgAddress Client & Orchestration                |
+-------------------------------------------------------------+
               |                               |
+------------------------------+ +----------------------------+
|         Address Core         | |      Provider Adapter      |
|     (@ng-address/core)       | |   (@ng-address/nipost)     |
| - NigerianAddress Schema     | | - NDAPS API Client         |
| - Validation & Normalization | | - Request / Response Map   |
| - Error Hierarchy            | | - Auth & Rate-Limit Logic  |
| - Provenance Engine          | | - Network Resilience       |
+------------------------------+ +----------------------------+
                                               |
                                 +----------------------------+
                                 |  External NIPOST Services  |
                                 +----------------------------+
```

### 1. Core Layer (`packages/core`)
- **Purpose:** Foundational data types, validation schemas, error hierarchy, and provider interfaces.
- **Contains:** `NigerianAddress`, `AddressValidation`, `AddressErrorCode`, `AddressProvider` interface.
- **Depends on:** Validation library (Zod / Valibot) only.

### 2. Provider Layer (`packages/provider-nipost`)
- **Purpose:** Implementation of `AddressProvider` against NIPOST NDAPS endpoints.
- **Contains:** HTTP client, auth token handling, payload serialization/deserialization, error normalization.
- **Depends on:** `@ng-address/core`.

### 3. Client & Tooling Layer (`packages/react`, `packages/cli`)
- **Purpose:** User-facing components and developer tools.
- **Contains:** `<NigerianAddressInput />`, postcode input hooks, search UI, CLI command handlers (`lookup`, `validate`, `search`).
- **Depends on:** `@ng-address/core` and provider adapters.

## Data Flow & Lifecycle

```text
RAW INPUT (User / API)
       │
       ▼
   PARSING (Syntax & Tokenization)
       │
       ▼
 NORMALIZATION (Deterministic Cleanup & Structural Mapping)
       │
       ▼
  RESOLUTION (Provider Query / Postcode Lookup)
       │
       ▼
  VALIDATION (Format, State/LGA Consistency, Boundary Checks)
       │
       ▼
 CONFIRMATION (User Confirmation UI / Explicit Acceptance)
       │
       ▼
    STORED (Normalized & Provenance-Stamped DB Record)
```

## Error Handling Strategy

**Structured Error Hierarchy:**
- Custom `AddressError` base class extending `Error`.
- Specific codes: `INVALID_INPUT`, `INVALID_POSTCODE`, `NOT_FOUND`, `PROVIDER_UNAVAILABLE`, `AUTHENTICATION_FAILED`, `RATE_LIMITED`, `TIMEOUT`, `PROVIDER_ERROR`.
- Attributes: `code`, `message`, `isRetryable`, `provider`, `retryAfter`.

## Security & Privacy

- **Credential Isolation:** API keys and credentials are handled strictly in backend environments.
- **Privacy by Architecture:** Direct point-to-point communication between application and provider; no unauthorized central data collection.
- **Zero Hallucination:** Clear distinction between confirmed addresses and speculative/unresolved inputs.

---

*Architecture analysis: 2026-10-02*
*Update when major patterns change*
