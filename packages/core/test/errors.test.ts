import { describe, it, expect } from "vitest";
import { AddressError } from "../src/index.js";

describe("AddressError", () => {
  it("should create structured error with correct properties and default retryability", () => {
    const error = AddressError.rateLimited("nipost", 30);
    expect(error.name).toBe("AddressError");
    expect(error.code).toBe("RATE_LIMITED");
    expect(error.isRetryable).toBe(true);
    expect(error.provider).toBe("nipost");
    expect(error.retryAfter).toBe(30);
  });

  it("should mark invalidInput and invalidPostcode as non-retryable", () => {
    const error = AddressError.invalidPostcode("INVALID_CODE");
    expect(error.code).toBe("INVALID_POSTCODE");
    expect(error.isRetryable).toBe(false);
  });

  it("should serialize to JSON cleanly", () => {
    const error = AddressError.timeout("resolvePostcode", 5000, "nipost");
    const json = error.toJSON();
    expect(json.code).toBe("TIMEOUT");
    expect(json.isRetryable).toBe(true);
    expect(json.provider).toBe("nipost");
  });
});
