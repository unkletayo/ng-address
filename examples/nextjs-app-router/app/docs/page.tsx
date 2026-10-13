import React from 'react';
import Link from 'next/link';
import { CodeBlock } from '../components/code-block';
import { Callout } from '../components/callout';

export default function DocsOverviewPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">Documentation</span>
          <span className="badge badge-blue">Monorepo v0.1.0</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          Overview & Monorepo Architecture
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
          Standardized, open-source developer infrastructure and accessible UI components for Nigerian address capture, administrative taxonomy normalization, and NIPOST NDAPS digital postcode verification.
        </p>
      </div>

      <Callout type="tip" title="Quick Install">
        Install all core packages at once using your preferred package manager:
        <code style={{ display: 'block', marginTop: '8px', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
          pnpm add @ng-address/core @ng-address/nipost @ng-address/react
        </code>
      </Callout>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
          📦 Packages Breakdown
        </h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Package</th>
              <th>Description</th>
              <th>Version</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong style={{ color: '#10b981' }}>@ng-address/core</strong></td>
              <td>Canonical types, Zod schemas, 36 states + FCT / 774 LGAs dataset, offline normalization, and error hierarchy.</td>
              <td><code>0.1.0</code></td>
              <td><Link href="/docs/core">Core Docs →</Link></td>
            </tr>
            <tr>
              <td><strong style={{ color: '#10b981' }}>@ng-address/react</strong></td>
              <td>Accessible (<code>WCAG 2.2 AA</code>) React inputs, cascading state/LGA selectors, and confirmation modals.</td>
              <td><code>0.1.0</code></td>
              <td><Link href="/docs/react">React Docs →</Link></td>
            </tr>
            <tr>
              <td><strong style={{ color: '#10b981' }}>@ng-address/nipost</strong></td>
              <td>NIPOST NDAPS adapter with server credential isolation, exponential backoff, and error mapping.</td>
              <td><code>0.1.0</code></td>
              <td><Link href="/docs/nipost">NIPOST Docs →</Link></td>
            </tr>
            <tr>
              <td><strong style={{ color: '#10b981' }}>@ng-address/cli</strong></td>
              <td>Terminal developer CLI for postcode lookup, syntax validation, string normalization, and interactive wizard.</td>
              <td><code>0.1.0</code></td>
              <td><Link href="/docs/cli">CLI Docs →</Link></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
          🛡 Provenance Model
        </h2>
        <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>
          NG Address avoids fabricated certainty. Every resolved field contains a provenance tag tracing whether the data was typed by a user, verified by NIPOST, sourced from OpenStreetMap, or derived through deterministic normalization algorithms.
        </p>
        <CodeBlock
          filename="provenance-example.ts"
          code={`import { normalizeNigerianAddress } from '@ng-address/core';

const address = normalizeNigerianAddress('Plot 10 Admiralty Way, Lekki, Eti Osa, Lagos');

console.log(address.provenance);
// {
//   state: { source: 'derived', confidence: 0.95 },
//   lga: { source: 'derived', confidence: 0.95 },
//   street: { source: 'user', confidence: 0.8 },
//   raw: { source: 'user' }
// }`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
          🚀 Next Steps
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <Link href="/docs/quickstart" className="glass-panel" style={{ padding: '20px', textDecoration: 'none', color: 'inherit', display: 'block', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: '#10b981', fontSize: '18px', marginBottom: '8px' }}>⚡ Quickstart Guide</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Get running in under 5 minutes with offline normalization and React forms.</p>
          </Link>
          <Link href="/playground" className="glass-panel" style={{ padding: '20px', textDecoration: 'none', color: 'inherit', display: 'block', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '8px' }}>🎮 Live Playground</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Test address normalization and interactive React inputs in real time.</p>
          </Link>
          <Link href="/demo" className="glass-panel" style={{ padding: '20px', textDecoration: 'none', color: 'inherit', display: 'block', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: '#c084fc', fontSize: '18px', marginBottom: '8px' }}>🛒 Checkout Demo</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Experience a full production e-commerce address capture and modal confirmation.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
