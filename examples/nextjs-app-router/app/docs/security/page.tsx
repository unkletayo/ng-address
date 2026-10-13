import React from 'react';
import { CodeBlock } from '../../components/code-block';
import { Callout } from '../../components/callout';

export default function SecurityDocsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">Security & Architecture</span>
          <span className="badge badge-purple">Zero Leakage</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          Security & Credential Isolation Architecture
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
          How NG Address protects private NIPOST credentials, prevents client bundle leakage, and implements secure API proxy forwarding.
        </p>
      </div>

      <Callout type="security" title="Core Security Rule">
        Client applications should never hold <code>NIPOST_API_KEY</code> or upstream vendor secrets. All browser communication routes through your backend proxy.
      </Callout>

      <section style={{ marginTop: '36px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🔒 Client-Side Guard
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          <code>@ng-address/nipost</code> inspects the runtime environment during instantiation. If executed in a browser window context, it immediately throws an error:
        </p>
        <CodeBlock
          filename="node_modules/@ng-address/nipost/src/provider.ts"
          code={`if (typeof window !== 'undefined' || typeof document !== 'undefined') {
  throw new SecurityError(
    'NipostProvider cannot be initialized in browser environments. Pass API requests through a backend server proxy.'
  );
}`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🛡 Recommended Backend Proxy Architecture
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Use the pattern below to sanitize client queries, validate postcodes before hitting upstream, and securely return normalized addresses:
        </p>
        <CodeBlock
          filename="app/api/address/lookup/route.ts"
          code={`import { NextResponse } from 'next/server';
import { NipostProvider } from '@ng-address/nipost';
import { isValidPostcodeFormat, AddressError } from '@ng-address/core';

const provider = new NipostProvider({
  apiKey: process.env.NIPOST_API_KEY
});

export async function POST(request: Request) {
  const { postcode } = await request.json();

  if (!isValidPostcodeFormat(postcode)) {
    return NextResponse.json({ success: false, error: 'Invalid postcode syntax' }, { status: 400 });
  }

  const result = await provider.resolvePostcode(postcode);
  return NextResponse.json({ success: true, data: result });
}`}
        />
      </section>
    </div>
  );
}
