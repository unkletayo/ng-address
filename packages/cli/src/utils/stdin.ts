const BYTES_PER_KB = 1024;
const MAX_STDIN_BYTES = 1024 * BYTES_PER_KB; // 1MB

/**
 * Reads all piped input from process.stdin.
 * Returns empty string if invoked in an interactive terminal (isTTY).
 */
export async function readStdin(): Promise<string> {
  if (process.stdin.isTTY || process.env.NODE_ENV === 'test' || process.env.VITEST) {
    return '';
  }

  return new Promise<string>((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (chunk) => {
      data += chunk;
      // Memory safety check (1MB max stdin buffer)
      if (data.length > MAX_STDIN_BYTES) {
        reject(new Error(`Piped input exceeds maximum allowed size (${MAX_STDIN_BYTES / (1024 * BYTES_PER_KB)}MB)`));
      }
    });

    process.stdin.on('end', () => {
      resolve(data.trim());
    });

    process.stdin.on('error', (err) => {
      reject(err);
    });
  });
}
