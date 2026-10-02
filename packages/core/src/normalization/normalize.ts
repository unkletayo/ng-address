import type { NigerianAddress, AddressInput } from "../types/address.js";
import type { AddressProvenance } from "../types/provenance.js";
import { findNigerianState, findMatchingLga } from "./nigerian-states.js";
import { sanitizePostcode, isValidPostcodeFormat } from "../validation/postcode.js";

/**
 * Standardize text string: trim whitespace, collapse internal spaces.
 */
function cleanText(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Deterministically normalizes a Nigerian address or free-text input without data loss.
 *
 * @param input - Unstructured string or partial NigerianAddress object
 * @returns Standardized NigerianAddress with canonical state, matched LGA, and stamped provenance
 */
export function normalizeNigerianAddress(input: AddressInput): NigerianAddress {
  const timestamp = new Date().toISOString();
  const provenance: AddressProvenance = {};

  if (typeof input === "string") {
    const rawClean = cleanText(input) ?? "";
    const rawTokens = rawClean.split(/[,;\n]/).map((t) => t.trim()).filter(Boolean);

    let stateName: string | undefined;
    let stateCode: string | undefined;
    let matchedLga: string | undefined;
    let foundPostcode: string | undefined;

    // Scan tokens from end towards beginning for State / LGA / Postcode
    for (const token of [...rawTokens].reverse()) {
      if (!foundPostcode && isValidPostcodeFormat(token)) {
        foundPostcode = sanitizePostcode(token);
        continue;
      }

      if (!stateName) {
        const stateMatch = findNigerianState(token);
        if (stateMatch) {
          stateName = stateMatch.name;
          stateCode = stateMatch.code;
          continue;
        }
      }

      if (!matchedLga && stateName) {
        const stateMatch = findNigerianState(stateName);
        const lgaMatch = findMatchingLga(token, stateMatch);
        if (lgaMatch) {
          matchedLga = lgaMatch;
        }
      }
    }

    provenance.raw = { source: "user", retrievedAt: timestamp };
    if (stateName) provenance.state = { source: "derived", retrievedAt: timestamp };
    if (matchedLga) provenance.lga = { source: "derived", retrievedAt: timestamp };
    if (foundPostcode) provenance.postcode = { source: "derived", retrievedAt: timestamp };

    return {
      raw: rawClean,
      administrative: {
        state: stateName,
        stateCode: stateCode,
        lga: matchedLga
      },
      postcode: foundPostcode,
      provenance,
      verification: {
        status: stateName ? "PARTIAL" : "UNRESOLVED"
      }
    };
  }

  // Handle structured object input
  const stateMatch = input.administrative?.state
    ? findNigerianState(input.administrative.state)
    : undefined;

  const canonicalState = stateMatch?.name ?? cleanText(input.administrative?.state);
  const stateCode = stateMatch?.code ?? cleanText(input.administrative?.stateCode);
  const matchedLga = input.administrative?.lga
    ? (stateMatch ? findMatchingLga(input.administrative.lga, stateMatch) : undefined) ?? cleanText(input.administrative?.lga)
    : undefined;

  const cleanedPostcode = input.postcode ? sanitizePostcode(input.postcode) : undefined;

  const initialProvenance: AddressProvenance = { ...(input.provenance ?? {}) };

  if (canonicalState && !initialProvenance.state) {
    initialProvenance.state = { source: stateMatch ? "derived" : "user", retrievedAt: timestamp };
  }
  if (matchedLga && !initialProvenance.lga) {
    initialProvenance.lga = { source: "derived", retrievedAt: timestamp };
  }
  if (cleanedPostcode && !initialProvenance.postcode) {
    initialProvenance.postcode = { source: "user", retrievedAt: timestamp };
  }

  return {
    raw: cleanText(input.raw),
    building: input.building ? {
      number: cleanText(input.building.number),
      name: cleanText(input.building.name),
      unit: cleanText(input.building.unit),
      floor: cleanText(input.building.floor)
    } : undefined,
    street: cleanText(input.street),
    area: cleanText(input.area),
    district: cleanText(input.district),
    landmark: cleanText(input.landmark),
    administrative: {
      state: canonicalState,
      stateCode: stateCode,
      lga: matchedLga,
      ward: cleanText(input.administrative?.ward)
    },
    postcode: cleanedPostcode,
    coordinates: input.coordinates,
    provider: input.provider,
    provenance: initialProvenance,
    verification: input.verification ?? {
      status: (canonicalState && matchedLga && cleanedPostcode) ? "MATCHED" : (canonicalState ? "PARTIAL" : "UNRESOLVED")
    }
  };
}
