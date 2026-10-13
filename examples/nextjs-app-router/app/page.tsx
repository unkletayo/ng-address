'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { normalizeNigerianAddress } from '@ng-address/core';
import { CodeBlock } from './components/code-block';

const tickerItems = [
  '36 states + FCT',
  '774 LGAs',
  'Offline normalization',
  'NIPOST NDAPS lookup',
  'Server-side API keys',
  'WCAG 2.2 AA components',
  'CLI included',
];

const packages = [
  {
    name: '@ng-address/core',
    tag: 'Core',
    href: '/docs/core',
    text: 'Address types, Zod validation, and the full state and LGA dataset. Normalizes free-text addresses without a network call.',
  },
  {
    name: '@ng-address/react',
    tag: 'UI',
    href: '/docs/react',
    text: 'Accessible address input, state and LGA selectors, and a confirmation step. Ships with hooks if you want your own markup.',
  },
  {
    name: '@ng-address/nipost',
    tag: 'NIPOST',
    href: '/docs/nipost',
    text: 'NIPOST NDAPS client for postcode lookup and reverse search. Keeps your API key on the server and retries on failure.',
  },
  {
    name: '@ng-address/cli',
    tag: 'CLI',
    href: '/docs/cli',
    text: 'Look up postcodes, validate and normalize addresses, and browse states and LGAs from your terminal.',
  },
];

export default function HomePage() {
  const [demoInput, setDemoInput] = useState('Plot 10 Admiralty Way, Lekki Phase 1, Eti Osa, Lagos');
  const [copiedInstall, setCopiedInstall] = useState(false);

  const demoResult = React.useMemo(() => {
    try {
      return normalizeNigerianAddress(demoInput);
    } catch {
      return null;
    }
  }, [demoInput]);

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText('pnpm add @ng-address/core @ng-address/nipost @ng-address/react');
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      setCopiedInstall(false);
    }
  };

  const ticker = [...tickerItems, ...tickerItems];

  return (
    <main>
      <div className="frame">
        <div className="cell-bar">
          <strong>NG Address v0.1.0</strong>
          <span>Open source</span>
        </div>

        {/* Hero */}
        <section style={{ padding: '72px 24px 56px' }}>
          <h1 className="display" style={{ maxWidth: '14ch' }}>
            Nigerian addresses, <em>readable</em> by software.
          </h1>
          <p className="lede" style={{ marginTop: 24 }}>
            Normalize free-text addresses offline across 36 states, the FCT and 774 LGAs. Verify postcodes with NIPOST from your server, and drop in accessible React form components.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
            <Link href="/docs/quickstart" className="btn btn-solid">
              Read quickstart
            </Link>
            <Link href="/playground" className="btn">
              Open playground
            </Link>
            <button type="button" className="btn" onClick={handleCopyInstall} aria-live="polite">
              {copiedInstall ? 'Copied' : 'pnpm add @ng-address/core'}
            </button>
          </div>
        </section>

        {/* Live normalizer */}
        <section className="section" aria-labelledby="normalizer-title">
          <div className="cell-bar">
            <strong id="normalizer-title">Try it: address normalizer</strong>
            <span>Runs in your browser</span>
          </div>
          <label htmlFor="demo-address" className="label" style={{ position: 'absolute', left: -9999 }}>
            Nigerian address
          </label>
          <input
            id="demo-address"
            type="text"
            className="field"
            value={demoInput}
            onChange={(e) => setDemoInput(e.target.value)}
            placeholder="Type any messy Nigerian address"
            autoComplete="off"
            spellCheck={false}
          />
          {demoResult ? (
            <div className="result-grid">
              <div className="result-cell">
                <span className="label">State</span>
                <span className="value">
                  {demoResult.administrative.state || 'Not found'}
                  {demoResult.administrative.stateCode ? ` (${demoResult.administrative.stateCode})` : ''}
                </span>
              </div>
              <div className="result-cell">
                <span className="label">LGA</span>
                <span className="value">{demoResult.administrative.lga || 'Not found'}</span>
              </div>
              <div className="result-cell">
                <span className="label">Street</span>
                <span className="value">
                  {demoResult.building?.number ? `${demoResult.building.number} ` : ''}
                  {demoResult.street || 'Not found'}
                </span>
              </div>
            </div>
          ) : (
            <p className="result-cell" style={{ color: 'var(--text-secondary)' }}>
              Could not read that address. Include a street and a state or LGA.
            </p>
          )}
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {ticker.map((item, i) => (
              <span key={`${item}-${i}`} className="marquee-item">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Packages */}
        <section aria-labelledby="packages-title">
          <div className="cell-bar">
            <strong>Packages</strong>
            <span>Use one or all four</span>
          </div>
          <div style={{ padding: '56px 24px 48px', borderBottom: '1px solid var(--border-color)' }}>
            <h2 id="packages-title" className="display" style={{ fontSize: 'clamp(30px, 4.6vw, 52px)', maxWidth: '18ch' }}>
              The parts you need, <em>nothing</em> you don&apos;t.
            </h2>
          </div>
          <div className="grid-2">
            {packages.map((pkg) => (
              <Link key={pkg.name} href={pkg.href} className="pkg">
                <div className="cell-bar">
                  <strong>{pkg.tag}</strong>
                  <span>Docs</span>
                </div>
                <div className="pkg-body">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quickstart */}
        <section aria-labelledby="quickstart-title">
          <div className="cell-bar">
            <strong>Quickstart</strong>
            <span>example.ts</span>
          </div>
          <div style={{ padding: '56px 24px 40px' }}>
            <h2 id="quickstart-title" className="display" style={{ fontSize: 'clamp(30px, 4.6vw, 52px)', maxWidth: '18ch' }}>
              From messy string to <em>structured</em> address.
            </h2>
            <p className="lede" style={{ marginTop: 16 }}>
              Pass in what a customer typed. Get back state, LGA and street, with the confidence of each match.
            </p>
          </div>
          <div style={{ padding: '0 24px 40px' }}>
            <CodeBlock
              filename="example.ts"
              code={`import { normalizeNigerianAddress, findNigerianState } from '@ng-address/core';

// 1. Normalize messy free-text input
const address = normalizeNigerianAddress(
  "Plot 10 Admiralty Way, Lekki Phase 1, Eti Osa, Lagos State"
);

console.log(address.administrative.state); // "Lagos"
console.log(address.administrative.lga);   // "Eti Osa"
console.log(address.provenance.state);     // { source: "derived", confidence: 0.95 }

// 2. Lookup state capital and geopolitical zone
const state = findNigerianState("Lagos");
console.log(state?.capital); // "Ikeja"
console.log(state?.geoZone); // "South West"`}
            />
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)' }}>
            <Link href="/docs" className="btn btn-solid" style={{ width: '100%', border: 0 }}>
              Browse the documentation
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
