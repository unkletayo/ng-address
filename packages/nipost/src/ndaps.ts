export interface NdapsSegments {
  state: string;
  lga: string;
  district: string;
  area: string;
  unit: string;
}

const NDAPS_CLEAN_REGEX = /^[A-Za-z]{2}[0-9]{2}[A-Za-z0-9]{3}[A-Za-z]{2}[0-9]{2}$/;

/**
 * Checks if a string conforms to the NDAPS 5-segment postcode syntax.
 * Tolerant of whitespace, hyphens, and casing (e.g. "EK-01-A03-FK-01", "EK 01 A03 FK 01", "ek01a03fk01").
 */
export function isValidNdapsPostcode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }
  const clean = code.replace(/[\s-]/g, '').toUpperCase();
  if (!NDAPS_CLEAN_REGEX.test(clean)) {
    return false;
  }

  const lgaNum = parseInt(clean.slice(2, 4), 10);
  const unitNum = parseInt(clean.slice(9, 11), 10);

  // Numeric segments range 01-99 (never 00)
  if (lgaNum < 1 || unitNum < 1) {
    return false;
  }

  return true;
}

/**
 * Parses an NDAPS postcode string into 5 structured segments.
 * Returns null if the code does not conform to the NDAPS specification.
 */
export function parseNdapsPostcode(code: string): NdapsSegments | null {
  if (!isValidNdapsPostcode(code)) {
    return null;
  }

  const clean = code.replace(/[\s-]/g, '').toUpperCase();

  return {
    state: clean.slice(0, 2),
    lga: clean.slice(2, 4),
    district: clean.slice(4, 7),
    area: clean.slice(7, 9),
    unit: clean.slice(9, 11)
  };
}

/**
 * Formats 5 NDAPS segments into formatted ('AA-99-H77-BB-55'), display ('AA 99 H77 BB 55'), or compact ('AA99H77BB55') style.
 */
export function formatNdapsPostcode(
  segments: NdapsSegments,
  style: 'formatted' | 'display' | 'compact' = 'formatted'
): string {
  const state = segments.state.toUpperCase().padStart(2, 'A').slice(0, 2);
  const lga = segments.lga.padStart(2, '0').slice(0, 2);
  const district = segments.district.toUpperCase().padStart(3, '0').slice(0, 3);
  const area = segments.area.toUpperCase().padStart(2, 'A').slice(0, 2);
  const unit = segments.unit.padStart(2, '0').slice(0, 2);

  if (style === 'display') {
    return `${state} ${lga} ${district} ${area} ${unit}`;
  }
  if (style === 'compact') {
    return `${state}${lga}${district}${area}${unit}`;
  }
  return `${state}-${lga}-${district}-${area}-${unit}`;
}
