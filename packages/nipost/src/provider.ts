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
   * Health check against NIPOST gateway endpoint (GET /healthz).
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
   * Resolves an NDAPS or legacy postal code to a canonical NigerianAddress.
   */
  async resolvePostcode(postcode: string): Promise<AddressResolution> {
    if (!postcode || typeof postcode !== 'string') {
      throw AddressError.invalidInput('Postcode cannot be empty');
    }

    const cleanCode = postcode.replace(/[\s-]/g, '').toUpperCase();
    const level = this.config.level ?? 2;

    const response = await this.http.get<{ data: NipostLookupData }>(
      `/v1/lookup?code=${encodeURIComponent(cleanCode)}&level=${level}`
    );

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
   * Reverse geocodes coordinates to the nearest active NIPOST unit.
   */
  async reverseGeocode(coordinates: Coordinates): Promise<AddressResolution> {
    const { latitude, longitude } = coordinates;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw AddressError.invalidInput('Valid latitude and longitude are required for reverse geocoding');
    }

    const response = await this.http.get<{ data: NipostReverseData }>(
      `/v1/search/reverse?lat=${latitude}&lng=${longitude}&max_distance_m=250`
    );

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
   * Searches for addresses using nearby or autocomplete query.
   */
  async search(query: AddressSearchQuery): Promise<AddressSearchResult[]> {
    if (!query.query?.trim()) {
      return [];
    }

    try {
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
    } catch {
      return [];
    }
  }

  /**
   * Segment-aware autocomplete for partial postcode query (GET /v1/search/autocomplete).
   */
  async autocomplete(partialPostcode: string): Promise<AutocompleteResult> {
    const res = await this.http.get<{ data: AutocompleteResult }>(
      `/v1/search/autocomplete?q=${encodeURIComponent(partialPostcode)}`
    );
    return res.data;
  }

  /**
   * Assembles 5 segments into formatted postcode (POST /v1/assembly/assemble).
   */
  async assemble(segments: NdapsSegments): Promise<{ postcode: string; display: string; compact: string }> {
    try {
      const res = await this.http.post<{
        data: { postcode: string; display: string; compact: string };
      }>('/v1/assembly/assemble', segments, { skipAuth: true });
      return res.data;
    } catch {
      // Local fallback
      return {
        postcode: formatNdapsPostcode(segments, 'formatted'),
        display: formatNdapsPostcode(segments, 'display'),
        compact: formatNdapsPostcode(segments, 'compact')
      };
    }
  }

  /**
   * Disassembles a postcode into 5 segments (GET /v1/assembly/disassemble).
   */
  async disassemble(code: string): Promise<NdapsSegments> {
    try {
      const res = await this.http.get<{ data: NdapsSegments }>(
        `/v1/assembly/disassemble?code=${encodeURIComponent(code)}`,
        { skipAuth: true }
      );
      return res.data;
    } catch {
      const parsed = parseNdapsPostcode(code);
      if (!parsed) {
        throw AddressError.invalidPostcode(code);
      }
      return parsed;
    }
  }

  /**
   * Offline / hybrid validation of address input.
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
