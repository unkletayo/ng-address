# Phase 4: Developer CLI Tooling — Technical Research

**Phase:** `04-developer-cli-tooling`  
**Package:** `@ng-address/cli` (`packages/cli`)  
**Target Binary:** `ng-address` (and alias `npx @ng-address/cli`)  
**Date:** 2026-10-02  

---

## 1. Executive Summary

Phase 4 delivers the developer command-line interface (`@ng-address/cli`) for the `ng-address` monorepo. It enables terminal-based address lookup, offline validation, canonical normalization, administrative data listing, and interactive terminal workflows.

The CLI is engineered to be:
1. **Lightweight & Fast**: Zero unnecessary bloat. Offline commands (`validate`, `normalize`, `list-states`) run instantly with zero network latency.
2. **Ergonomic**: Powered by `cac` for argument parsing and `@clack/prompts` + `picocolors` for modern, elegant terminal UI with spinners and styled cards.
3. **Script- & Pipeline-Ready**: Automatically detects TTY; outputs JSON when piped or when `--json` is supplied; adheres to strict exit code contracts (0, 1, 2) for CI/CD pipelines.
4. **Secure**: Reads `NIPOST_API_KEY` from the environment or `--api-key` flag without persisting secrets or logging sensitive credentials.

---

## 2. Architecture & Dependencies

### Package Structure (`packages/cli`)

```
packages/cli/
├── package.json          # "bin": { "ng-address": "./dist/bin.js" }
├── tsconfig.json         # Extends root tsconfig.base.json
├── tsup.config.ts        # Bundles CLI to single standalone dist/bin.js with shebang
├── src/
│   ├── bin.ts            # Shebang entry point invoking cli.run()
│   ├── cli.ts            # CAC router & global flag definition
│   ├── commands/
│   │   ├── lookup.ts     # 'ng-address lookup <postcode>'
│   │   ├── validate.ts   # 'ng-address validate <address>'
│   │   ├── normalize.ts  # 'ng-address normalize <address>'
│   │   ├── states.ts     # 'ng-address list-states'
│   │   ├── lgas.ts       # 'ng-address list-lgas <state>'
│   │   └── wizard.ts     # Interactive @clack/prompts wizard
│   ├── formatters/
│   │   ├── card.ts       # Rich terminal card layout for addresses
│   │   ├── json.ts       # Clean JSON stringifier
│   │   └── table.ts      # Tabular formatting for states & LGAs
│   ├── utils/
│   │   ├── env.ts        # NIPOST_API_KEY resolution
│   │   ├── exit.ts       # Standardized exit codes (0, 1, 2)
│   │   └── stdin.ts      # Reading from Unix pipes / process.stdin
│   └── index.ts          # Programmatic API exports
└── test/
    ├── lookup.test.ts    # Testing lookup command with mocked provider
    ├── validate.test.ts  # Testing offline validation command & exit codes
    ├── normalize.test.ts # Testing normalization output & flags
    └── format.test.ts    # Testing JSON vs human output
```

### Dependencies
- **Core workspace dependencies**:
  - `@ng-address/core`: `workspace:*` (Canonical types, normalization, offline datasets)
  - `@ng-address/nipost`: `workspace:*` (NipostProvider, NDAPS helpers)
- **Runtime dependencies**:
  - `cac`: `^6.7.14` (Command line parser)
  - `@clack/prompts`: `^0.9.0` (Terminal UI & interactive prompts)
  - `picocolors`: `^1.1.1` (Lightweight terminal colors)
- **Dev dependencies**:
  - `tsup`: `^8.4.0` (Dual format bundle + executable shebang injection)
  - `typescript`: `^5.7.3`
  - `vitest`: `^3.0.7`

---

## 3. Command Specifications

### 1. `ng-address lookup <postcode>` (Requirement: `CLI-01`, `CLI-04`)
- **Usage**: `ng-address lookup <postcode> [--api-key <key>] [--json] [--compact]`
- **Behavior**:
  - Validates format offline via `isValidPostcodeFormat()`. If invalid, exits with code `1`.
  - Instantiates `NipostProvider` using `NIPOST_API_KEY` or `--api-key`. If key is missing, outputs helpful setup guidance and exits with code `2`.
  - Displays formatted address card (Terminal) or JSON (Piped / `--json`).
  - Returns exit code `0` on success, `1` if postcode not found, `2` on network/auth error.

### 2. `ng-address validate <address>` (Requirement: `CLI-02`, `CLI-04`)
- **Usage**: `ng-address validate <address-or-postcode> [--json] [--quiet]`
- **Behavior**:
  - Tests whether input is valid digital/traditional postcode or verifiable Nigerian address.
  - Outputs validation diagnostics (state recognized, LGA validity, postcode checksum).
  - Returns exit code `0` if valid, `1` if invalid.

### 3. `ng-address normalize <input>` (Requirement: `CLI-03`, `CLI-04`)
- **Usage**: `ng-address normalize [input] [--json] [--compact]`
- **Behavior**:
  - Reads argument or reads from `stdin` if piped (e.g., `echo "plot 10 victoria island lagos" | ng-address normalize`).
  - Standardizes casing, trims whitespace, resolves state code and LGA names.
  - Prints normalized address string or full JSON breakdown.

### 4. `ng-address list-states` & `ng-address list-lgas <state>`
- **Usage**: `ng-address list-states [--zone <zone>] [--json]` / `ng-address list-lgas <state> [--json]`
- **Behavior**:
  - Fast offline listing of Nigeria's 36 states + FCT, capitals, zones, and 774 official LGAs.

### 5. `ng-address` (Interactive Wizard)
- **Usage**: `ng-address` (no arguments in TTY)
- **Behavior**:
  - Launches `@clack/prompts` wizard:
    1. Select operation: (1) Resolve Postcode, (2) Validate Address, (3) Normalize Text, (4) Browse States & LGAs.
    2. Interactive prompt with input validation and instant result display.

---

## 4. Exit Code Contract

| Code | Meaning | Example |
|------|---------|---------|
| `0` | Success / Valid | Address resolved, postcode valid, text normalized |
| `1` | Validation Error / Not Found | Invalid postcode format, unknown LGA, address not found |
| `2` | System / Auth / Network Error | `NIPOST_API_KEY` missing, 401 Unauthorized, upstream 5xx timeout |

---

## 5. Security & Isolation

- **Threat Ref `T-04-01`**: Zero credential leakage in stdout/stderr. If auth fails, sanitize error messages to avoid printing raw keys or request tokens.
- **Threat Ref `T-04-02`**: Safe Unix piping. Handle large stdin streams with bounded buffer sizes to prevent memory denial of service.

---

## 6. Validation Architecture

- **Unit & Integration Tests**:
  - Command parsing and dispatch.
  - Stdin reading and pipe detection.
  - Formatter behavior (`--json` vs terminal output).
  - Exit code assertion (`0`, `1`, `2`).
  - Error resilience without unhandled rejections.
