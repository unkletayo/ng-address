import { ProviderError } from '@ng-address/core';
import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveNipostConfig } from '../src/config';
import { NipostHttpClient } from '../src/http-client';

describe('NipostHttpClient (Axios)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('attaches X-API-Key header to outbound requests', async () => {
    const config = resolveNipostConfig({
      apiKey: 'nipost_test_myapikey123'
    });

    const client = new NipostHttpClient(config);

    // @ts-expect-error - spy on internal axios instance
    const requestSpy = vi.spyOn(client.client, 'request').mockResolvedValue({
      status: 200,
      data: { data: { status: 'ok' } }
    });

    const res = await client.get<{ data: { status: string } }>('/test');
    expect(res.data.status).toBe('ok');
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/test',
        method: 'GET',
        headers: expect.objectContaining({
          'X-API-Key': 'nipost_test_myapikey123'
        })
      })
    );
  });

  it('translates 401 response into ProviderError with PROVIDER_AUTH_ERROR code', async () => {
    const config = resolveNipostConfig({
      apiKey: 'invalid_key',
      maxRetries: 0
    });

    const client = new NipostHttpClient(config);

    // @ts-expect-error - spy on internal axios instance
    vi.spyOn(client.client, 'request').mockRejectedValue({
      isAxiosError: true,
      message: 'Request failed with status code 401',
      response: {
        status: 401,
        data: { error: { code: 'unauthorized', message: 'Invalid API key' } }
      }
    });

    await expect(client.get('/v1/lookup')).rejects.toMatchObject({
      code: 'AUTHENTICATION_FAILED',
      httpStatus: 401
    });
  });

  it('translates 429 response into ProviderError with PROVIDER_RATE_LIMITED code', async () => {
    const config = resolveNipostConfig({
      apiKey: 'test_key',
      maxRetries: 0
    });

    const client = new NipostHttpClient(config);

    // @ts-expect-error - spy on internal axios instance
    vi.spyOn(client.client, 'request').mockRejectedValue({
      isAxiosError: true,
      message: 'Request failed with status code 429',
      response: {
        status: 429,
        headers: {
          'x-ratelimit-limit': '600',
          'x-ratelimit-remaining': '0',
          'retry-after': '30'
        },
        data: { error: { code: 'rate_limited', message: 'Too many requests' } }
      }
    });

    await expect(client.get('/v1/lookup')).rejects.toMatchObject({
      code: 'RATE_LIMITED',
      httpStatus: 429,
      details: {
        rateLimit: 600,
        rateLimitRemaining: 0,
        retryAfterSeconds: 30
      }
    });
  });

  it('retries on 500 error and succeeds if next attempt succeeds', async () => {
    let callCount = 0;
    const config = resolveNipostConfig({
      apiKey: 'test_key',
      maxRetries: 2,
      retryDelayMs: 10
    });

    const client = new NipostHttpClient(config);

    // @ts-expect-error - spy on internal axios instance
    vi.spyOn(client.client, 'request').mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        throw {
          isAxiosError: true,
          message: 'Request failed with status code 500',
          response: {
            status: 500,
            data: { error: { message: 'Internal Gateway Error' } }
          }
        };
      }
      return {
        status: 200,
        data: { data: { success: true } }
      };
    });

    const res = await client.get<{ data: { success: boolean } }>('/v1/lookup');
    expect(res.data.success).toBe(true);
    expect(callCount).toBe(2);
  });
});
