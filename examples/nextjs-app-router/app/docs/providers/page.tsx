import React from 'react';
import { CodeBlock } from '../../components/code-block';
import { Callout } from '../../components/callout';

export default function ProvidersDocsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">Extensibility</span>
          <span className="badge badge-blue">Custom Adapters</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          Custom Provider Implementation Guide
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
          How to implement custom address verification and geolocation providers that conform to the canonical <code>AddressProvider</code> contract.
        </p>
      </div>

      <Callout type="tip" title="Plug-and-play Compatibility">
        Any class implementing <code>AddressProvider</code> can be plugged directly into the NG Address verification pipeline.
      </Callout>

      <section style={{ marginTop: '36px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🔌 AddressProvider Interface
        </h2>
        <CodeBlock
          filename="types.ts"
          code={`import type {
  AddressResolution,
  NigerianAddress,
  AddressSuggestion
} from '@ng-address/core';

export interface AddressProvider {
  readonly name: string;
  readonly version: string;

  resolvePostcode(postcode: string): Promise<AddressResolution>;
  autocomplete?(query: string): Promise<AddressSuggestion[]>;
  reverseGeocode?(lat: number, lng: number): Promise<AddressResolution>;
}`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🛠 Example Custom Provider
        </h2>
        <CodeBlock
          filename="custom-osm-provider.ts"
          code={`import type { AddressProvider, AddressResolution } from '@ng-address/core';
import { normalizeNigerianAddress } from '@ng-address/core';

export class CustomOsmProvider implements AddressProvider {
  readonly name = 'custom-osm';
  readonly version = '1.0.0';

  async resolvePostcode(postcode: string): Promise<AddressResolution> {
    const raw = await fetch(\`https://nominatim.openstreetmap.org/search?postalcode=\${encodeURIComponent(postcode)}&country=ng&format=json\`);
    const data = await raw.json();

    const normalized = normalizeNigerianAddress(data[0]?.display_name || '');
    return {
      status: 'EXACT',
      address: normalized,
      provider: { name: this.name, version: this.version }
    };
  }
}`}
        />
      </section>
    </div>
  );
}
