import type { NigerianAddress, Coordinates, AddressInput, VerificationStatus } from "./address.js";

/**
 * Declared capabilities for an address provider.
 */
export interface ProviderCapabilities {
  /** Supports free-text or structured search */
  search: boolean;
  /** Supports digital postcode resolution */
  postcodeLookup: boolean;
  /** Supports reverse geocoding from coordinates */
  reverseGeocode: boolean;
  /** Supports address validation and consistency checks */
  validation: boolean;
}

/**
 * Result returned from address resolution.
 */
export interface AddressResolution {
  address: NigerianAddress;
  status: VerificationStatus;
  provider: string;
  cached?: boolean;
}

/**
 * Search query criteria.
 */
export interface AddressSearchQuery {
  query: string;
  state?: string;
  lga?: string;
  limit?: number;
}

/**
 * Individual search result item.
 */
export interface AddressSearchResult {
  id: string;
  title: string;
  subtitle?: string;
  address: NigerianAddress;
  confidence?: number;
}

/**
 * Address validation diagnostic report.
 */
export interface AddressValidation {
  isValid: boolean;
  normalizedAddress: NigerianAddress;
  errors?: string[];
  warnings?: string[];
}

/**
 * Standard provider interface for all address service adapters.
 */
export interface AddressProvider {
  /** Unique provider identifier (e.g., "nipost", "osm", "mock") */
  readonly name: string;

  /** Capability flags for feature negotiation */
  readonly capabilities: ProviderCapabilities;

  /**
   * Resolve an authoritative digital postcode to an address.
   */
  resolvePostcode(postcode: string): Promise<AddressResolution>;

  /**
   * Search for locations matching a free-text or structured query.
   */
  search?(query: AddressSearchQuery): Promise<AddressSearchResult[]>;

  /**
   * Reverse geocode coordinates to a Nigerian address.
   */
  reverseGeocode?(coordinates: Coordinates): Promise<AddressResolution>;

  /**
   * Validate an address against provider data rules.
   */
  validate?(address: AddressInput): Promise<AddressValidation>;
}
