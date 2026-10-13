---
phase: "04"
slug: "developer-cli-tooling"
status: approved
nyquist_compliant: true
wave_0_complete: false
created: "2026-10-02"
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm --filter @ng-address/cli test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm --filter @ng-address/cli test`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|--------|
| 04-01-01 | 01 | 1 | CLI-04 | — | Scaffolds CLI package, tsup bin builder, and CAC router | build | `pnpm --filter @ng-address/cli test` | ⬜ pending |
| 04-01-02 | 01 | 1 | CLI-04 | T-04-01 | Environment loader and formatted output (TTY vs JSON vs quiet) | unit | `pnpm --filter @ng-address/cli test` | ⬜ pending |
| 04-02-01 | 02 | 2 | CLI-01 | T-04-01 | Lookup command resolves digital postcodes & handles auth errors | integration | `pnpm --filter @ng-address/cli test` | ⬜ pending |
| 04-02-02 | 02 | 2 | CLI-02, CLI-03 | T-04-02 | Validate and normalize commands with stdin piping and exit codes | unit | `pnpm --filter @ng-address/cli test` | ⬜ pending |
| 04-02-03 | 02 | 2 | CLI-04 | — | Interactive @clack/prompts wizard and administrative listing | e2e | `pnpm --filter @ng-address/cli test` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `packages/cli/package.json` — package configuration and dependencies
- [ ] `packages/cli/tsconfig.json` & `packages/cli/tsup.config.ts` — TypeScript and build config

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all package references
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-02
