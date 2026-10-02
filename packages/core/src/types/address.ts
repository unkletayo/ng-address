import type { AddressProvenance } from "./provenance.js";

/**
 * Address verification and resolution status.
 */
export type VerificationStatus =
  | "EXACT"
  | "MATCHED"
  | "PARTIAL"
  | "UNRESOLVED"
  | "AMBIGUOUS"
  | "INVALID";

/**
 * Building-specific address identifiers.
 */
export interface BuildingInfo {
  number?: string;
  name?: string;
  unit?: string;
  floor?: string;
}

/**
 * Nigerian administrative subdivisions.
 */
export interface AdministrativeInfo {
  state?: string;
  stateCode?: string;
  lga?: string;
  ward?: string;
}

/**
 * Geographic coordinates.
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
}

/**
 * Provider metadata attached to a resolved address.
 */
export interface ProviderInfo {
  name: string;
  reference?: string;
  rawResponse?: Record<string, unknown>;
}

/**
 * Verification audit metadata.
 */
export interface VerificationInfo {
  status: VerificationStatus;
  method?: string;
  verifiedAt?: string;
  notes?: string;
}

/**
 * Canonical Nigerian Address representation.
 */
export interface NigerianAddress {
  /** Original unparsed text input */
  raw?: string;

  /** Building information */
  building?: BuildingInfo;

  /** Street or thoroughfare name */
  street?: string;

  /** Neighborhood, estate, or immediate locality */
  area?: string;

  /** Larger municipal district */
  district?: string;

  /** Prominent local landmark or descriptive directions */
  landmark?: string;

  /** Nigerian administrative hierarchy (State, LGA, Ward) */
  administrative: AdministrativeInfo;

  /** Digital alphanumeric postcode (NDAPS) */
  postcode?: string;

  /** Geographic latitude/longitude */
  coordinates?: Coordinates;

  /** Originating provider information */
  provider?: ProviderInfo;

  /** Field-level data provenance tracking */
  provenance?: AddressProvenance;

  /** Current verification state */
  verification?: VerificationInfo;
}

/**
 * Structured input for address resolution or validation.
 */
export type AddressInput = string | Partial<NigerianAddress>;
