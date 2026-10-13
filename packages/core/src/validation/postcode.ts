/**
 * Regular expressions for Nigerian postcode formats:
 * 1. Traditional 6-digit numeric postcode: e.g., "100001", "900001"
 * 2. NDAPS Digital alphanumeric postcode: 6 to 12 alphanumeric characters, e.g. "LA100001", "AB1029", "FC2001AB"
 */
const TRADITIONAL_POSTCODE_REGEX = /^[0-9]{6}$/;
const DIGITAL_POSTCODE_REGEX = /^[A-Z]{2}[0-9A-Z]{4,10}$/i;
const NDAPS_SEGMENTS_REGEX = /^[A-Z]{2}[-\s]?[0-9]{2}[-\s]?[A-Z0-9]{3}[-\s]?[A-Z0-9]{2}[-\s]?[0-9]{2}$/i;

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

  const raw = postcode.trim();
  if (raw.length === 0) {
    return false;
  }

  const cleaned = raw.replace(/[-\s]+/g, "").toUpperCase();
  if (cleaned.length === 0) {
    return false;
  }

  const isTraditional = TRADITIONAL_POSTCODE_REGEX.test(cleaned);
  const isDigital = DIGITAL_POSTCODE_REGEX.test(cleaned) || NDAPS_SEGMENTS_REGEX.test(raw);

  if (options.traditionalOnly) {
    return isTraditional;
  }

  if (options.digitalOnly) {
    return isDigital;
  }

  // Accept either valid traditional numeric or digital alphanumeric
  return isTraditional || isDigital;
}

/**
 * Cleans and standardizes a postcode string.
 */
export function sanitizePostcode(postcode: string): string {
  return postcode.trim().replace(/\s+/g, "").toUpperCase();
}
