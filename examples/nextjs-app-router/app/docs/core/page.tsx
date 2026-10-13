import React from 'react';
import { CodeBlock } from '../../components/code-block';
import { Callout } from '../../components/callout';

export default function CoreDocsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">Package</span>
          <span className="badge badge-purple">TypeScript & Zod</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          @ng-address/core
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
          Canonical TypeScript domain models, Zod validation schemas, administrative taxonomy for 36 states + FCT / 774 LGAs, offline normalization, and error hierarchy.
        </p>
      </div>

      <section style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          📥 Installation
        </h2>
        <CodeBlock
          filename="Terminal"
          language="bash"
          code={`pnpm add @ng-address/core`}
        />
      </section>

      <section style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🏛 36 States & 774 LGAs Administrative Taxonomy
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Access official ISO codes, geopolitical zones, state capitals, and full lists of verified Local Government Areas:
        </p>
        <CodeBlock
          filename="states-example.ts"
          code={`import {
  NIGERIAN_STATES,
  findNigerianState,
  getLgasForState,
  isValidState,
  isValidLga
} from '@ng-address/core';

// Get all 36 States + FCT
console.log(NIGERIAN_STATES.length); // 37

// Find state by name or code
const kano = findNigerianState('KN');
console.log(kano?.name);      // "Kano"
console.log(kano?.capital);   // "Kano"
console.log(kano?.geoZone);   // "North West"

// Get all 44 LGAs in Kano
const kanoLgas = getLgasForState('Kano');
console.log(kanoLgas.length); // 44

// Validate state and LGA
console.log(isValidState('Lagos'));            // true
console.log(isValidLga('Lagos', 'Eti Osa'));   // true
console.log(isValidLga('Lagos', 'Dala'));      // false (Dala is in Kano)`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          ✨ Offline Deterministic Normalization
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Extracts and standardizes building numbers, streets, LGAs, states, postcodes, and provenance metadata without network latency:
        </p>
        <CodeBlock
          filename="normalize.ts"
          code={`import { normalizeNigerianAddress } from '@ng-address/core';

const normalized = normalizeNigerianAddress(
  "block 2, flat 4, bishop aboyade cole st, victoria island, eti-osa, lagos state"
);

console.log(normalized.formatted);
// "Block 2, Flat 4 Bishop Aboyade Cole St, Victoria Island, Eti Osa, Lagos"

console.log(normalized.administrative);
// { state: 'Lagos', stateCode: 'LA', lga: 'Eti Osa' }`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🏷 Provenance & Confidence (In Simple Terms)
        </h2>
        <p style={{ color: '#cbd5e1', marginBottom: '12px', lineHeight: 1.7 }}>
          <strong>Provenance</strong> answers: <em>&quot;Where did this piece of address information come from?&quot;</em><br />
          <strong>Confidence</strong> answers: <em>&quot;How sure are we that it is correct?&quot; (from 0% to 100%)</em>
        </p>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Instead of pretending an address is 100% verified when someone just typed it in, every part of the address has a label:
        </p>
        <ul style={{ paddingLeft: '20px', color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
          <li><code style={{ color: '#38bdf8' }}>user</code>: Typed directly by the customer in your form.</li>
          <li><code style={{ color: '#34d399' }}>nipost</code>: Officially verified by Nigeria Post (NIPOST NDAPS database).</li>
          <li><code style={{ color: '#fbbf24' }}>osm</code>: Looked up from OpenStreetMap map coordinates.</li>
          <li><code style={{ color: '#c084fc' }}>derived</code>: Matched automatically (e.g., if you pick &quot;Ikeja&quot;, we know it belongs to &quot;Lagos&quot;).</li>
        </ul>
        <CodeBlock
          filename="types.ts"
          code={`export type FieldSource = 'user' | 'nipost' | 'osm' | 'derived';

export interface FieldProvenance {
  source: FieldSource;
  confidence?: number; // 0.0 to 1.0
  verifiedAt?: string; // ISO 8601
}

export interface AddressProvenance {
  state?: FieldProvenance;
  lga?: FieldProvenance;
  street?: FieldProvenance;
  building?: FieldProvenance;
  postcode?: FieldProvenance;
  coordinates?: FieldProvenance;
  raw: FieldProvenance;
}`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          ⚠️ AddressError Hierarchy
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
          Typed error classes make upstream handling robust and descriptive:
        </p>
        <CodeBlock
          filename="errors.ts"
          code={`import {
  AddressError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  NetworkError,
  AuthenticationError
} from '@ng-address/core';

try {
  // lookup or validation logic
} catch (err) {
  if (err instanceof NotFoundError) {
    console.error('Address not found in NDAPS:', err.message);
  } else if (err instanceof RateLimitError) {
    console.error('Rate limited. Retry after:', err.retryAfterSeconds);
  }
}`}
        />
      </section>
    </div>
  );
}
