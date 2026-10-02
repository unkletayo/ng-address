import { ConfigurationError } from '@ng-address/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveNipostConfig } from '../src/config';

describe('NipostConfig & Client-Side Guard', () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    // Restore window
    if (originalWindow !== undefined) {
      globalThis.window = originalWindow;
    } else {
      // @ts-expect-error - cleanup mock window
      delete globalThis.window;
    }
  });

  it('resolves valid default configuration', () => {
    const config = resolveNipostConfig({
      apiKey: 'nipost_test_12345'
    });

    expect(config.baseUrl).toBe('https://api.postcode.gov.ng');
    expect(config.level).toBe(2);
    expect(config.timeoutMs).toBe(5000);
    expect(config.maxRetries).toBe(3);
    expect(config.retryDelayMs).toBe(500);
  });

  it('allows publishable keys in simulated browser runtime', () => {
    // @ts-expect-error - simulate browser
    globalThis.window = {};

    const config = resolveNipostConfig({
      apiKey: 'nipost_pk_live_abcd1234'
    });

    expect(config.apiKey).toBe('nipost_pk_live_abcd1234');
  });

  it('blocks secret keys in browser runtime by throwing ConfigurationError', () => {
    // @ts-expect-error - simulate browser
    globalThis.window = {};

    expect(() => {
      resolveNipostConfig({
        apiKey: 'nipost_live_secretkey123'
      });
    }).toThrow(ConfigurationError);

    expect(() => {
      resolveNipostConfig({
        apiKey: 'nipost_test_secretkey123'
      });
    }).toThrow(ConfigurationError);
  });

  it('allows secret key if allowClientUsage is explicitly enabled', () => {
    // @ts-expect-error - simulate browser
    globalThis.window = {};

    const config = resolveNipostConfig({
      apiKey: 'nipost_test_secretkey123',
      allowClientUsage: true
    });

    expect(config.apiKey).toBe('nipost_test_secretkey123');
  });
});
