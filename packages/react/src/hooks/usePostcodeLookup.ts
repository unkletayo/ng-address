import { useState, useEffect, useRef, useCallback } from 'react';
import {
  isValidPostcodeFormat,
  normalizeNigerianAddress,
  AddressError,
  type NigerianAddress
} from '@ng-address/core';
import { useAddressConfig } from '../context/AddressConfigContext.js';
import { useLatest } from './useLatest.js';
import type {
  UsePostcodeLookupOptions,
  UsePostcodeLookupReturn,
  AddressResolutionStatus
} from '../types/index.js';

/**
 * Hook for authoritative digital and traditional Nigerian postcode resolution.
 * Follows Vercel React Best Practices:
 * - `async-cheap-condition-before-await`: Synchronously validates postcode syntax offline first.
 * - `advanced-use-latest`: Retains dynamic props and handlers in stable refs.
 */
export function usePostcodeLookup(
  options: UsePostcodeLookupOptions = {}
): UsePostcodeLookupReturn {
  const contextConfig = useAddressConfig();
  const optionsRef = useLatest({
    proxyUrl: options.proxyUrl ?? contextConfig.proxyUrl ?? '/api/address/resolve',
    headers: { ...contextConfig.headers, ...options.headers },
    lookupPostcode: options.lookupPostcode ?? contextConfig.lookupPostcode
  });

  const [postcode, setPostcode] = useState<string>(options.initialPostcode ?? '');
  const [status, setStatus] = useState<AddressResolutionStatus>('idle');
  const [address, setAddress] = useState<NigerianAddress | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const lookup = useCallback(
    async (codeOverride?: string): Promise<NigerianAddress | null> => {
      const targetCode = (codeOverride ?? postcode).trim();
      
      // async-cheap-condition-before-await
      if (!targetCode) {
        setStatus('idle');
        setAddress(null);
        setError(null);
        return null;
      }

      // Offline syntax check before triggering network request
      if (!isValidPostcodeFormat(targetCode)) {
        const syntaxErr = new AddressError(`Invalid Nigerian postcode format: "${targetCode}"`, {
          code: 'INVALID_POSTCODE'
        });
        setError(syntaxErr);
        setStatus('error');
        return null;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus('loading');
      setError(null);

      const { proxyUrl, headers, lookupPostcode: customLookup } = optionsRef.current;

      try {
        if (customLookup) {
          const resolved = await customLookup(targetCode);
          if (controller.signal.aborted) return null;
          const normalized = normalizeNigerianAddress(resolved);
          setAddress(normalized);
          setStatus('resolved');
          return normalized;
        }

        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify({ postcode: targetCode }),
          signal: controller.signal
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new AddressError(
            body.message || `Postcode lookup failed with status ${response.status}`,
            {
              code: body.code || 'PROVIDER_ERROR',
              httpStatus: response.status
            }
          );
        }

        const data = await response.json();
        if (controller.signal.aborted) return null;

        const resolvedRaw = data.address || data;
        const normalized = normalizeNigerianAddress(resolvedRaw);
        setAddress(normalized);
        setStatus('resolved');
        return normalized;
      } catch (err) {
        if (controller.signal.aborted) return null;
        const mappedError =
          err instanceof Error
            ? err
            : new AddressError('Postcode resolution failed', { code: 'PROVIDER_ERROR' });
        setError(mappedError);
        setStatus('error');
        return null;
      }
    },
    [postcode, optionsRef]
  );

  useEffect(() => {
    if (options.immediate && options.initialPostcode) {
      lookup(options.initialPostcode);
    }
  }, [options.immediate, options.initialPostcode, lookup]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPostcode('');
    setStatus('idle');
    setAddress(null);
    setError(null);
  }, []);

  return {
    postcode,
    setPostcode,
    status,
    address,
    error,
    lookup,
    reset
  };
}
