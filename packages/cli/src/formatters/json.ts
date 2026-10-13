/**
 * Formats data as formatted or compact JSON string.
 */
export function formatJson(data: unknown, compact = false): string {
  if (compact) {
    return JSON.stringify(data);
  }
  return JSON.stringify(data, null, 2);
}
