# NG Address

Developer infrastructure for Nigerian addresses: canonical types, offline normalization of states and LGAs, a NIPOST NDAPS postcode provider, accessible React components, and a CLI.

## What it does

- Models a Nigerian address with a typed, Zod-validated schema, including per-field provenance (where each value came from).
- Normalizes free-text addresses offline against a built-in dataset of the 36 states plus FCT and their LGAs. No network needed.
- Validates postcode formats offline.
- Resolves NIPOST NDAPS postcodes through a server-side provider (`NipostProvider`) with retries, timeouts and structured errors.
- Ships React components for address input, cascading state/LGA selects and an address confirmation card/modal.
- Includes a CLI for lookup, validation, normalization and browsing states and LGAs.
- Defines an `AddressProvider` contract so other providers can be plugged in (see `docs/providers.md`).

## Packages

| Package | Purpose |
| --- | --- |
| [`@ng-address/core`](packages/core) | Types, Zod schemas, states/LGAs dataset, `normalizeNigerianAddress`, postcode validation, `AddressError` hierarchy, provider contract |
| [`@ng-address/nipost`](packages/nipost) | `NipostProvider` for the NIPOST NDAPS API (`https://api.postcode.gov.ng` by default) |
| [`@ng-address/react`](packages/react) | `AddressConfigProvider`, `NigerianAddressInput`, `StateLgaSelect`, `AddressConfirmationCard`, `AddressConfirmationModal`, and hooks |
| [`@ng-address/cli`](packages/cli) | `ng-address` command line tool |

Reference apps live in `examples/`:

- `examples/nextjs-app-router`: Next.js 15 site with docs, a playground, a checkout demo and an `/api/address/lookup` route.
- `examples/express-api`: Express REST API exposing taxonomy, normalize, validate and lookup endpoints.

## Repository layout

```
packages/
  core/     types, schemas, normalization, validation, errors
  nipost/   NIPOST NDAPS provider (config, http client, transformer)
  react/    components, hooks, styles
  cli/      ng-address binary (cac + @clack/prompts)
examples/
  nextjs-app-router/
  express-api/
docs/       quickstart, providers, security, product requirements
scripts/    live-check.mjs (manual check against the real NIPOST API)
.planning/  project planning notes and phase history
```

## Prerequisites

- Node.js 18 or newer (CI runs 18 and 22)
- pnpm (CI pins 11.2.2)

## Getting started

```bash
pnpm install
cp .env.example .env     # only needed for NIPOST lookups
pnpm build
pnpm test
pnpm typecheck
```

Root scripts: `build` (all `@ng-address/*` packages), `test` (Vitest), `test:watch`, `typecheck` (`tsc --build`), `docs:dev` and `docs:build` (the Next.js example).

### Environment variables

| Variable | Used by | Notes |
| --- | --- | --- |
| `NIPOST_API_KEY` | `NipostProvider` callers, CLI `lookup`, examples, `scripts/live-check.mjs` | Server-side only. The CLI also accepts `--api-key`. |
| `PORT` | `examples/express-api` | Defaults to `3001`. |
| `NIPOST_LEVEL`, `NIPOST_CODE` | `scripts/live-check.mjs` | Optional lookup level (1-5) and postcode. |

The `.env` file is gitignored; nothing in the repo loads it automatically, so export the variables in your shell or use your own loader.

## Usage

### Offline normalization (`@ng-address/core`)

```ts
import { normalizeNigerianAddress, findNigerianState } from '@ng-address/core';

const result = normalizeNigerianAddress(
  'Plot 4, Admiralty Way, Lekki Phase 1, Eti Osa, Lagos State, 105102'
);
result.administrative.state; // "Lagos"
result.administrative.lga;   // "Eti Osa"
result.postcode;             // "105102"

findNigerianState('lagos')?.capital; // "Ikeja"
```

Other exports include `NIGERIAN_STATES`, `findMatchingLga`, `isValidPostcodeFormat`, `sanitizePostcode`, the Zod schemas and the error classes (`AddressError`, `ConfigurationError`, `ProviderError`, `InvalidStateError`, `InvalidLgaError`, `InvalidPostcodeError`).

### Postcode lookup on the server (`@ng-address/nipost`)

```ts
import { NipostProvider } from '@ng-address/nipost';

const provider = new NipostProvider({ apiKey: process.env.NIPOST_API_KEY });
const resolution = await provider.resolvePostcode('LA-10-A01-LK-02');
```

Config options and defaults: `baseUrl` (`https://api.postcode.gov.ng`), `level` (1), `timeoutMs` (5000), `maxRetries` (3), `retryDelayMs` (500), `allowClientUsage` (false). In a browser runtime the provider throws if it detects a secret-style key, so keep it behind a backend route. The provider also exposes `search`, `autocomplete`, `reverseGeocode`, `nearby`, `assemble`, `disassemble`, `validate`, `healthCheck` and taxonomy listing (`listStates`, `listLgas`, `listDistricts`, `listAreas`).

### React (`@ng-address/react`)

```tsx
import { AddressConfigProvider, NigerianAddressInput } from '@ng-address/react';
import '@ng-address/react/styles.css';

<AddressConfigProvider config={{ apiBaseUrl: '/api/address' }}>
  <NigerianAddressInput onAddressSelect={(address) => console.log(address)} />
</AddressConfigProvider>
```

The components call your backend at `apiBaseUrl`, so the NIPOST key never reaches the browser. See `docs/quickstart.md` for a full checkout example.

### CLI (`@ng-address/cli`)

```bash
ng-address                              # interactive wizard (TTY only)
ng-address lookup LA-10-A01-LK-02       # needs NIPOST_API_KEY or --api-key
ng-address validate "Ikeja, Lagos"      # offline
ng-address normalize "plot 10 admiralty way, lekki phase 1, lagos"
ng-address list-states --zone "South West"
ng-address list-lgas Lagos
```

Most commands accept `--json` and `--compact`. See `packages/cli/README.md`.

### Express reference API

```bash
pnpm --filter @ng-address/example-express dev
```

Endpoints: `GET /healthz`, `GET /api/v1/taxonomy/states`, `GET /api/v1/taxonomy/states/:state/lgas`, `POST /api/v1/address/normalize`, `POST /api/v1/address/validate`, `POST /api/v1/address/lookup`.

### Next.js example

```bash
pnpm docs:dev
```

## Testing and CI

Tests are Vitest suites in each package's `test/` directory (plus the Express example). GitHub Actions (`.github/workflows/ci.yml`) runs install, typecheck, build and test on Node 18 and 22 for pushes and pull requests to `main`.

To exercise the real NIPOST API manually:

```bash
NIPOST_API_KEY=... pnpm --filter @ng-address/nipost build && node scripts/live-check.mjs
```

## Documentation

- [Quickstart](docs/quickstart.md)
- [Security and privacy](docs/security.md)
- [Custom providers](docs/providers.md)
- [Product requirements](docs/NG-Address-PRD.md)

## Status

Version 0.1.0. The v1 milestone (monorepo foundation, NIPOST adapter, React SDK, CLI, docs/examples/CI) is recorded as complete in `.planning/STATE.md`. Packages are not yet confirmed as published to npm, and the repository has no LICENSE file.
