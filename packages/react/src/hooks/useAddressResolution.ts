import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import {
  isValidPostcodeFormat,
  normalizeNigerianAddress,
  AddressError,
  type NigerianAddress
} from '@ng-address/core';
import { useAddressConfig } from '../context/AddressConfigContext.js';
import { useLatest } from './useLatest.js';
import type {
  UseAddressResolutionOptions,
  UseAddressResolutionReturn,
  AddressResolutionStatus,
  AddressSuggestionItem
} from '../types/index.js';

/**
 * Hook for resolving Nigerian addresses via free-text search or NDAPS postcodes.
 * Adheres strictly to Vercel React Best Practices:
 * - `rerender-derived-state-no-effect`: Synchronously derives `isPostcode`.
 * - `async-cheap-condition-before-await`: Synchronously guards against empty queries.
 * - `advanced-use-latest`: Keeps options in ref to avoid breaking effect dependencies on every re-render.
 * - `rerender-use-deferred-value`: Defers background updates during rapid typing.
 */
export function useAddressResolution(
  options: UseAddressResolutionOptions = {}
): UseAddressResolutionReturn {
  const contextConfig = useAddressConfig();
  const optionsRef = useLatest({
    proxyUrl: options.proxyUrl ?? contextConfig.proxyUrl ?? '/api/address/resolve',
    headers: { ...contextConfig.headers, ...options.headers },
    debounceMs: options.debounceMs ?? contextConfig.debounceMs ?? 300,
    resolveAddress: options.resolveAddress ?? contextConfig.resolveAddress
  });

  const [query, setQuery] = useState<string>(options.initialQuery ?? '');
  const [status, setStatus] = useState<AddressResolutionStatus>('idle');
  const [address, setAddress] = useState<NigerianAddress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestionItem[]>([]);
  const [, startTransition] = useTransition();

  const abortControllerRef = useRef<AbortController | null>(null);
  const isPostcode = Boolean(query && isValidPostcodeFormat(query.trim()));

  const resolve = useCallback(
    async (overrideQuery?: string): Promise<NigerianAddress | null> => {
      const targetQuery = (overrideQuery ?? query).trim();
      
      // async-cheap-condition-before-await: immediate sync exit
      if (!targetQuery) {
        setStatus('idle');
        setAddress(null);
        setError(null);
        setSuggestions([]);
        return null;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStatus('loading');
      setError(null);

      const { proxyUrl, headers, resolveAddress: customResolve } = optionsRef.current;

      try {
        if (customResolve) {
          const resolved = await customResolve(targetQuery);
          if (controller.signal.aborted) return null;
          const normalized = normalizeNigerianAddress(resolved);
          startTransition(() => {
            setAddress(normalized);
            setStatus('resolved');
            setSuggestions([
              {
                id: normalized.postcode || targetQuery,
                title: normalized.raw || targetQuery,
                subtitle: `${normalized.administrative.lga ? normalized.administrative.lga + ', ' : ''}${normalized.administrative.state || ''}`,
                address: normalized,
                postcode: normalized.postcode
              }
            ]);
          });
          return normalized;
        }

        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify({ query: targetQuery }),
          signal: controller.signal
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new AddressError(
            body.message || `Address resolution failed with status ${response.status}`,
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

        startTransition(() => {
          setAddress(normalized);
          setStatus('resolved');
          const results: AddressSuggestionItem[] = Array.isArray(data.results)
            ? data.results
            : [
                {
                  id: normalized.postcode || targetQuery,
                  title: normalized.raw || targetQuery,
                  subtitle: `${normalized.administrative.lga ? normalized.administrative.lga + ', ' : ''}${normalized.administrative.state || ''}`,
                  address: normalized,
                  postcode: normalized.postcode
                }
              ];
          setSuggestions(results);
        });

        return normalized;
      } catch (err) {
        if (controller.signal.aborted) {
          return null;
        }
        const mappedError =
          err instanceof Error
            ? err
            : new AddressError('Unknown resolution error', { code: 'PROVIDER_ERROR' });
        startTransition(() => {
          setError(mappedError);
          setStatus('error');
          setSuggestions([]);
        });
        return null;
      }
    },
    [query, optionsRef]
  );

  useEffect(() => {
    if (!query.trim()) {
      setStatus('idle');
      setAddress(null);
      setError(null);
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      resolve();
    }, optionsRef.current.debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [query, resolve, optionsRef]);

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
    setQuery('');
    setStatus('idle');
    setAddress(null);
    setError(null);
    setSuggestions([]);
  }, []);

  return {
    query,
    setQuery,
    status,
    address,
    error,
    suggestions,
    isPostcode,
    resolve,
    reset
  };
}
