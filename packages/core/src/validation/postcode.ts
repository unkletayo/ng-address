/**
 * Regular expressions for Nigerian postcode formats:
 * 1. Traditional 6-digit numeric postcode: e.g., "100001", "900001"
 * 2. NDAPS Digital alphanumeric postcode: 6 to 12 alphanumeric characters, e.g. "LA100001", "AB1029", "FC2001AB"
 */
const TRADITIONAL_POSTCODE_REGEX = /^[0-9]{6}$/;
const DIGITAL_POSTCODE_REGEX = /^[A-Z0-9]{6,12}$/i;

/**
 * Format validation options.
 */
export interface PostcodeValidationOptions {
  /** Only accept 6-digit traditional postcodes */
  traditionalOnly?: boolean;
  /** Only accept NDAPS digital alphanumeric postcodes */
  digitalOnly?: boolean;
}

/**
 * Validates the syntax of a Nigerian postcode string offline.
 * Note: Format validity confirms syntactic correctness, NOT entity existence.
 *
 * @param postcode - Raw postcode string to test
 * @param options - Validation constraint options
 * @returns boolean indicating whether the format is valid
 */
export function isValidPostcodeFormat(
  postcode: string | null | undefined,
  options: PostcodeValidationOptions = {}
): boolean {
  if (!postcode || typeof postcode !== "string") {
    return false;
  }

  const cleaned = postcode.trim().replace(/\s+/g, "").toUpperCase();
  if (cleaned.length === 0) {
    return false;
  }

  if (options.traditionalOnly) {
    return TRADITIONAL_POSTCODE_REGEX.test(cleaned);
  }

  if (options.digitalOnly) {
    return DIGITAL_POSTCODE_REGEX.test(cleaned);
  }

  // Accept either valid traditional numeric or digital alphanumeric
  return TRADITIONAL_POSTCODE_REGEX.test(cleaned) || DIGITAL_POSTCODE_REGEX.test(cleaned);
}

/**
 * Cleans and standardizes a postcode string.
 */
export function sanitizePostcode(postcode: string): string {
  return postcode.trim().replace(/\s+/g, "").toUpperCase();
}
