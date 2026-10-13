import React from 'react';
import { CodeBlock } from '../../components/code-block';
import { Callout } from '../../components/callout';

export default function QuickstartPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">Guide</span>
          <span className="badge badge-blue">5 Minutes</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          Quickstart Guide
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
          Learn how to install, normalize Nigerian addresses offline, configure server-side NIPOST NDAPS verification, and render accessible React components.
        </p>
      </div>

      <section style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          1. Installation
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '12px' }}>
          Install the required packages using your package manager of choice:
        </p>
        <CodeBlock
          filename="Terminal"
          language="bash"
          code={`# Using pnpm
pnpm add @ng-address/core @ng-address/nipost @ng-address/react

# Using npm
npm install @ng-address/core @ng-address/nipost @ng-address/react

# Using yarn
yarn add @ng-address/core @ng-address/nipost @ng-address/react`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          2. Offline Address Normalization
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '12px' }}>
          Standardize 36 states + FCT and 774 Local Government Areas completely offline without external network overhead:
        </p>
        <CodeBlock
          filename="normalize-example.ts"
          code={`import { normalizeNigerianAddress, findNigerianState } from '@ng-address/core';

// Standardize free-text address inputs
const result = normalizeNigerianAddress(
  "Plot 4, Admiralty Way, Lekki Phase 1, Eti Osa, Lagos State, 105102"
);

console.log(result.administrative.state);     // "Lagos"
console.log(result.administrative.stateCode); // "LA"
console.log(result.administrative.lga);       // "Eti Osa"
console.log(result.postcode);                 // "105102"
console.log(result.provenance?.state?.source);// "derived"

// Lookup official state data and its 20 LGAs
const lagos = findNigerianState("lagos");
console.log(lagos?.capital);      // "Ikeja"
console.log(lagos?.geoZone);      // "South West"
console.log(lagos?.lgas.length);  // 20`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          3. Server-Side NIPOST NDAPS Resolution
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '12px' }}>
          Resolve official Nigerian digital alphanumeric postcodes on your Node.js or Next.js server:
        </p>
        <Callout type="security" title="Keep API Keys on Server">
          Never expose your <code>NIPOST_API_KEY</code> in client-side code. Always resolve postcodes through a server-side route handler or API proxy.
        </Callout>
        <CodeBlock
          filename="app/api/address/lookup/route.ts"
          code={`import { NextResponse } from 'next/server';
import { NipostProvider } from '@ng-address/nipost';
import { isValidPostcodeFormat, AddressError } from '@ng-address/core';

const provider = new NipostProvider({
  apiKey: process.env.NIPOST_API_KEY
});

export async function POST(request: Request) {
  try {
    const { postcode } = await request.json();

    if (!isValidPostcodeFormat(postcode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Nigerian postcode format' },
        { status: 400 }
      );
    }

    const resolution = await provider.resolvePostcode(postcode);
    return NextResponse.json({ success: true, data: resolution });
  } catch (error) {
    if (error instanceof AddressError) {
      return NextResponse.json(
        { success: false, code: error.code, error: error.message },
        { status: error.code === 'NOT_FOUND' ? 404 : 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          4. Drop-in React Components
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '12px' }}>
          Wrap your application with <code>&lt;AddressConfigProvider /&gt;</code> and render accessible inputs with confirmation modals:
        </p>
        <CodeBlock
          filename="checkout-form.tsx"
          code={`'use client';

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AddressConfigProvider config={{ proxyUrl: '/api/address/lookup' }}>
      <div>
        <NigerianAddressInput
          onSelect={(resolved) => {
            setAddress(resolved);
            setIsOpen(true);
          }}
        />

        {isOpen && address ? (
          <AddressConfirmationModal
            isOpen={isOpen}
            address={address}
            onConfirm={() => {
              setIsOpen(false);
              alert('Address confirmed!');
            }}
            onClose={() => setIsOpen(false)}
          />
        ) : null}
      </div>
    </AddressConfigProvider>
  );
}`}
        />
      </section>
    </div>
  );
}
