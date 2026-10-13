/**
 * Resolves NIPOST API credentials from CLI options or environment variables.
 * Priority: CLI --api-key flag > NIPOST_API_KEY environment variable.
 */
export function resolveNipostApiKey(cliKey?: string): string | undefined {
  const key = cliKey?.trim() || process.env.NIPOST_API_KEY?.trim();
  return key || undefined;
}

const MIN_KEY_LENGTH_FOR_PARTIAL_MASK = 8;
const UNMASKED_EDGE_LENGTH = 4;
const FULLY_MASKED_KEY = '****';

/**
 * Sanitizes an API key for safe debugging output (e.g. `nip_live_****1234`).
 */
export function sanitizeApiKey(key: string): string {
  if (key.length <= MIN_KEY_LENGTH_FOR_PARTIAL_MASK) {
    return FULLY_MASKED_KEY;
  }
  return `${key.slice(0, UNMASKED_EDGE_LENGTH)}...${key.slice(-UNMASKED_EDGE_LENGTH)}`;
}
