---
phase: "01"
slug: "monorepo-foundation-core-primitives"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-10-02"
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test --run` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test --run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | CORE-01 | — | N/A | build | `pnpm --filter @ng-address/core build` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | CORE-01 | — | N/A | unit | `pnpm test packages/core` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 2 | CORE-01, CORE-02 | — | Never fabricate certainty | unit | `pnpm test packages/core/test/schema.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 2 | CORE-03, CORE-04 | — | Safe normalization without data loss | unit | `pnpm test packages/core/test/normalization.test.ts` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 2 | CORE-05, CORE-06 | — | Structured typed errors | unit | `pnpm test packages/core/test/errors.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm-workspace.yaml`, root `package.json`, `tsconfig.base.json`
- [ ] `packages/core/package.json`, `packages/core/tsconfig.json`, `packages/core/tsup.config.ts`
- [ ] Vitest setup in root and core package

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
