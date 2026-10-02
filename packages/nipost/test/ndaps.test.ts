import { describe, expect, it } from 'vitest';
import { formatNdapsPostcode, isValidNdapsPostcode, parseNdapsPostcode } from '../src/ndaps';

describe('NDAPS Postcode Validation and Parsing', () => {
  const officialPostcodes = [
    'AK-11-I61-ZF-12',
    'BA-02-M67-BL-69',
    'EB-13-G95-FR-90',
    'EN-05-V19-CD-22',
    'FC-03-B06-AG-12',
    'KN-31-F82-WJ-80',
    'LA-11-W06-TC-10',
    'OG-14-T18-BN-16'
  ];

  it('validates official NDAPS postcode formats', () => {
    for (const code of officialPostcodes) {
      expect(isValidNdapsPostcode(code)).toBe(true);
    }
  });

  it('accepts formatted, display, and compact representations', () => {
    expect(isValidNdapsPostcode('EK-01-A03-FK-01')).toBe(true);
    expect(isValidNdapsPostcode('EK 01 A03 FK 01')).toBe(true);
    expect(isValidNdapsPostcode('EK01A03FK01')).toBe(true);
    expect(isValidNdapsPostcode('ek-01-a03-fk-01')).toBe(true);
    expect(isValidNdapsPostcode('ek01a03fk01')).toBe(true);
  });

  it('rejects invalid NDAPS postcode strings', () => {
    expect(isValidNdapsPostcode('')).toBe(false);
    expect(isValidNdapsPostcode('100001')).toBe(false); // Legacy 6-digit is not NDAPS 5-segment
    expect(isValidNdapsPostcode('EK-00-A03-FK-01')).toBe(false); // 00 is forbidden for LGA
    expect(isValidNdapsPostcode('EK-01-A03-FK-00')).toBe(false); // 00 is forbidden for unit
    expect(isValidNdapsPostcode('E1-01-A03-FK-01')).toBe(false); // State must be 2 alpha
    expect(isValidNdapsPostcode('EK-01-A03-F1-01')).toBe(false); // Area must be 2 alpha
  });

  it('correctly parses valid NDAPS codes into 5 segments', () => {
    const parsed = parseNdapsPostcode('EK-01-A03-FK-01');
    expect(parsed).toEqual({
      state: 'EK',
      lga: '01',
      district: 'A03',
      area: 'FK',
      unit: '01'
    });
  });

  it('formats segments into formatted, display, and compact styles', () => {
    const segments = {
      state: 'EK',
      lga: '01',
      district: 'A03',
      area: 'FK',
      unit: '01'
    };

    expect(formatNdapsPostcode(segments, 'formatted')).toBe('EK-01-A03-FK-01');
    expect(formatNdapsPostcode(segments, 'display')).toBe('EK 01 A03 FK 01');
    expect(formatNdapsPostcode(segments, 'compact')).toBe('EK01A03FK01');
  });
});
