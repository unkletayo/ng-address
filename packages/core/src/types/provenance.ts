/**
 * Field-level provenance origin.
 */
export type ProvenanceSource = "user" | "nipost" | "osm" | "other" | "derived";

/**
 * Metadata capturing the origin and retrieval time of an address field.
 */
export interface FieldSource {
  source: ProvenanceSource;
  retrievedAt?: string;
  providerReference?: string;
  confidence?: "HIGH" | "MEDIUM" | "LOW";
}

/**
 * Map of field keys to their individual provenance sources.
 */
export type AddressProvenance = Partial<Record<string, FieldSource>>;
