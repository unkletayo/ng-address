import { describe, it, expect, vi } from 'vitest';
import { lookupCommand } from '../src/commands/lookup.js';
import { ExitCode } from '../src/utils/exit.js';
import { NipostProvider } from '@ng-address/nipost';

vi.mock('@ng-address/nipost', () => {
  return {
    NipostProvider: vi.fn().mockImplementation(() => ({
      resolvePostcode: vi.fn().mockResolvedValue({
        status: 'EXACT',
        provider: 'nipost',
        address: {
          raw: 'Plot 10 Admiralty Way, Lekki Phase 1, Lagos',
          postcode: 'LA-10-A01-LK-02',
          administrative: {
            state: 'Lagos',
            stateCode: 'LA',
            lga: 'Eti Osa'
          },
          provider: {
            name: 'nipost'
          },
          verification: {
            status: 'EXACT'
          }
        }
      })
    }))
  };
});

describe('lookupCommand', () => {
  it('returns VALIDATION_ERROR when postcode format is invalid', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const code = await lookupCommand('INVALID-POSTCODE');
    expect(code).toBe(ExitCode.VALIDATION_ERROR);
    errorSpy.mockRestore();
  });

  it('returns SYSTEM_ERROR when API key is missing', async () => {
    const previous = process.env.NIPOST_API_KEY;
    delete process.env.NIPOST_API_KEY;

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const code = await lookupCommand('LA-10-A01-LK-02');
    expect(code).toBe(ExitCode.SYSTEM_ERROR);
    errorSpy.mockRestore();

    process.env.NIPOST_API_KEY = previous;
  });

  it('resolves postcode and outputs JSON when API key is provided', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await lookupCommand('LA-10-A01-LK-02', {
      apiKey: 'test_api_key_123',
      json: true
    });

    expect(code).toBe(ExitCode.SUCCESS);
    expect(logSpy).toHaveBeenCalled();
    const result = JSON.parse(logSpy.mock.calls[0][0]);
    expect(result.address.postcode).toBe('LA-10-A01-LK-02');
    expect(result.address.administrative.state).toBe('Lagos');
    logSpy.mockRestore();
  });
});
