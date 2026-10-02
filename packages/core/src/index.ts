// Package metadata
export const PACKAGE_NAME = "@ng-address/core";
export const VERSION = "0.1.0";

// Domain Types
export type {
  NigerianAddress,
  AddressInput,
  BuildingInfo,
  AdministrativeInfo,
  Coordinates,
  ProviderInfo,
  VerificationInfo,
  VerificationStatus
} from "./types/address.js";

// Provenance Types
export type {
  FieldSource,
  ProvenanceSource,
  AddressProvenance
} from "./types/provenance.js";

// Error Types
export type { AddressErrorCode } from "./types/error.js";

// Provider Contracts
export type {
  AddressProvider,
  ProviderCapabilities,
  AddressResolution,
  AddressSearchQuery,
  AddressSearchResult,
  AddressValidation
} from "./types/provider.js";

// Zod Schemas
export {
  NigerianAddressSchema,
  FieldSourceSchema,
  AddressProvenanceSchema,
  BuildingInfoSchema,
  AdministrativeInfoSchema,
  CoordinatesSchema,
  ProviderInfoSchema,
  VerificationInfoSchema,
  VerificationStatusSchema,
  ProvenanceSourceSchema
} from "./schema/address.js";
export type { NigerianAddressSchemaType } from "./schema/address.js";

// Administrative Taxonomy & Normalization
export {
  NIGERIAN_STATES,
  findNigerianState,
  findMatchingLga
} from "./normalization/nigerian-states.js";
export type { NigerianStateData } from "./normalization/nigerian-states.js";

export { normalizeNigerianAddress } from "./normalization/normalize.js";

// Postcode Validation
export {
  isValidPostcodeFormat,
  sanitizePostcode
} from "./validation/postcode.js";
export type { PostcodeValidationOptions } from "./validation/postcode.js";

// Structured Errors
export {
  AddressError,
  ConfigurationError,
  ProviderError,
  InvalidStateError,
  InvalidLgaError,
  InvalidPostcodeError
} from "./errors/address-error.js";
export type { AddressErrorOptions } from "./errors/address-error.js";
