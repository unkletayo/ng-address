import { z } from "zod";

export const ProvenanceSourceSchema = z.enum(["user", "nipost", "osm", "other", "derived"]);

export const FieldSourceSchema = z.object({
  source: ProvenanceSourceSchema,
  retrievedAt: z.string().optional(),
  providerReference: z.string().optional(),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]).optional()
});

export const AddressProvenanceSchema = z.record(FieldSourceSchema);

export const VerificationStatusSchema = z.enum([
  "EXACT",
  "MATCHED",
  "PARTIAL",
  "UNRESOLVED",
  "AMBIGUOUS",
  "INVALID"
]);

export const BuildingInfoSchema = z.object({
  number: z.string().optional(),
  name: z.string().optional(),
  unit: z.string().optional(),
  floor: z.string().optional()
});

export const AdministrativeInfoSchema = z.object({
  state: z.string().optional(),
  stateCode: z.string().optional(),
  lga: z.string().optional(),
  ward: z.string().optional()
});

export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracyMeters: z.number().positive().optional()
});

export const ProviderInfoSchema = z.object({
  name: z.string(),
  reference: z.string().optional(),
  rawResponse: z.record(z.unknown()).optional()
});

export const VerificationInfoSchema = z.object({
  status: VerificationStatusSchema,
  method: z.string().optional(),
  verifiedAt: z.string().optional(),
  notes: z.string().optional()
});

export const NigerianAddressSchema = z.object({
  raw: z.string().optional(),
  building: BuildingInfoSchema.optional(),
  street: z.string().optional(),
  area: z.string().optional(),
  district: z.string().optional(),
  landmark: z.string().optional(),
  administrative: AdministrativeInfoSchema,
  postcode: z.string().optional(),
  coordinates: CoordinatesSchema.optional(),
  provider: ProviderInfoSchema.optional(),
  provenance: AddressProvenanceSchema.optional(),
  verification: VerificationInfoSchema.optional()
});

export type NigerianAddressSchemaType = z.infer<typeof NigerianAddressSchema>;
