import type { AddressErrorCode } from "../types/error.js";

export interface AddressErrorOptions {
  code: AddressErrorCode;
  message?: string;
  isRetryable?: boolean;
  provider?: string;
  httpStatus?: number;
  retryAfter?: number;
  cause?: unknown;
  details?: Record<string, unknown>;
}

/**
 * Standard base error class for all Nigerian address operations.
 */
export class AddressError extends Error {
  readonly code: AddressErrorCode;
  readonly isRetryable: boolean;
  readonly provider?: string;
  readonly httpStatus?: number;
  readonly retryAfter?: number;
  readonly details?: Record<string, unknown>;

  constructor(messageOrOptions: string | AddressErrorOptions, options?: Partial<AddressErrorOptions>) {
    const opts: AddressErrorOptions =
      typeof messageOrOptions === "string"
        ? { message: messageOrOptions, code: options?.code ?? "INVALID_INPUT", ...options }
        : messageOrOptions;

    super(opts.message ?? "Address operation error", { cause: opts.cause });
    this.name = this.constructor.name;
    this.code = opts.code;
    this.isRetryable = opts.isRetryable ?? AddressError.isDefaultRetryable(opts.code);
    this.provider = opts.provider;
    this.httpStatus = opts.httpStatus;
    this.retryAfter = opts.retryAfter;
    this.details = opts.details;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
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
      httpStatus: this.httpStatus,
      retryAfter: this.retryAfter,
      details: this.details
    };
  }
}

export class ConfigurationError extends AddressError {
  constructor(message: string, options?: Partial<AddressErrorOptions>) {
    super(message, { code: "INVALID_INPUT", ...options });
    this.name = "ConfigurationError";
  }
}

export class ProviderError extends AddressError {
  constructor(message: string, options?: Partial<AddressErrorOptions>) {
    super(message, { code: "PROVIDER_ERROR", ...options });
    this.name = "ProviderError";
  }
}

export class InvalidStateError extends AddressError {
  constructor(state: string, options?: Partial<AddressErrorOptions>) {
    super(`Invalid Nigerian state: "${state}"`, {
      code: "INVALID_INPUT",
      details: { state },
      ...options
    });
    this.name = "InvalidStateError";
  }
}

export class InvalidLgaError extends AddressError {
  constructor(lga: string, state?: string, options?: Partial<AddressErrorOptions>) {
    super(
      state
        ? `Invalid Local Government Area (LGA) "${lga}" in state "${state}"`
        : `Invalid Local Government Area (LGA): "${lga}"`,
      {
        code: "INVALID_INPUT",
        details: { lga, state },
        ...options
      }
    );
    this.name = "InvalidLgaError";
  }
}

export class InvalidPostcodeError extends AddressError {
  constructor(postcode: string, options?: Partial<AddressErrorOptions>) {
    super(`Invalid Nigerian postcode format: "${postcode}"`, {
      code: "INVALID_POSTCODE",
      details: { postcode },
      ...options
    });
    this.name = "InvalidPostcodeError";
  }
}
