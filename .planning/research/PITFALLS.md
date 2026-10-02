# Domain Pitfalls & Risk Mitigation

**Domain:** Nigerian Address Infrastructure & Location Services
**Date:** 2026-10-02

## Critical Pitfalls & Solutions

### 1. Fabricating Certainty on Ambiguous Addresses
- **Pitfall:** Automatically formatting informal Nigerian address descriptions (e.g. "Opposite First Bank, Behind Total Filling Station, Ring Road") into strict street numbers without high-confidence provider match.
- **Impact:** Failed parcel deliveries, invalid financial records, loss of original user nuance.
- **Solution:** Always store the original `raw` string. Use explicit resolution status codes (`MATCHED`, `PARTIAL`, `UNRESOLVED`, `AMBIGUOUS`) and explicit field provenance (`source: "user" | "nipost" | "derived"`).

### 2. Leaking Provider API Credentials into Client Bundles
- **Pitfall:** Developers installing `@ng-address/nipost` in client-side React code and configuring `apiKey: "sk_live_..."` in browser builds.
- **Impact:** Credential theft, unauthorized quota consumption, security breaches.
- **Solution:** Enforce architecture where `@ng-address/react` communicates with application backend endpoints (e.g., `/api/address/resolve`) rather than direct provider network requests. Add compile-time and runtime warnings if private credentials are used in browser contexts.

### 3. Conflating Format Validity with Entity Existence
- **Pitfall:** Assuming that because a digital postcode matches the syntax regex (e.g. valid alphanumeric length), the postcode exists and resolves to an active location.
- **Impact:** False positives during form validation.
- **Solution:** Strictly differentiate `isValidPostcodeFormat()` (pure offline syntax check) from `resolvePostcode()` (network resolution).

### 4. Upstream Provider Flakiness and Rate Limits
- **Pitfall:** Unhandled provider outages or rate limits crashing downstream consumer applications.
- **Impact:** Broken checkout flows, blocked user registrations.
- **Solution:** Standardize `AddressError` with `isRetryable` flags, exponential backoff with jitter, configurable timeout budgets, and optional local caching layers.

---
*Pitfalls research: 2026-10-02*
