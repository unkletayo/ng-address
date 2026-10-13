'use client';

import React, { useState } from 'react';
import {
  AddressConfigProvider,
  NigerianAddressInput,
  StateLgaSelect,
  AddressConfirmationCard
} from '@ng-address/react';
import {
  normalizeNigerianAddress,
  isValidPostcodeFormat,
  findNigerianState,
  type NigerianAddress
} from '@ng-address/core';

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<'normalize' | 'components' | 'postcode'>('normalize');

  // Normalizer state
  const [rawInput, setRawInput] = useState('Plot 10, Admiralty Way, Lekki Phase 1, Eti Osa, Lagos');
  const normalized = React.useMemo(() => {
    try {
      return normalizeNigerianAddress(rawInput);
    } catch {
      return null;
    }
  }, [rawInput]);

  // Component sandbox state
  const [componentAddress, setComponentAddress] = useState<NigerianAddress | null>(normalized);
  const [selectedState, setSelectedState] = useState('Lagos');
  const [selectedLga, setSelectedLga] = useState('Eti Osa');

  // Postcode test state
  const [postcodeTest, setPostcodeTest] = useState('LA-10-A01-LK-02');
  const isPostcodeValid = isValidPostcodeFormat(postcodeTest);

  const presets = [
    { label: 'Lekki Phase 1, Lagos', value: 'Plot 10 Admiralty Way, Lekki Phase 1, Eti Osa, Lagos' },
    { label: 'Garki 2, Abuja (FCT)', value: 'Suite 404, Plot 12 Aguiyi Ironsi St, Garki 2, Abuja, FCT' },
    { label: 'GRA Phase 2, Port Harcourt', value: '14 Tombia Street, GRA Phase 2, Port Harcourt, Rivers State' },
    { label: 'Nasarawa, Kano', value: 'No 5 Bompai Road, Nasarawa, Kano State' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge">Interactive Sandbox</span>
          <span className="badge badge-blue">Zero Latency</span>
        </div>
        <h1 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>
          Live Address & SDK Playground
        </h1>
        <p style={{ fontSize: '17px', color: '#94a3b8', maxWidth: '680px', margin: '0 auto' }}>
          Experiment with deterministic offline normalization, test React UI components, and validate Nigerian digital postcodes live.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '32px'
      }}>
        {[
          { id: 'normalize', label: '✨ Address Normalizer' },
          { id: 'components', label: '🧩 React Components Sandbox' },
          { id: 'postcode', label: '📮 NDAPS Postcode Validator' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
              background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? '#34d399' : '#cbd5e1',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Normalizer */}
      {activeTab === 'normalize' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#f8fafc' }}>
              Input Address
            </h3>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: '#030712',
                color: '#f8fafc',
                fontSize: '15px',
                fontFamily: 'var(--font-sans)',
                resize: 'vertical',
                outline: 'none',
                marginBottom: '16px'
              }}
            />

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
                QUICK PRESETS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setRawInput(p.value)}
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {normalized && (
              <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '13px', color: '#34d399', fontWeight: 600, marginBottom: '6px' }}>
                  ✓ Formatted Address Output:
                </div>
                <div style={{ fontSize: '16px', color: '#f8fafc', fontWeight: 500 }}>
                  {normalized.formatted}
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>
                Normalized JSON Object
              </h3>
              <span className="badge badge-purple">NigerianAddress</span>
            </div>
            <pre style={{
              background: '#030712',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #1e293b',
              overflowX: 'auto',
              fontSize: '13px',
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              maxHeight: '400px'
            }}>
              <code>{JSON.stringify(normalized, null, 2)}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: Components */}
      {activeTab === 'components' && (
        <AddressConfigProvider config={{ proxyUrl: '/api/address/lookup' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
                Live Input & Cascading Select
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                    &lt;NigerianAddressInput /&gt;
                  </label>
                  <NigerianAddressInput
                    placeholder="Type Nigerian address (e.g., Admiralty Way, Lekki)..."
                    onSelect={(resolved) => {
                      setComponentAddress(resolved);
                      if (resolved.administrative?.state) setSelectedState(resolved.administrative.state);
                      if (resolved.administrative?.lga) setSelectedLga(resolved.administrative.lga);
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                    &lt;StateLgaSelect /&gt; (Cascading 36 States + 774 LGAs)
                  </label>
                  <StateLgaSelect
                    selectedState={selectedState}
                    selectedLga={selectedLga}
                    onChange={({ state, lga }) => {
                      setSelectedState(state);
                      setSelectedLga(lga);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
                &lt;AddressConfirmationCard /&gt;
              </h3>
              {componentAddress ? (
                <AddressConfirmationCard
                  address={componentAddress}
                  onConfirm={() => alert('Address confirmed!')}
                  onEdit={() => alert('Edit clicked')}
                />
              ) : (
                <div style={{ color: '#94a3b8', padding: '30px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                  Select or type an address in the form to render the confirmation card.
                </div>
              )}
            </div>
          </div>
        </AddressConfigProvider>
      )}

      {/* TAB 3: Postcode */}
      {activeTab === 'postcode' && (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#f8fafc' }}>
              Test Digital Postcode Syntax
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>
              Validates NIPOST NDAPS digital format (e.g., <code>LA-10-A01-LK-02</code>) or traditional 6-digit postal codes (e.g., <code>100001</code>).
            </p>

            <input
              type="text"
              value={postcodeTest}
              onChange={(e) => setPostcodeTest(e.target.value)}
              placeholder="e.g. LA-10-A01-LK-02 or 105102"
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '8px',
                border: `1px solid ${isPostcodeValid ? '#10b981' : '#ef4444'}`,
                background: '#030712',
                color: '#f8fafc',
                fontSize: '16px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                marginBottom: '16px'
              }}
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderRadius: '8px',
              background: isPostcodeValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isPostcodeValid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <span style={{ fontWeight: 600, color: isPostcodeValid ? '#34d399' : '#f87171' }}>
                {isPostcodeValid ? '✓ Valid Postcode Syntax' : '✗ Invalid Postcode Syntax'}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                <code>isValidPostcodeFormat()</code>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
