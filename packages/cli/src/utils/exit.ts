import pc from 'picocolors';

export const ExitCode = {
  SUCCESS: 0,
  VALIDATION_ERROR: 1,
  SYSTEM_ERROR: 2
} as const;

export type ExitCodeValue = (typeof ExitCode)[keyof typeof ExitCode];

/**
 * Clean exit with success status code (0)
 */
export function exitSuccess(): never {
  process.exit(ExitCode.SUCCESS);
}

/**
 * Exit on validation or format errors (1)
 */
export function exitValidationError(message: string): never {
  console.error(pc.red(`✗ Validation Error: ${message}`));
  process.exit(ExitCode.VALIDATION_ERROR);
}

/**
 * Exit on system, auth, or network failures (2)
 */
export function exitSystemError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error(pc.red(`✗ System Error: ${message}`));
  process.exit(ExitCode.SYSTEM_ERROR);
}
