# Directory Structure

**Analysis Date:** 2026-10-02

## Workspace Layout

```text
ng-address/
├── .agents/                      # GSD workflows, agents, references, and configuration
├── .planning/                    # Project planning, codebase maps, roadmap, state
│   └── codebase/                 # Structured codebase intelligence documents
├── docs/                         # Specifications and documentation
│   └── NG-Address-PRD.md         # Comprehensive Product Requirements Document
├── packages/                     # Monorepo packages (Planned implementation structure)
│   ├── core/                     # @ng-address/core: types, schemas, validation, interfaces
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── schema/           # Address schemas & Zod validators
│   │   │   ├── provider/         # AddressProvider interface & capabilities
│   │   │   ├── errors/           # Structured AddressError hierarchy
│   │   │   └── utils/            # Normalization and postcode helpers
│   │   └── package.json
│   ├── provider-nipost/          # @ng-address/nipost: NIPOST NDAPS adapter
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── client.ts         # HTTP client & auth
│   │   │   ├── mapper.ts         # Response to NigerianAddress transformation
│   │   │   └── nipost-provider.ts
│   │   └── package.json
│   ├── react/                    # @ng-address/react: UI components and React hooks
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── components/       # NigerianAddressInput, PostcodeInput, ConfirmationModal
│   │   │   └── hooks/            # useAddressResolution, usePostcodeLookup
│   │   └── package.json
│   └── cli/                      # @ng-address/cli: command-line developer tooling
│       ├── src/
│       │   ├── index.ts
│       │   └── commands/         # lookup, validate, search, normalize
│       └── package.json
├── examples/                     # Example applications and reference integrations
├── tests/                        # Cross-package integration and contract test suites
├── skills/                       # IDE agent skills
├── skills-lock.json              # Agent skill lockfile
└── .gitignore                    # Git ignore definitions
```

## Key Locations

| Directory / File | Purpose |
|-------------------|---------|
| `docs/NG-Address-PRD.md` | Primary architectural and product requirements specification |
| `.planning/codebase/` | Machine-readable codebase architecture and convention maps |
| `packages/core/` | Core domain primitives, schemas, and provider contracts |
| `packages/provider-nipost/` | Official NIPOST provider implementation |
| `packages/react/` | React UI component library with accessible address input |
| `packages/cli/` | Command-line tool for developers |

## Naming Conventions

- **Packages:** Monorepo packages use kebab-case under `@ng-address/` scope (`@ng-address/core`, `@ng-address/nipost`).
- **Files:** TypeScript source files use kebab-case (`address-input.tsx`, `nipost-provider.ts`, `address-error.ts`).
- **Interfaces & Types:** PascalCase (`NigerianAddress`, `AddressProvider`, `VerificationStatus`).
- **Functions & Methods:** camelCase (`isValidPostcodeFormat`, `resolvePostcode`).
- **Constants:** SCREAMING_SNAKE_CASE for constant lookup tables, error codes, and enums.

---

*Structure analysis: 2026-10-02*
*Update when directory structure changes*
