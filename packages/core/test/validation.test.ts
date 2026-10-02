import { describe, it, expect } from "vitest";
import { isValidPostcodeFormat, sanitizePostcode } from "../src/index.js";

describe("isValidPostcodeFormat", () => {
  it("should validate traditional 6-digit numeric postcodes", () => {
    expect(isValidPostcodeFormat("100001")).toBe(true);
    expect(isValidPostcodeFormat("900001")).toBe(true);
    expect(isValidPostcodeFormat("200256")).toBe(true);
  });

  it("should validate digital alphanumeric postcodes", () => {
    expect(isValidPostcodeFormat("LA100001")).toBe(true);
    expect(isValidPostcodeFormat("FC2001AB")).toBe(true);
    expect(isValidPostcodeFormat("AB123456")).toBe(true);
  });

  it("should reject invalid postcode formats", () => {
    expect(isValidPostcodeFormat("123")).toBe(false); // Too short
    expect(isValidPostcodeFormat("123456789012345")).toBe(false); // Too long
    expect(isValidPostcodeFormat("LA@100")).toBe(false); // Invalid special characters
    expect(isValidPostcodeFormat("")).toBe(false);
    expect(isValidPostcodeFormat(null as unknown as string)).toBe(false);
    expect(isValidPostcodeFormat(undefined as unknown as string)).toBe(false);
  });

  it("should respect options constraints", () => {
    expect(isValidPostcodeFormat("100001", { traditionalOnly: true })).toBe(true);
    expect(isValidPostcodeFormat("LA100001", { traditionalOnly: true })).toBe(false);
  });
});

describe("sanitizePostcode", () => {
  it("should trim and uppercase postcode input", () => {
    expect(sanitizePostcode("  la100001  ")).toBe("LA100001");
    expect(sanitizePostcode(" 900 001 ")).toBe("900001");
  });
});
