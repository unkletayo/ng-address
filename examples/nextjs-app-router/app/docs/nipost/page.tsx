import React from 'react';
import { CodeBlock } from '../../components/code-block';
import { Callout } from '../../components/callout';

export default function NipostDocsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">Package</span>
          <span className="badge badge-purple">NIPOST NDAPS</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          @ng-address/nipost
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
          Authoritative NIPOST NDAPS (National Digital Addressing & Postcode System) provider adapter with server credential isolation, exponential backoff with jitter, and error mapping.
        </p>
      </div>

      <section style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          📥 Installation
        </h2>
        <CodeBlock
          filename="Terminal"
          language="bash"
          code={`pnpm add @ng-address/nipost @ng-address/core`}
        />
      </section>

      <Callout type="security" title="Server-Only Credential Isolation">
        The <code>NipostProvider</code> includes an automated runtime guard that prevents initialization inside client browser environments, guaranteeing your secret NIPOST API credentials are never leaked.
      </Callout>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🚀 Basic Usage
        </h2>
        <CodeBlock
          filename="server-service.ts"
          code={`import { NipostProvider } from '@ng-address/nipost';

const provider = new NipostProvider({
  apiKey: process.env.NIPOST_API_KEY!,
  baseUrl: process.env.NIPOST_API_URL, // optional override
  timeout: 5000,                       // 5s timeout
  maxRetries: 3                        // retry on 5xx / network errors
});

// Resolve valid digital postcode
const result = await provider.resolvePostcode('LA-10-A01-LK-02');

console.log(result.status);                  // "EXACT" | "APPROXIMATE"
console.log(result.address.administrative);  // { state: 'Lagos', lga: 'Eti Osa' }
console.log(result.address.coordinates);     // { latitude: 6.4474, longitude: 3.4731 }
console.log(result.address.provenance.raw);  // { source: 'nipost' }`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          ⚡ Resilient Retry Architecture
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Upstream network glitches and HTTP 5xx responses automatically trigger exponential backoff with randomized jitter to prevent thundering herds:
        </p>
        <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: 1.8 }}>
          <li><strong>400 Bad Request:</strong> Throws <code>ValidationError</code> (no retry).</li>
          <li><strong>401 / 403:</strong> Throws <code>AuthenticationError</code> (no retry).</li>
          <li><strong>404 Not Found:</strong> Throws <code>NotFoundError</code> (no retry).</li>
          <li><strong>429 Rate Limit:</strong> Throws <code>RateLimitError</code> with <code>retryAfterSeconds</code>.</li>
          <li><strong>500 / 503 / Network Timeout:</strong> Automatically retried with exponential backoff.</li>
        </ul>
      </section>
    </div>
  );
}
