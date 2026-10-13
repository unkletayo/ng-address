# Phase 4: Developer CLI Tooling - Context

**Gathered:** 2026-10-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Build `@ng-address/cli` (binary: `ng-address`), providing command-line utilities for Nigerian address resolution, offline validation, canonical normalization, and interactive guided workflows. This phase connects directly with `@ng-address/core` and `@ng-address/nipost`, exposing developer-friendly terminal and CI/CD operations.

</domain>

<decisions>
## Implementation Decisions

### Command Framework & Interactive Ergonomics
- **D-01:** Use `cac` for lightweight, expressive command definition paired with `@clack/prompts` and `picocolors` for an interactive, modern terminal experience.
- **D-02:** When `ng-address` or `ng-address lookup` is invoked with no arguments in an interactive TTY, launch a step-by-step `@clack/prompts` wizard guiding the user through address lookup or hierarchical State/LGA selection.

### Output Formatting & Scripting UX
- **D-03:** Auto-detect TTY: Print styled, colored cards and tables in interactive terminals (`process.stdout.isTTY`); output clean, raw JSON when piped or when the `--json` flag is provided.
- **D-04:** Provide `--compact` and `--quiet` flags for minimal single-line or script-focused stdout.

### Authentication & Environment Handling
- **D-05:** Read NIPOST credentials seamlessly from the `NIPOST_API_KEY` environment variable with an explicit `--api-key` override option.
- **D-06:** In offline mode or when no API key is provided, offline commands (`validate`, `normalize`, `list-states`, `list-lgas`) execute without network access, while online `lookup` outputs clear, actionable guidance on setting `NIPOST_API_KEY`.

### Exit Codes for CI/CD Pipelines
- **D-07:** Implement standardized exit codes:
  - `0`: Success / Valid address / Clean resolution
  - `1`: Invalid format / Validation error / Address not found
  - `2`: Missing authentication / Network error / Upstream provider failure

### the agent's Discretion
- Packaging and binary distribution details (`packages/cli` with `tsup` executable bin wrapper `dist/bin.js` marked with `#!/usr/bin/env node` and `"bin": { "ng-address": "./dist/bin.js" }`).
- Unit testing strategy using Vitest with CLI command harness testing.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core & Provider Contracts
- `.planning/REQUIREMENTS.md` § CLI-01 - CLI-04 — Official requirements for CLI lookup, validation, normalization, and output formatting.
- `packages/core/src/index.ts` — Core exports: `normalizeNigerianAddress`, `isValidPostcodeFormat`, `NIGERIAN_STATES`, `findNigerianState`, and `AddressError`.
- `packages/nipost/src/index.ts` — Provider exports: `NipostProvider`, `NipostHttpClient`, and NDAPS helpers (`parseNdapsPostcode`, `formatNdapsPostcode`).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@ng-address/core`: Complete offline dataset of 36 States + FCT and 774 LGAs with case-insensitive normalization algorithms.
- `@ng-address/nipost`: `NipostProvider` with built-in retry backoff and structured error translation for `lookup` commands.

### Established Patterns
- Monorepo package layout with TypeScript, `tsup` bundling, ESM/CJS exports, and strict Zod/schema boundaries.
- Consistent Vitest suites across packages.

### Integration Points
- CLI binary `ng-address` imports `@ng-address/core` for offline zero-latency commands and lazily instantiates `NipostProvider` from `@ng-address/nipost` when performing network lookups.

</code_context>

<specifics>
## Specific Ideas
- Support Unix piping (e.g. `echo "Lekki Phase 1, Lagos" | ng-address normalize` or `cat postcodes.txt | ng-address validate`).
- Pretty card/box layout using `@clack/prompts` styling for `ng-address lookup` results showing building, street, LGA, state, postcode, coordinates, and provenance.

</specifics>

<deferred>
## Deferred Ideas
- `ng-address migrate` for bulk CSV/database batch processing (v2 requirement MIGR-01).

</deferred>

---

*Phase: 04-developer-cli-tooling*
*Context gathered: 2026-10-02*
