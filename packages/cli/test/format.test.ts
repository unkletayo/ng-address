import { describe, it, expect } from 'vitest';
import { formatJson } from '../src/formatters/json.js';
import { formatAddressCard } from '../src/formatters/card.js';
import { resolveNipostApiKey, sanitizeApiKey } from '../src/utils/env.js';
import { ExitCode } from '../src/utils/exit.js';
import type { NigerianAddress } from '@ng-address/core';

describe('CLI Utilities & Formatters', () => {
  it('formats JSON with indentation and compact mode', () => {
    const data = { state: 'Lagos', code: 'LA' };
    const indented = formatJson(data);
    const compact = formatJson(data, true);

    expect(indented).toContain('\n  "state": "Lagos"');
    expect(compact).toBe('{"state":"Lagos","code":"LA"}');
  });

  it('formats address card with provenance and coordinates', () => {
    const address: NigerianAddress = {
      raw: 'Plot 10 Admiralty Way, Lekki Phase 1, Lagos',
      postcode: 'LA-10-A01-LK-02',
      administrative: {
        state: 'Lagos',
        stateCode: 'LA',
        lga: 'Eti Osa'
      },
      coordinates: {
        latitude: 6.4474,
        longitude: 3.4219,
        accuracyMeters: 5
      },
      provider: {
        name: 'nipost'
      },
      verification: {
        status: 'EXACT'
      }
    };

    const card = formatAddressCard(address);
    expect(card).toContain('Resolved Nigerian Address');
    expect(card).toContain('Plot 10 Admiralty Way, Lekki Phase 1, Lagos');
    expect(card).toContain('Lagos');
    expect(card).toContain('Eti Osa');
    expect(card).toContain('LA-10-A01-LK-02');
    expect(card).toContain('6.44740, 3.42190');
    expect(card).toContain('NIPOST');
  });

  it('resolves and sanitizes API keys correctly', () => {
    const previous = process.env.NIPOST_API_KEY;
    try {
      process.env.NIPOST_API_KEY = 'env_secret_key_12345';
      expect(resolveNipostApiKey()).toBe('env_secret_key_12345');
      expect(resolveNipostApiKey('cli_override_key_9999')).toBe('cli_override_key_9999');

      expect(sanitizeApiKey('short')).toBe('****');
      expect(sanitizeApiKey('nip_live_abcdef123456')).toBe('nip_...3456');
    } finally {
      process.env.NIPOST_API_KEY = previous;
    }
  });

  it('exports standard exit codes (0, 1, 2)', () => {
    expect(ExitCode.SUCCESS).toBe(0);
    expect(ExitCode.VALIDATION_ERROR).toBe(1);
    expect(ExitCode.SYSTEM_ERROR).toBe(2);
  });
});
