# NG Address Quickstart Guide

Get up and running with **NG Address** in under 10 minutes.

---

## 1. Installation

Install the canonical core utilities, NIPOST provider, and React components into your project:

```bash
# Using pnpm
pnpm add @ng-address/core @ng-address/nipost @ng-address/react

# Using npm
npm install @ng-address/core @ng-address/nipost @ng-address/react

# Using yarn
yarn add @ng-address/core @ng-address/nipost @ng-address/react
```

---

## 2. Fast Offline Address Normalization

Standardize Nigerian administrative subdivisions (36 states + FCT and 774 LGAs) with zero external network dependencies:

```typescript
import { normalizeNigerianAddress, findNigerianState } from '@ng-address/core';

// 1. Parse free-text addresses with messy casing and whitespace
const result = normalizeNigerianAddress(
  "Plot 4, Admiralty Way, Lekki Phase 1, Eti Osa, Lagos State, 105102"
);

console.log(result.administrative.state);     // "Lagos"
console.log(result.administrative.stateCode); // "LA"
console.log(result.administrative.lga);       // "Eti Osa"
console.log(result.postcode);                 // "105102"
console.log(result.provenance?.state?.source);// "derived"

// 2. Lookup official Nigerian State data
const lagos = findNigerianState("lagos");
console.log(lagos?.capital);  // "Ikeja"
console.log(lagos?.geoZone);  // "South West"
console.log(lagos?.lgas.length); // 20
```

---

## 3. Server-Side NIPOST NDAPS Resolution

Resolve official Nigerian digital alphanumeric postcodes on your Node.js / Next.js server:

```typescript
import { NipostProvider } from '@ng-address/nipost';

const provider = new NipostProvider({
  apiKey: process.env.NIPOST_API_KEY
});

async function resolveDeliveryAddress(postcode: string) {
  const resolution = await provider.resolvePostcode(postcode);
  
  console.log('Status:', resolution.status); // "EXACT"
  console.log('Address:', resolution.address.raw);
  console.log('Coordinates:', resolution.address.coordinates);
  return resolution.address;
}
```

> [!SECURITY NOTE]
> Never put your `NIPOST_API_KEY` in client-side code. Always resolve postcodes through a server-side endpoint or proxy route.

---

## 4. Drop-in React Components

Integrate accessible, keyboard-navigable Nigerian address inputs with confirmation workflows:

```tsx
import React, { useState } from 'react';
import {
  AddressConfigProvider,
  NigerianAddressInput,
  AddressConfirmationModal
} from '@ng-address/react';
import '@ng-address/react/styles.css';
import type { NigerianAddress } from '@ng-address/core';

export function CheckoutForm() {
  const [address, setAddress] = useState<NigerianAddress | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AddressConfigProvider config={{ apiBaseUrl: '/api/address' }}>
      <form onSubmit={(e) => { e.preventDefault(); if (address) setIsModalOpen(true); }}>
        <label htmlFor="address-input">Delivery Address</label>
        <NigerianAddressInput
          id="address-input"
          placeholder="e.g. 10 Marina Street, Lagos or LA-10-A01-LK-02"
          onAddressSelect={(resolved) => {
            setAddress(resolved);
            setIsModalOpen(true);
          }}
        />

        {isModalOpen && address && (
          <AddressConfirmationModal
            isOpen={isModalOpen}
            address={address}
            onConfirm={() => {
              setIsModalOpen(false);
              alert('Address confirmed!');
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </form>
    </AddressConfigProvider>
  );
}
```

---

## 5. Command-Line Tooling (CLI)

Use the CLI for developer workflows, debugging, and terminal automation:

```bash
# Resolve digital postcode
npx @ng-address/cli lookup LA-10-A01-LK-02

# Validate offline format
npx @ng-address/cli validate "Ikeja, Lagos"

# Browse states & LGAs interactively
npx @ng-address/cli list-states --zone "South West"
```
