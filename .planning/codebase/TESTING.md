# Testing Strategy & Practices

**Analysis Date:** 2026-10-02

## Test Framework & Runners

- **Unit & Integration:** Vitest for ultra-fast TypeScript testing with native ESM support.
- **Component & UI:** React Testing Library + jsdom for `@ng-address/react` component testing.
- **Accessibility:** `axe-core` / `vitest-axe` for automated a11y regression testing.
- **End-to-End & Contract:** Playwright for multi-browser flow verification and mocked provider contract testing.

## Testing Layers

```text
+-------------------------------------------------------------+
|                      E2E & UI Tests                         |
|   Full address capture, confirmation modals, keyboard nav   |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                   Contract / Boundary Tests                 |
|   NIPOST API response fixtures, schema drift detection      |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                   Package Integration Tests                 |
|   SDK client + provider adapters + retry policies           |
+-------------------------------------------------------------+
                              |
+-------------------------------------------------------------+
|                      Unit Test Suite                        |
|   Postcode regex/syntax, normalization, error translation   |
+-------------------------------------------------------------+
```

## Test Data Guidelines & Privacy Rules

- **Zero Real PII in Fixtures:** Never commit real individuals' private home addresses, phone numbers, or personal identity details to test fixtures.
- **Synthetic & Public Data:** Use authorized public datasets, government facility addresses, well-known landmarks (e.g., National Theatre Lagos, Eagle Square Abuja), and generated synthetic test cases.
- **Mocked Provider Responses:** Record and mock NIPOST NDAPS HTTP responses to avoid network flakiness, rate limits, and external service downtime during CI runs.

## Test Coverage Requirements

- **Core Schemas & Normalization:** >= 95% line and branch coverage.
- **Provider Adapters:** 100% mapping coverage for valid responses, 4xx/5xx errors, timeouts, and rate limits.
- **CLI Commands:** Coverage of argument parsing, error exits, and formatted output modes (JSON, text).

---

*Testing analysis: 2026-10-02*
*Update when testing frameworks or practices change*
