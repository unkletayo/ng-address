import type { NigerianAddress, VerificationStatus } from '@ng-address/core';

export type AddressResolutionStatus = 'idle' | 'loading' | 'resolved' | 'error';

export interface AddressResolutionResult {
  address: NigerianAddress;
  status: VerificationStatus;
  provider?: string;
}

export interface AddressConfig {
  /**
   * Endpoint URL for server-side address proxy resolution.
   * e.g., "/api/address/resolve"
   */
  proxyUrl?: string;
  /**
   * Additional HTTP headers to send with requests (e.g. auth tokens).
   */
  headers?: Record<string, string>;
  /**
   * Debounce delay in milliseconds for search queries (default: 300).
   */
  debounceMs?: number;
  /**
   * Custom resolution function overriding standard proxyUrl fetch.
   */
  resolveAddress?: (query: string) => Promise<NigerianAddress>;
  /**
   * Custom postcode lookup function overriding standard proxyUrl fetch.
   */
  lookupPostcode?: (postcode: string) => Promise<NigerianAddress>;
}

export interface UseAddressResolutionOptions extends AddressConfig {
  /** Initial query value */
  initialQuery?: string;
  /** Automatically resolve when query matches a valid digital postcode */
  autoResolvePostcode?: boolean;
}

export interface UseAddressResolutionReturn {
  query: string;
  setQuery: (query: string) => void;
  status: AddressResolutionStatus;
  address: NigerianAddress | null;
  error: Error | null;
  suggestions: AddressSuggestionItem[];
  isPostcode: boolean;
  resolve: (overrideQuery?: string) => Promise<NigerianAddress | null>;
  reset: () => void;
}

export interface AddressSuggestionItem {
  id: string;
  title: string;
  subtitle?: string;
  address?: NigerianAddress;
  postcode?: string;
}

export interface UsePostcodeLookupOptions extends AddressConfig {
  /** Execute lookup immediately upon mount if initialPostcode is provided */
  immediate?: boolean;
  /** Initial postcode to populate */
  initialPostcode?: string;
}

export interface UsePostcodeLookupReturn {
  postcode: string;
  setPostcode: (postcode: string) => void;
  status: AddressResolutionStatus;
  address: NigerianAddress | null;
  error: Error | null;
  lookup: (code?: string) => Promise<NigerianAddress | null>;
  reset: () => void;
}
