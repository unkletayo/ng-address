import { AddressError } from '@ng-address/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NipostProvider } from '../src/provider';

describe('NipostProvider Integration & Unit Tests', () => {
  let provider: NipostProvider;

  beforeEach(() => {
    provider = new NipostProvider({
      apiKey: 'nipost_test_dummy_key',
      maxRetries: 0
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('healthCheck', () => {
    it('returns ok: true when GET /healthz succeeds', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockResolvedValue({});

      const result = await provider.healthCheck();
      expect(result.ok).toBe(true);
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it('returns ok: false when health endpoint fails', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockRejectedValue(new Error('Gateway down'));

      const result = await provider.healthCheck();
      expect(result.ok).toBe(false);
    });
  });

  describe('resolvePostcode', () => {
    it('resolves official Lagos test postcode (LA-11-W06-TC-10)', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockResolvedValue({
        data: {
          postcode: 'LA-11-W06-TC-10',
          valid: true,
          administrative_address: {
            state_name: 'LAGOS',
            lga_name: 'IKEJA',
            locality_name: 'IKEJA',
            zone: 'SOUTH WEST'
          },
          recent_house_address: {
            recent: '12 OBA AKRAN AVENUE, IKEJA'
          },
          building_use_status: 'commercial'
        }
      });

      const resolution = await provider.resolvePostcode('LA-11-W06-TC-10');

      expect(resolution.provider).toBe('nipost');
      expect(resolution.status).toBe('EXACT');
      expect(resolution.address.administrative.state).toBe('Lagos');
      expect(resolution.address.administrative.stateCode).toBe('LA');
      expect(resolution.address.administrative.lga).toBe('Ikeja');
      expect(resolution.address.street).toBe('12 OBA AKRAN AVENUE, IKEJA');
      expect(resolution.address.postcode).toBe('LA-11-W06-TC-10');
      expect(resolution.address.provenance?.raw?.source).toBe('nipost');
      expect(resolution.address.building?.name).toBe('commercial');
    });

    it('resolves official Abuja FCT test postcode (FC-03-B06-AG-12)', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockResolvedValue({
        data: {
          postcode: 'FC-03-B06-AG-12',
          valid: true,
          administrative_address: {
            state_name: 'FEDERAL CAPITAL TERRITORY',
            lga_name: 'MUNICIPAL AREA COUNCIL',
            locality_name: 'GARKI',
            zone: 'NORTH CENTRAL'
          },
          recent_house_address: {
            recent: 'PLOT 450 TAFANAWA BALEWA WAY, AREA 11, GARKI'
          }
        }
      });

      const resolution = await provider.resolvePostcode('FC-03-B06-AG-12');

      expect(resolution.address.administrative.state).toBe('Federal Capital Territory');
      expect(resolution.address.administrative.stateCode).toBe('FC');
      expect(resolution.address.administrative.lga).toBe('Municipal Area Council');
    });

    it('throws AddressError with NOT_FOUND when postcode is not found', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockResolvedValue({
        data: {
          postcode: 'ZZ-99-Z99-ZZ-99',
          valid: false
        }
      });

      await expect(provider.resolvePostcode('ZZ-99-Z99-ZZ-99')).rejects.toMatchObject({
        code: 'NOT_FOUND'
      });
    });
  });

  describe('reverseGeocode', () => {
    it('resolves coordinates to nearest active postcode unit', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockResolvedValue({
        data: {
          found: true,
          coordinate: [3.3792, 6.5244],
          unit: {
            postcode: 'LA-11-W06-TC-10',
            display: 'LA 11 W06 TC 10',
            distance_m: 8.5,
            confidence: 'high',
            state_name: 'LAGOS',
            lga_name: 'IKEJA',
            locality_name: 'IKEJA',
            address: '12 OBA AKRAN AVENUE'
          },
          area: 'LA-11-W06-TC',
          district: 'LA-11-W06',
          state: 'LA'
        }
      });

      const resolution = await provider.reverseGeocode({
        latitude: 6.5244,
        longitude: 3.3792
      });

      expect(resolution.address.postcode).toBe('LA-11-W06-TC-10');
      expect(resolution.address.administrative.state).toBe('Lagos');
      expect(resolution.address.coordinates?.latitude).toBe(6.5244);
      expect(resolution.address.coordinates?.longitude).toBe(3.3792);
      expect(resolution.address.provenance?.raw?.source).toBe('nipost');
    });

    it('throws AddressError when no unit is found within radius', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockResolvedValue({
        data: {
          found: false,
          message: 'No active postcode found within search radius'
        }
      });

      await expect(
        provider.reverseGeocode({ latitude: 12.0, longitude: 8.0 })
      ).rejects.toMatchObject({
        code: 'NOT_FOUND'
      });
    });
  });

  describe('autocomplete & search', () => {
    it('returns suggestions for partial postcode query', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockResolvedValue({
        data: {
          segment: 'lga',
          suggestions: [
            { code: '01', label: 'Ado-Ekiti' },
            { code: '02', label: 'Efon' }
          ]
        }
      });

      const results = await provider.search({ query: 'EK ' });
      expect(results.length).toBe(2);
      expect(results[0].title).toBe('Ado-Ekiti');
      expect(results[0].address.postcode).toBe('01');
    });
  });

  describe('assembly & disassembly', () => {
    it('assembles segments into canonical representations', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'post').mockResolvedValue({
        data: {
          postcode: 'EK-01-A03-FK-01',
          display: 'EK 01 A03 FK 01',
          compact: 'EK01A03FK01'
        }
      });

      const assembled = await provider.assemble({
        state: 'EK',
        lga: '01',
        district: 'A03',
        area: 'FK',
        unit: '01'
      });

      expect(assembled.postcode).toBe('EK-01-A03-FK-01');
      expect(assembled.display).toBe('EK 01 A03 FK 01');
      expect(assembled.compact).toBe('EK01A03FK01');
    });

    it('disassembles postcode into 5 segments', async () => {
      // @ts-expect-error - spy on internal http client
      vi.spyOn(provider.http, 'get').mockResolvedValue({
        data: {
          state: 'EK',
          lga: '01',
          district: 'A03',
          area: 'FK',
          unit: '01'
        }
      });

      const segments = await provider.disassemble('EK-01-A03-FK-01');
      expect(segments).toEqual({
        state: 'EK',
        lga: '01',
        district: 'A03',
        area: 'FK',
        unit: '01'
      });
    });
  });

  describe('validate', () => {
    it('validates and normalizes structured address inputs', async () => {
      const validation = await provider.validate({
        raw: '23 Marina Street, Lagos Island, Lagos State',
        administrative: {
          state: 'lagos',
          lga: 'lagos island'
        }
      });

      expect(validation.isValid).toBe(true);
      expect(validation.normalizedAddress.administrative.state).toBe('Lagos');
      expect(validation.normalizedAddress.administrative.lga).toBe('Lagos Island');
    });
  });
});
