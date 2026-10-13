'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AddressConfigProvider,
  NigerianAddressInput,
  StateLgaSelect,
  AddressConfirmationCard,
  AddressConfirmationModal
} from '@ng-address/react';
import type { NigerianAddress } from '@ng-address/core';

export default function CheckoutPage() {
  const [address, setAddress] = useState<NigerianAddress | null>(null);
  const [selectedState, setSelectedState] = useState<string>('Lagos');
  const [selectedLga, setSelectedLga] = useState<string>('Eti Osa');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddressSelect = (resolvedAddress: NigerianAddress) => {
    setAddress(resolvedAddress);
    if (resolvedAddress.administrative?.state) {
      setSelectedState(resolvedAddress.administrative.state);
    }
    if (resolvedAddress.administrative?.lga) {
      setSelectedLga(resolvedAddress.administrative.lga);
    }
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    setSubmitted(true);
  };

  return (
    <AddressConfigProvider
      config={{
        proxyUrl: '/api/address/lookup'
      }}
    >
      <main style={{ maxWidth: '640px', margin: '40px auto 80px', padding: '0 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/docs" style={{ fontSize: '13px', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            ← Back to Documentation
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px', color: '#ffffff' }}>
            🛒 Checkout Delivery Form
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>
            Reference e-commerce implementation using <code>@ng-address/react</code> components with live confirmation flow.
          </p>
        </div>

        {submitted && address ? (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#34d399', marginBottom: '8px' }}>
              Order Placed Successfully!
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
              Your order will be delivered to the verified Nigerian address below:
            </p>
            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <AddressConfirmationCard address={address} />
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setAddress(null);
              }}
              style={{
                padding: '12px 24px',
                background: '#10b981',
                color: '#09261a',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Start New Order
            </button>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <form onSubmit={(e) => { e.preventDefault(); if (address) setIsModalOpen(true); }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Chukwudi Okafor"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#030712',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
                  Delivery Address & Postcode
                </label>
                <NigerianAddressInput
                  placeholder="e.g. 10 Admiralty Way, Lekki or LA-10-A01-LK-02"
                  onSelect={handleAddressSelect}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
                  Administrative State & LGA
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

              <button
                type="submit"
                disabled={!address}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  background: address ? '#10b981' : '#1e293b',
                  color: address ? '#09261a' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: address ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease'
                }}
              >
                Proceed to Confirmation
              </button>
            </form>
          </div>
        )}

        {isModalOpen && address ? (
          <AddressConfirmationModal
            isOpen={isModalOpen}
            address={address}
            onConfirm={handleConfirm}
            onClose={() => setIsModalOpen(false)}
          />
        ) : null}
      </main>
    </AddressConfigProvider>
  );
}
