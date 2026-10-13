import React from 'react';
import { CodeBlock } from '../../components/code-block';

export default function CliDocsPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">CLI</span>
          <span className="badge badge-blue">Developer Tooling</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          @ng-address/cli
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6 }}>
          Command-line interface for terminal-based address normalization, syntax verification, administrative state/LGA inspection, and interactive guided address resolution.
        </p>
      </div>

      <section style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          📥 Global / Local Usage
        </h2>
        <CodeBlock
          filename="Terminal"
          language="bash"
          code={`# Run directly via npx / pnpm dlx
pnpm dlx @ng-address/cli --help

# Or install globally
npm install -g @ng-address/cli`}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
          🛠 Available Commands
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#10b981', marginBottom: '8px' }}>
              1. <code>ng-address normalize &lt;address-string&gt;</code>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
              Deterministically formats a raw address string, extracts state and LGA, and outputs formatted JSON or card tables.
            </p>
            <CodeBlock
              filename="Terminal"
              language="bash"
              code={`ng-address normalize "Plot 4, Admiralty Way, Lekki, Eti Osa, Lagos" --json`}
            />
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#38bdf8', marginBottom: '8px' }}>
              2. <code>ng-address lgas &lt;state-name&gt;</code>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
              Lists all verified Local Government Areas for any of the 36 Nigerian states or FCT.
            </p>
            <CodeBlock
              filename="Terminal"
              language="bash"
              code={`ng-address lgas Lagos`}
            />
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#c084fc', marginBottom: '8px' }}>
              3. <code>ng-address validate &lt;postcode&gt;</code>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
              Validates digital postcode syntax or 6-digit legacy NIPOST postal codes offline.
            </p>
            <CodeBlock
              filename="Terminal"
              language="bash"
              code={`ng-address validate LA-10-A01-LK-02`}
            />
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#f59e0b', marginBottom: '8px' }}>
              4. <code>ng-address interactive</code>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
              Launches an interactive step-by-step terminal wizard for building and validating Nigerian addresses.
            </p>
            <CodeBlock
              filename="Terminal"
              language="bash"
              code={`ng-address interactive`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
