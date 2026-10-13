# Phase 4: Developer CLI Tooling — Discussion Log

**Date:** 2026-10-02  
**Phase:** `04-developer-cli-tooling`  

## Topics Discussed & Decisions

### 1. Command Framework & CLI Ergonomics
- **Options Considered:**
  - Commander.js with picocolors and table formatting
  - CAC or Clerc with clack prompts (Minimalist, modern prompt-driven experience)
- **Selection:** `cac` with `@clack/prompts` and `picocolors`.
- **Interactive Wizard:** When run without arguments in an interactive terminal, launch a step-by-step `@clack/prompts` wizard for guided address lookup and LGA selection.

### 2. Output Formatting & Scripting UX
- **Options Considered:**
  - Auto-detect TTY: Rich cards/tables in terminal, raw JSON when piped or with `--json`
  - Explicit flag only: Always print human-readable unless flag requested
- **Selection:** Auto-detect TTY with full `--json`, `--compact`, and `--quiet` support.

### 3. Authentication & Environment Handling
- **Selection:** `NIPOST_API_KEY` environment variable with `--api-key` flag override. Offline commands execute without keys; online lookup outputs helpful setup instructions if unauthenticated.

### 4. Exit Code Strategy for CI/CD
- **Selection:** Standard 3-tier exit codes:
  - `0`: Success / Valid address
  - `1`: Invalid format / Validation error / Address not found
  - `2`: Network / Auth / Provider error
