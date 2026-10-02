import type { AddressErrorCode } from "../types/error.js";

export interface AddressErrorOptions {
  code: AddressErrorCode;
  message: string;
  isRetryable?: boolean;
  provider?: string;
  retryAfter?: number;
  cause?: unknown;
  details?: Record<string, unknown>;
}

/**
 * Standard error class for all Nigerian address operations.
 */
export class AddressError extends Error {
  readonly code: AddressErrorCode;
  readonly isRetryable: boolean;
  readonly provider?: string;
  readonly retryAfter?: number;
  readonly details?: Record<string, unknown>;

  constructor(options: AddressErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "AddressError";
    this.code = options.code;
    this.isRetryable = options.isRetryable ?? AddressError.isDefaultRetryable(options.code);
    this.provider = options.provider;
    this.retryAfter = options.retryAfter;
    this.details = options.details;

    // Restore prototype chain
    Object.setPrototypeOf(this, AddressError.prototype);
  }

  private static isDefaultRetryable(code: AddressErrorCode): boolean {
    switch (code) {
      case "PROVIDER_UNAVAILABLE":
      case "RATE_LIMITED":
      case "TIMEOUT":
        return true;
      case "INVALID_INPUT":
      case "INVALID_POSTCODE":
      case "NOT_FOUND":
      case "AUTHENTICATION_FAILED":
      case "PERMISSION_DENIED":
      case "PROVIDER_ERROR":
      case "UNSUPPORTED_OPERATION":
      default:
        return false;
    }
  }

  static invalidInput(message: string, details?: Record<string, unknown>): AddressError {
    return new AddressError({
      code: "INVALID_INPUT",
      message,
      isRetryable: false,
      details
    });
  }

  static invalidPostcode(postcode: string): AddressError {
    return new AddressError({
      code: "INVALID_POSTCODE",
      message: `Invalid Nigerian postcode format: "${postcode}"`,
      isRetryable: false,
      details: { postcode }
    });
  }

  static notFound(target: string, provider?: string): AddressError {
    return new AddressError({
      code: "NOT_FOUND",
      message: `Location not found: "${target}"`,
      isRetryable: false,
      provider,
      details: { target }
    });
  }

  static rateLimited(provider: string, retryAfterSeconds?: number): AddressError {
    return new AddressError({
      code: "RATE_LIMITED",
      message: `Rate limit exceeded for provider "${provider}"`,
      isRetryable: true,
      provider,
      retryAfter: retryAfterSeconds
    });
  }

  static timeout(operation: string, timeoutMs: number, provider?: string): AddressError {
    return new AddressError({
      code: "TIMEOUT",
      message: `Operation "${operation}" timed out after ${timeoutMs}ms`,
      isRetryable: true,
      provider,
      details: { operation, timeoutMs }
    });
  }

  static providerUnavailable(provider: string, reason?: string): AddressError {
    return new AddressError({
      code: "PROVIDER_UNAVAILABLE",
      message: `Address provider "${provider}" is currently unreachable: ${reason ?? "service unavailable"}`,
      isRetryable: true,
      provider,
      details: { reason }
    });
  }

  static authFailed(provider: string, message = "Provider authentication failed"): AddressError {
    return new AddressError({
      code: "AUTHENTICATION_FAILED",
      message: `${message} for "${provider}". Check API key / credentials.`,
      isRetryable: false,
      provider
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      isRetryable: this.isRetryable,
      provider: this.provider,
      retryAfter: this.retryAfter,
      details: this.details
    };
  }
}
