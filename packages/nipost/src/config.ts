import { ConfigurationError } from '@ng-address/core';
import { z } from 'zod';

export const NipostConfigSchema = z.object({
  apiKey: z.string().optional(),
  baseUrl: z.string().url().default('https://api.postcode.gov.ng'),
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).default(1),
  timeoutMs: z.number().positive().default(5000),
  maxRetries: z.number().int().nonnegative().default(3),
  retryDelayMs: z.number().positive().default(500),
  allowClientUsage: z.boolean().default(false)
});

export type NipostConfig = z.input<typeof NipostConfigSchema>;
export type ResolvedNipostConfig = z.infer<typeof NipostConfigSchema>;

export function resolveNipostConfig(rawConfig?: NipostConfig): ResolvedNipostConfig {
  const parsed = NipostConfigSchema.safeParse(rawConfig ?? {});
  if (!parsed.success) {
    throw new ConfigurationError(`Invalid NIPOST provider configuration: ${parsed.error.message}`, {
      details: parsed.error.format()
    });
  }

  const config = parsed.data;

  // Runtime environment check to prevent exposing secret keys in browser bundles
  const isBrowser = typeof globalThis !== 'undefined' && 'window' in globalThis;
  if (isBrowser && !config.allowClientUsage) {
    const isSecretKey = config.apiKey && (
      config.apiKey.startsWith('nipost_live_') ||
      config.apiKey.startsWith('nipost_test_') ||
      !config.apiKey.startsWith('nipost_pk_')
    );

    if (isSecretKey) {
      throw new ConfigurationError(
        "NIPOST secret API key detected in browser runtime. Secret keys must remain server-side. Use a backend proxy or a publishable key ('nipost_pk_...').",
        { code: 'INVALID_INPUT' }
      );
    }
  }

  return config;
}
