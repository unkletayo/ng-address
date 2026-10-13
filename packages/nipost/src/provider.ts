import {
  AddressError,
  normalizeNigerianAddress,
  type AddressInput,
  type AddressProvider,
  type AddressResolution,
  type AddressSearchQuery,
  type AddressSearchResult,
  type AddressValidation,
  type Coordinates,
  type ProviderCapabilities
} from '@ng-address/core';
import { resolveNipostConfig, type NipostConfig, type ResolvedNipostConfig } from './config.js';
import { NipostHttpClient } from './http-client.js';
import { formatNdapsPostcode, parseNdapsPostcode, type NdapsSegments } from './ndaps.js';
import {
  transformLookupResponse,
  transformReverseResponse,
  type NipostLookupData,
  type NipostReverseData
} from './transformer.js';

export interface NipostProviderOptions extends NipostConfig {}

export interface AutocompleteSuggestion {
  code: string;
  label: string;
}

export interface AutocompleteResult {
  segment: 'state' | 'lga' | 'district' | 'area' | 'unit';
  suggestions: AutocompleteSuggestion[];
}

/** A code with an optional full name. Districts and areas are code-only. */
export interface NamedCode {
  code: string;
  name?: string;
}

export interface ReverseGeocodeOptions {
  /** Search radius in metres. Server default is 25, hard ceiling is 250. */
  maxDistanceM?: number;
}

export interface NearbyOptions {
  /** Search radius in metres. Server default is 300. */
  radius?: number;
}

export class NipostProvider implements AddressProvider {
  readonly name = 'nipost';
  readonly capabilities: ProviderCapabilities = {
    search: true,
    postcodeLookup: true,
    reverseGeocode: true,
    validation: true
  };

  private readonly config: ResolvedNipostConfig;
  private readonly http: NipostHttpClient;

  constructor(options?: NipostProviderOptions) {
    this.config = resolveNipostConfig(options);
    this.http = new NipostHttpClient(this.config);
  }

  /**
   * Health check against NIPOST gateway endpoint (GET /healthz). The only unauthenticated endpoint.
   */
  async healthCheck(): Promise<{ ok: boolean; latencyMs: number }> {
    const start = Date.now();
    try {
      await this.http.get('/healthz', { skipAuth: true });
      return {
        ok: true,
        latencyMs: Date.now() - start
      };
    } catch {
      return {
        ok: false,
        latencyMs: Date.now() - start
      };
    }
  }

  /**
   * Resolves an NDAPS postcode to a canonical NigerianAddress (GET /v1/lookup).
   */
  async resolvePostcode(postcode: string): Promise<AddressResolution> {
    if (!postcode || typeof postcode !== 'string') {
      throw AddressError.invalidInput('Postcode cannot be empty');
    }

    const segments = parseNdapsPostcode(postcode);
    if (!segments) {
      throw AddressError.invalidPostcode(postcode);
    }

    const response = await this.http.get<{ data: NipostLookupData }>('/v1/lookup', {
      params: {
        code: formatNdapsPostcode(segments, 'formatted'),
        level: this.config.level
      }
    });

    const lookupData = response?.data;
    if (!lookupData || !lookupData.valid) {
      throw AddressError.notFound(postcode, 'nipost');
    }

    const address = transformLookupResponse(lookupData, postcode);

    return {
      address,
      status: address.verification?.status ?? 'EXACT',
      provider: this.name
    };
  }

  /**
   * Reverse geocodes coordinates to the nearest active NIPOST unit (GET /v1/search/reverse).
   */
  async reverseGeocode(
    coordinates: Coordinates,
    options?: ReverseGeocodeOptions
  ): Promise<AddressResolution> {
    const { latitude, longitude } = coordinates;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw AddressError.invalidInput('Valid latitude and longitude are required for reverse geocoding');
    }

    const response = await this.http.get<{ data: NipostReverseData }>('/v1/search/reverse', {
      params: {
        lat: latitude,
        lng: longitude,
        max_distance_m: options?.maxDistanceM
      }
    });

    const reverseData = response?.data;
    if (!reverseData || !reverseData.found) {
      throw AddressError.notFound(`Coordinates (${latitude}, ${longitude})`, 'nipost');
    }

    const address = transformReverseResponse(reverseData);
    if (!address) {
      throw AddressError.notFound(`Coordinates (${latitude}, ${longitude})`, 'nipost');
    }

    return {
      address,
      status: 'EXACT',
      provider: this.name
    };
  }

  /**
   * Units within a radius of a coordinate (GET /v1/search/nearby). Returns the raw gateway payload.
   */
  async nearby(coordinates: Coordinates, options?: NearbyOptions): Promise<unknown> {
    const { latitude, longitude } = coordinates;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw AddressError.invalidInput('Valid latitude and longitude are required for nearby search');
    }

    const res = await this.http.get<{ data: unknown }>('/v1/search/nearby', {
      params: { lat: latitude, lng: longitude, radius: options?.radius }
    });
    return res.data;
  }

  /**
   * Searches postcodes via segment-aware autocomplete. Upstream errors propagate.
   */
  async search(query: AddressSearchQuery): Promise<AddressSearchResult[]> {
    if (!query.query?.trim()) {
      return [];
    }

    const autocomplete = await this.autocomplete(query.query);
    const timestamp = new Date().toISOString();
    return autocomplete.suggestions.map((sugg) => ({
      id: sugg.code,
      title: sugg.label,
      subtitle: `${autocomplete.segment.toUpperCase()}: ${sugg.code}`,
      address: {
        raw: `${sugg.label} (${sugg.code})`,
        administrative: {},
        postcode: sugg.code,
        provenance: {
          raw: { source: 'nipost', retrievedAt: timestamp },
          postcode: { source: 'nipost', retrievedAt: timestamp }
        },
        verification: {
          status: 'PARTIAL',
          method: 'nipost_autocomplete',
          verifiedAt: timestamp
        }
      }
    }));
  }

  /**
   * Segment-aware autocomplete for partial postcode query (GET /v1/search/autocomplete).
   */
  async autocomplete(partialPostcode: string): Promise<AutocompleteResult> {
    const res = await this.http.get<{ data: AutocompleteResult }>('/v1/search/autocomplete', {
      params: { q: partialPostcode }
    });
    return res.data;
  }

  /**
   * Assembles 5 segments into a canonical postcode (POST /v1/assembly/assemble).
   */
  async assemble(segments: NdapsSegments): Promise<{ postcode: string; display: string; compact: string }> {
    const res = await this.http.post<{
      data: { postcode: string; display: string; compact: string };
    }>('/v1/assembly/assemble', segments);
    return res.data;
  }

  /**
   * Disassembles a postcode into 5 segments (GET /v1/assembly/disassemble).
   */
  async disassemble(code: string): Promise<NdapsSegments> {
    const res = await this.http.get<{ data: NdapsSegments }>('/v1/assembly/disassemble', {
      params: { code }
    });
    return res.data;
  }

  /**
   * All states with their 2-letter code (GET /v1/reference/states). Free.
   */
  async listStates(): Promise<NamedCode[]> {
    const res = await this.http.get<{ data: { states: NamedCode[] } }>('/v1/reference/states');
    return res.data.states;
  }

  /**
   * LGAs of a state (GET /v1/reference/lgas). Free.
   */
  async listLgas(state: string): Promise<NamedCode[]> {
    const res = await this.http.get<{ data: { lgas: NamedCode[] } }>('/v1/reference/lgas', {
      params: { state }
    });
    return res.data.lgas;
  }

  /**
   * District codes under a state and LGA (GET /v1/reference/districts). Free, code-only.
   */
  async listDistricts(state: string, lga: string): Promise<NamedCode[]> {
    const res = await this.http.get<{ data: { districts: NamedCode[] } }>('/v1/reference/districts', {
      params: { state, lga }
    });
    return res.data.districts;
  }

  /**
   * Area codes under a state, LGA and district (GET /v1/reference/areas). Free, code-only.
   */
  async listAreas(state: string, lga: string, district: string): Promise<NamedCode[]> {
    const res = await this.http.get<{ data: { areas: NamedCode[] } }>('/v1/reference/areas', {
      params: { state, lga, district }
    });
    return res.data.areas;
  }

  /**
   * Offline validation of address input.
   */
  async validate(address: AddressInput): Promise<AddressValidation> {
    const normalized = normalizeNigerianAddress(address);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!normalized.administrative.state) {
      errors.push('State could not be recognized as a valid Nigerian state or FCT.');
    }

    if (!normalized.street && !normalized.postcode) {
      warnings.push('Address lacks both street description and digital postcode.');
    }

    return {
      isValid: errors.length === 0,
      normalizedAddress: normalized,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
}
