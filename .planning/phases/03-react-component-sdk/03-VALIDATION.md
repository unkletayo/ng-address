---
phase: "03"
slug: "react-component-sdk"
status: draft
nyquist_compliant: true
wave_0_complete: false
created: "2026-10-02"
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest + `@testing-library/react` + `jsdom` |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `export PATH=$HOME/.bun/bin:$PATH; bun test packages/react` |
| **Full suite command** | `export PATH=$HOME/.bun/bin:$PATH; bun test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `export PATH=$HOME/.bun/bin:$PATH; bun test packages/react`
- **After every plan wave:** Run `export PATH=$HOME/.bun/bin:$PATH; bun test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | REACT-02 | — | Scaffolds React package, peer deps, and tsup build | build | `export PATH=$HOME/.bun/bin:$PATH; bun test` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | REACT-02 | T-03-01 | Context provider and hooks handle abort & error mapping | unit | `export PATH=$HOME/.bun/bin:$PATH; bun test packages/react/test/hooks.test.tsx` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | REACT-01 | T-03-02 | Combobox detects postcode vs text and toggles State/LGA | integration | `export PATH=$HOME/.bun/bin:$PATH; bun test packages/react/test/input.test.tsx` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | REACT-03 | — | Dual confirmation components render breakdown and confirm | integration | `export PATH=$HOME/.bun/bin:$PATH; bun test packages/react/test/modal.test.tsx` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 2 | REACT-04, REACT-05 | — | ARIA compliance and keyboard navigation (Arrow, Enter, Escape, Tab trap) | a11y | `export PATH=$HOME/.bun/bin:$PATH; bun test packages/react/test/a11y.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `packages/react/package.json` — package configuration and dependencies
- [ ] `packages/react/tsconfig.json` & `packages/react/tsup.config.ts` — TypeScript and build config
- [ ] `packages/react/test/setup.ts` — React testing environment

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual aesthetic and focus ring contrast check | REACT-04 | Visual rendering validation | Verify high-contrast `:focus-visible` ring on light and dark backgrounds |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-02
