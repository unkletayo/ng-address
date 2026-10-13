import React from 'react';
import { CodeBlock } from '../../components/code-block';
import { Callout } from '../../components/callout';

export default function ReactDocsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">Package</span>
          <span className="badge badge-blue">WCAG 2.2 AA</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          @ng-address/react
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
          Accessible React component suite featuring keyboard-navigable inputs, cascading state/LGA pickers, confirmation modals with focus trapping, and headless resolution hooks.
        </p>
      </div>

      <section style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          📥 Installation & Styles
        </h2>
        <CodeBlock
          filename="Terminal"
          language="bash"
          code={`pnpm add @ng-address/react @ng-address/core`}
        />
        <p style={{ color: '#94a3b8', margin: '12px 0' }}>
          Import the stylesheet in your root layout or entry component:
        </p>
        <CodeBlock
          filename="app/layout.tsx"
          code={`import '@ng-address/react/styles.css';`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🎛 AddressConfigProvider
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Supplies global configuration, backend proxy endpoints, and provider hooks across your component tree:
        </p>
        <CodeBlock
          filename="provider.tsx"
          code={`import { AddressConfigProvider } from '@ng-address/react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AddressConfigProvider
      config={{
        proxyUrl: '/api/address/lookup',
        debounceMs: 300,
        enableOfflineFallback: true
      }}
    >
      {children}
    </AddressConfigProvider>
  );
}`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🧩 NigerianAddressInput
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Smart input component supporting dual-mode entry: free-text address normalization and digital NDAPS postcode search.
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>onSelect</code></td>
              <td><code>(address: NigerianAddress) =&gt; void</code></td>
              <td>—</td>
              <td>Triggered when a valid address is selected.</td>
            </tr>
            <tr>
              <td><code>placeholder</code></td>
              <td><code>string</code></td>
              <td><code>"Enter address or NDAPS postcode..."</code></td>
              <td>Input placeholder text.</td>
            </tr>
            <tr>
              <td><code>showPostcodeSwitch</code></td>
              <td><code>boolean</code></td>
              <td><code>true</code></td>
              <td>Toggles mode switch badge in input.</td>
            </tr>
            <tr>
              <td><code>className</code></td>
              <td><code>string</code></td>
              <td><code>""</code></td>
              <td>Custom CSS container class.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          📍 StateLgaSelect
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Accessible cascading dropdown pair that synchronizes 36 States + FCT with their corresponding 774 LGAs:
        </p>
        <CodeBlock
          filename="state-lga-select.tsx"
          code={`import { StateLgaSelect } from '@ng-address/react';

export function LocationForm() {
  const [state, setState] = useState('Lagos');
  const [lga, setLga] = useState('Ikeja');

  return (
    <StateLgaSelect
      selectedState={state}
      selectedLga={lga}
      onChange={({ state, lga }) => {
        setState(state);
        setLga(lga);
      }}
    />
  );
}`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🪟 AddressConfirmationModal
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          WCAG 2.2 AA compliant confirmation dialog with focus trapping, ESC key dismissal, body scroll locking, and provenance badges:
        </p>
        <CodeBlock
          filename="modal.tsx"
          code={`import { AddressConfirmationModal } from '@ng-address/react';

<AddressConfirmationModal
  isOpen={isModalOpen}
  address={resolvedAddress}
  onConfirm={(confirmedAddr) => handleSubmit(confirmedAddr)}
  onClose={() => setIsModalOpen(false)}
/>`}
        />
      </section>
    </div>
  );
}
