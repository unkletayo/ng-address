# 🇳🇬 NG Address

> Standard, open-source developer infrastructure and UI components for Nigerian address capture, administrative taxonomy normalization, and NIPOST NDAPS verification.

[![CI](https://github.com/ng-address/ng-address/actions/workflows/ci.yml/badge.svg)](https://github.com/ng-address/ng-address/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📦 Packages in this Monorepo

| Package | Purpose | Docs |
| :--- | :--- | :--- |
| [`@ng-address/core`](file:///Users/Camyn/Desktop/workspace/projects/ng-address/packages/core) | Canonical TypeScript types, Zod schemas, 36 states + FCT / 774 LGAs dataset, deterministic offline normalization, and `AddressError` hierarchy. | [README](file:///Users/Camyn/Desktop/workspace/projects/ng-address/packages/core/README.md) |
| [`@ng-address/nipost`](file:///Users/Camyn/Desktop/workspace/projects/ng-address/packages/nipost) | Authoritative NIPOST NDAPS provider adapter with server credential isolation, exponential retry backoff, and error mapping. | [README](file:///Users/Camyn/Desktop/workspace/projects/ng-address/packages/nipost/README.md) |
| [`@ng-address/react`](file:///Users/Camyn/Desktop/workspace/projects/ng-address/packages/react) | Accessible (`WCAG 2.2 AA`), keyboard-navigable `<NigerianAddressInput />`, cascading `<StateLgaSelect />`, and confirmation modals. | [README](file:///Users/Camyn/Desktop/workspace/projects/ng-address/packages/react/README.md) |
| [`@ng-address/cli`](file:///Users/Camyn/Desktop/workspace/projects/ng-address/packages/cli) | Terminal CLI for NDAPS postcode lookup, offline syntax validation, string normalization, and interactive guided wizard. | [README](file:///Users/Camyn/Desktop/workspace/projects/ng-address/packages/cli/README.md) |

---

## ⚡ Quickstart

```bash
pnpm add @ng-address/core @ng-address/nipost @ng-address/react
```

### 1. Offline Address Normalization

```typescript
import { normalizeNigerianAddress } from '@ng-address/core';

const address = normalizeNigerianAddress(
  "Plot 10 Admiralty Way, Lekki Phase 1, Eti Osa, Lagos"
);

console.log(address.administrative.state); // "Lagos"
console.log(address.administrative.lga);   // "Eti Osa"
```

### 2. Server-Side Postcode Lookup

```typescript
import { NipostProvider } from '@ng-address/nipost';

const provider = new NipostProvider({ apiKey: process.env.NIPOST_API_KEY });
const resolution = await provider.resolvePostcode('LA-10-A01-LK-02');
console.log(resolution.address.raw);
```

### 3. Accessible React Form

```tsx
import { AddressConfigProvider, NigerianAddressInput } from '@ng-address/react';
import '@ng-address/react/styles.css';

export function Form() {
  return (
    <AddressConfigProvider config={{ apiBaseUrl: '/api/address' }}>
      <NigerianAddressInput onAddressSelect={(addr) => console.log(addr)} />
    </AddressConfigProvider>
  );
}
```

---

## 🚀 Reference Applications

- [Next.js 15 App Router Reference](file:///Users/Camyn/Desktop/workspace/projects/ng-address/examples/nextjs-app-router)
- [Express.js Backend REST API Reference](file:///Users/Camyn/Desktop/workspace/projects/ng-address/examples/express-api)

---

## 📚 Documentation

- [Quickstart Guide](file:///Users/Camyn/Desktop/workspace/projects/ng-address/docs/quickstart.md)
- [Security & Privacy Architecture](file:///Users/Camyn/Desktop/workspace/projects/ng-address/docs/security.md)
- [Custom Provider Guide](file:///Users/Camyn/Desktop/workspace/projects/ng-address/docs/providers.md)

---

## 📄 License

MIT © [NG Address Contributors](https://github.com/ng-address/ng-address)
