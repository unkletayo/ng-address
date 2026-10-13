# Security & Privacy Architecture Guide

This document defines the security boundaries, credential isolation principles, and data privacy safeguards implemented in **NG Address**.

---

## 1. Threat Model & Key Risks

| Threat Ref | Attack Surface | Mitigation Strategy |
| :--- | :--- | :--- |
| **T-01** | Client-Side Secret Leakage | Strict runtime environment guards in `@ng-address/nipost` preventing client bundle execution; server proxy architectural pattern. |
| **T-02** | Upstream DoS / Rate Limits | Exponential backoff with random jitter, rate-limit header parsing, and retry budgets on 5xx/429 errors. |
| **T-03** | Stored / Logged Secrets | Automatic API key sanitization in CLI & error handlers (`nip_...3456`). |
| **T-04** | Malicious / Oversized Input | 1MB maximum standard input stream buffer limits in CLI; strict Zod schema validation on all inputs. |

---

## 2. Credential Isolation Architecture

### The Server Proxy Pattern
Direct communication from browser clients to NIPOST NDAPS endpoints is **strictly prohibited**.

```
[ Browser / React App ]
         │  (1) POST /api/address/lookup { postcode: "LA-10-A01-LK-02" }
         ▼
[ Your Backend / Next.js Server Route ]  <--- Holds NIPOST_API_KEY (Isolated)
         │  (2) GET /v1/lookup with Header `X-API-Key: ...`
         ▼
[ Authoritative NIPOST Gateway ]
```

### Runtime Client Guard in `@ng-address/nipost`
`@ng-address/nipost` actively detects if it is executed within a browser window (`typeof window !== 'undefined'`) and throws a `ConfigurationError` to prevent accidental credential leakage in frontend bundles:

```typescript
if (typeof window !== 'undefined') {
  throw new ConfigurationError(
    'NipostProvider cannot be initialized directly in browser environments. ' +
    'Use a server-side proxy endpoint to protect your API credentials.'
  );
}
```

---

## 3. Data Minimization & Privacy

1. **Zero Data Scraping**: NG Address does not scrape or store personal addresses. It provides real-time transformation and verification contracts.
2. **Provenance Auditing**: Every normalized field carries metadata (`source: "user" | "nipost" | "osm" | "derived"`) to ensure data lineages can be audited without fabricating certainty.
3. **Log Sanitization**: Error handlers strip sensitive query parameters and mask credentials when dumping diagnostic reports.
