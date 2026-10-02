# Technical Debt, Risks & Areas of Concern

**Analysis Date:** 2026-10-02

## High-Priority Concerns & Risks

### 1. NIPOST NDAPS API Availability & Rate Limiting
- **Concern:** Upstream API stability, rate limits, latency fluctuations, and undocumented breaking changes.
- **Mitigation:**
  - Robust retry policies with exponential backoff and jitter.
  - Granular `AddressErrorCode` mappings to prevent ambiguous error states.
  - Multi-tier caching strategy (memory / Redis) with configurable TTLs.
  - Graceful fallback and clear UI messaging when provider is unreachable.

### 2. Legal, Licensing & Data Duplication Boundaries
- **Concern:** Unauthorized scraping or redistribution of NIPOST's NDAPS database violates terms of service and intellectual property boundaries.
- **Mitigation:**
  - Explicit architectural boundary: NG Address is an integration SDK and workflow abstraction layer, not a database mirror.
  - Zero bulk-dump / scraping scripts in repository.
  - Clear open-source license boundaries in documentation and contributor guidelines.

### 3. Address Ambiguity & Non-Standard Nigerian Address Formats
- **Concern:** Nigerian addresses frequently use informal landmarks, descriptive directions, or unnumbered plots that cannot map directly to strict building/street hierarchies.
- **Mitigation:**
  - Preserve `raw` text alongside structured components.
  - Conservative normalization: avoid guessing missing fields.
  - Explicit address resolution statuses (`EXACT`, `MATCHED`, `PARTIAL`, `UNRESOLVED`, `AMBIGUOUS`).

### 4. Client-Side Credential Exposure
- **Concern:** Application developers accidentally embedding NIPOST API secrets in frontend React applications.
- **Mitigation:**
  - Clear documentation advocating backend proxy / server-side mediation architecture.
  - Warning logs and clear separation between browser SDKs and server SDKs.

## Current Technical Debt

- **Bootstrap Stage:** Codebase is currently at specification / PRD stage (`docs/NG-Address-PRD.md`); package workspace, build configurations, and test runners need to be scaffolded.

---

*Concerns analysis: 2026-10-02*
*Update as risks are resolved or new debt emerges*
