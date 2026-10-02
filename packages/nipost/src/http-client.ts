import { ProviderError } from '@ng-address/core';
import axios, { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from 'axios';
import type { ResolvedNipostConfig } from './config.js';

export interface HttpClientRequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
}

export interface NipostErrorEnvelope {
  error?: {
    code?: string;
    message?: string;
  };
}

export class NipostHttpClient {
  private readonly config: ResolvedNipostConfig;
  private readonly client: AxiosInstance;

  constructor(config: ResolvedNipostConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl.replace(/\/$/, ''),
      timeout: config.timeoutMs,
      headers: {
        Accept: 'application/json'
      }
    });
  }

  async get<T>(path: string, options?: HttpClientRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, data?: unknown, options?: HttpClientRequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', data });
  }

  async request<T>(path: string, options?: HttpClientRequestOptions): Promise<T> {
    const maxRetries = this.config.maxRetries;
    const baseDelayMs = this.config.retryDelayMs;
    const timeoutMs = options?.timeout ?? this.config.timeoutMs;

    let lastError: unknown = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const headers: Record<string, string> = {
          ...(options?.headers as Record<string, string> | undefined)
        };

        if (this.config.apiKey && !options?.skipAuth && !headers['X-API-Key']) {
          headers['X-API-Key'] = this.config.apiKey;
        }

        const response = await this.client.request<T>({
          url: path,
          ...options,
          timeout: timeoutMs,
          headers
        });

        return response.data;
      } catch (err: unknown) {
        if (!isAxiosError(err)) {
          throw new ProviderError(
            `Unexpected error during NIPOST request: ${(err as Error)?.message || 'Unknown error'}`,
            {
              provider: 'nipost',
              code: 'PROVIDER_ERROR',
              cause: err
            }
          );
        }

        const status = err.response?.status;
        const responseData = err.response?.data as NipostErrorEnvelope | undefined;
        const upstreamMessage = responseData?.error?.message ?? err.message;
        const upstreamCode = responseData?.error?.code;

        // Check if error is retryable: 500, 502, 503, 504, or network timeout/ECONNABORTED
        const is5xx = status !== undefined && [500, 502, 503, 504].includes(status);
        const isNetworkOrTimeout = err.code === 'ECONNABORTED' || !status;

        if ((is5xx || isNetworkOrTimeout) && attempt < maxRetries) {
          lastError = err;
          await this.delay(attempt, baseDelayMs);
          continue;
        }

        // Handle specific status codes
        if (status) {
          this.handleErrorStatus(status, upstreamMessage, upstreamCode, err.response?.headers);
        }

        if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
          throw new ProviderError(`NIPOST request timed out after ${timeoutMs}ms`, {
            provider: 'nipost',
            code: 'TIMEOUT',
            cause: err
          });
        }

        throw new ProviderError(`NIPOST network error: ${err.message}`, {
          provider: 'nipost',
          code: 'PROVIDER_UNAVAILABLE',
          cause: err
        });
      }
    }

    if (lastError instanceof ProviderError) {
      throw lastError;
    }

    throw new ProviderError('Failed to execute NIPOST request after maximum retries', {
      provider: 'nipost',
      code: 'PROVIDER_UNAVAILABLE',
      cause: lastError
    });
  }

  private handleErrorStatus(
    status: number,
    message?: string,
    code?: string,
    headers?: Record<string, unknown>
  ): never {
    switch (status) {
      case 401:
        throw new ProviderError(message || 'Unauthorized: Missing or invalid NIPOST API key', {
          provider: 'nipost',
          httpStatus: 401,
          code: 'AUTHENTICATION_FAILED',
          details: { upstreamCode: code }
        });
      case 402:
        throw new ProviderError(
          message || 'Payment Required: Insufficient NIPOST lookup credits',
          {
            provider: 'nipost',
            httpStatus: 402,
            code: 'PROVIDER_ERROR',
            details: { upstreamCode: code }
          }
        );
      case 403:
        throw new ProviderError(
          message || 'Forbidden: API key lacks the required scope or access level',
          {
            provider: 'nipost',
            httpStatus: 403,
            code: 'PERMISSION_DENIED',
            details: { upstreamCode: code }
          }
        );
      case 429: {
        const limit = headers?.['x-ratelimit-limit'] as string | undefined;
        const remaining = headers?.['x-ratelimit-remaining'] as string | undefined;
        const retryAfter = headers?.['retry-after'] as string | undefined;
        throw new ProviderError(message || 'NIPOST API rate limit exceeded', {
          provider: 'nipost',
          httpStatus: 429,
          code: 'RATE_LIMITED',
          details: {
            upstreamCode: code,
            rateLimit: limit ? parseInt(limit, 10) : undefined,
            rateLimitRemaining: remaining ? parseInt(remaining, 10) : undefined,
            retryAfterSeconds: retryAfter ? parseInt(retryAfter, 10) : undefined
          }
        });
      }
      default:
        throw new ProviderError(message || `NIPOST upstream error: HTTP ${status}`, {
          provider: 'nipost',
          httpStatus: status,
          code: 'PROVIDER_ERROR',
          details: { upstreamCode: code }
        });
    }
  }

  private delay(attempt: number, baseDelayMs: number): Promise<void> {
    const jitter = Math.random() * 100;
    const exponential = Math.min(10000, baseDelayMs * 2 ** attempt + jitter);
    return new Promise((resolve) => setTimeout(resolve, exponential));
  }
}
