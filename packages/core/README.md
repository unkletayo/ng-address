# @ng-address/core

> Canonical TypeScript types, runtime Zod validation, offline postcode validation, and deterministic administrative normalization for Nigerian addresses.

## Features

- **Strict TypeScript Types**: `NigerianAddress`, `BuildingInfo`, `AdministrativeInfo`, `Coordinates`, `ProviderInfo`, `VerificationInfo`.
- **Zod Schemas**: Full runtime schema parsing and validation.
- **Offline Administrative Taxonomy**: 36 states + FCT with all 774 LGAs, capitals, geopolitical zones, and aliases.
- **Deterministic Normalization**: Normalizes free-text inputs, trims whitespace, standardizes casing, and stamps field provenance.
- **Structured Error Hierarchy**: `AddressError`, `ConfigurationError`, `ProviderError`, `InvalidStateError`, `InvalidLgaError`, `InvalidPostcodeError`.

## Installation

```bash
pnpm add @ng-address/core
```

## Usage

```typescript
import {
  normalizeNigerianAddress,
  findNigerianState,
  findMatchingLga,
  isValidPostcodeFormat
} from '@ng-address/core';

// 1. Normalization
const address = normalizeNigerianAddress(
  "Plot 4, Admiralty Way, Lekki Phase 1, Eti Osa, Lagos State, 105102"
);

// 2. Taxonomy lookup
const lagos = findNigerianState("Lagos");
const lga = findMatchingLga("ikeja", lagos); // "Ikeja"

// 3. Offline Postcode Syntax Validation
isValidPostcodeFormat("LA-11-W06-TC-10"); // true (digital)
isValidPostcodeFormat("100001");           // true (traditional)
```
