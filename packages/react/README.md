# @ng-address/react

> Accessible (WCAG 2.2 AA), keyboard-navigable React UI components and headless hooks for Nigerian address entry and verification.

## Features

- **`<NigerianAddressInput />`**: Dynamic input supporting free-text address and NDAPS digital postcode entry.
- **`<StateLgaSelect />`**: Dependent cascading select for all 36 Nigerian states + FCT and 774 LGAs.
- **`<AddressConfirmationCard />` & `<AddressConfirmationModal />`**: Explicit confirmation components with provenance indicators and coordinate details.
- **Headless Hooks**: `useAddressResolution`, `usePostcodeLookup`, `useFocusTrap`.
- **Accessibility**: ARIA compliant, keyboard navigation (Arrow keys, Enter, Escape), focus management.

## Installation

```bash
pnpm add @ng-address/react @ng-address/core
```

## Usage

```tsx
import React, { useState } from 'react';
import {
  AddressConfigProvider,
  NigerianAddressInput,
  AddressConfirmationModal
} from '@ng-address/react';
import '@ng-address/react/styles.css';

export function App() {
  const [address, setAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <AddressConfigProvider config={{ apiBaseUrl: '/api/address' }}>
      <NigerianAddressInput
        onAddressSelect={(resolved) => {
          setAddress(resolved);
          setShowModal(true);
        }}
      />

      {showModal && address && (
        <AddressConfirmationModal
          isOpen={showModal}
          address={address}
          onConfirm={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </AddressConfigProvider>
  );
}
```
