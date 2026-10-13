import './setup.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import {
  AddressConfigProvider,
  useAddressConfig,
  useAddressResolution,
  usePostcodeLookup
} from '../src/index.js';

describe('AddressConfigContext', () => {
  it('provides default configuration', () => {
    const { result } = renderHook(() => useAddressConfig());
    expect(result.current.proxyUrl).toBe('/api/address/resolve');
    expect(result.current.debounceMs).toBe(300);
  });

  it('allows custom configuration via provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AddressConfigProvider
        config={{
          proxyUrl: '/custom/proxy/address',
          debounceMs: 150,
          headers: { 'X-Custom-Auth': 'secret-proxy-token' }
        }}
      >
        {children}
      </AddressConfigProvider>
    );

    const { result } = renderHook(() => useAddressConfig(), { wrapper });
    expect(result.current.proxyUrl).toBe('/custom/proxy/address');
    expect(result.current.debounceMs).toBe(150);
    expect(result.current.headers).toEqual({ 'X-Custom-Auth': 'secret-proxy-token' });
  });
});

describe('usePostcodeLookup', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('rejects invalid postcode format offline before network call (async-cheap-condition-before-await)', async () => {
    const { result } = renderHook(() => usePostcodeLookup());

    await act(async () => {
      const res = await result.current.lookup('INVALID-CODE-XYZ');
      expect(res).toBeNull();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error?.message).toContain('Invalid Nigerian postcode format');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('resolves valid NDAPS postcode via customLookup', async () => {
    const mockAddress = {
      raw: '12 Marina Road, Lagos Island, Lagos',
      postcode: 'LA-11-W06-TC-10',
      administrative: { state: 'Lagos', lga: 'Lagos Island' }
    };

    const mockLookup = vi.fn().mockResolvedValue(mockAddress);

    const { result } = renderHook(() =>
      usePostcodeLookup({ lookupPostcode: mockLookup })
    );

    await act(async () => {
      const res = await result.current.lookup('LA-11-W06-TC-10');
      expect(res).toBeDefined();
      expect(res?.postcode).toBe('LA-11-W06-TC-10');
      expect(res?.administrative.state).toBe('Lagos');
    });

    expect(result.current.status).toBe('resolved');
    expect(result.current.address?.postcode).toBe('LA-11-W06-TC-10');
    expect(mockLookup).toHaveBeenCalledWith('LA-11-W06-TC-10');
  });

  it('resolves valid traditional postcode via proxyUrl fetch', async () => {
    const mockApiResponse = {
      address: {
        raw: 'Broad Street, Lagos Island, Lagos',
        postcode: '100221',
        administrative: { state: 'Lagos', lga: 'Lagos Island' }
      }
    };

    (global.fetch as any) = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse
    });

    const { result } = renderHook(() =>
      usePostcodeLookup({ proxyUrl: '/api/test/resolve' })
    );

    await act(async () => {
      await result.current.lookup('100221');
    });

    expect(result.current.status).toBe('resolved');
    expect(result.current.address?.postcode).toBe('100221');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/test/resolve',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ postcode: '100221' })
      })
    );
  });
});

describe('useAddressResolution', () => {
  it('detects isPostcode correctly without effect synchronization (rerender-derived-state-no-effect)', () => {
    const { result, rerender } = renderHook(
      ({ q }) => useAddressResolution({ initialQuery: q, debounceMs: 500 }),
      { initialProps: { q: '12 Marina Road' } }
    );

    expect(result.current.isPostcode).toBe(false);

    rerender({ q: 'LA-11-W06-TC-10' });
    act(() => {
      result.current.setQuery('LA-11-W06-TC-10');
    });
    expect(result.current.isPostcode).toBe(true);
  });

  it('resolves address using customResolve handler with debouncing and stable callbacks', async () => {
    const mockResolve = vi.fn().mockImplementation(async (query: string) => ({
      raw: `${query}, Ikeja, Lagos`,
      administrative: { state: 'Lagos', lga: 'Ikeja' }
    }));

    const { result } = renderHook(() =>
      useAddressResolution({
        debounceMs: 50,
        resolveAddress: mockResolve
      })
    );

    act(() => {
      result.current.setQuery('Allen Avenue');
    });

    expect(result.current.query).toBe('Allen Avenue');

    await waitFor(
      () => {
        expect(result.current.status).toBe('resolved');
      },
      { timeout: 1000 }
    );

    expect(result.current.address?.raw).toBe('Allen Avenue, Ikeja, Lagos');
    expect(result.current.suggestions.length).toBeGreaterThan(0);
    expect(mockResolve).toHaveBeenCalledWith('Allen Avenue');
  });
});
