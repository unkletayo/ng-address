import { describe, it, expect } from "vitest";
import { NigerianAddressSchema } from "../src/schema/address.js";
import type { NigerianAddress } from "../src/types/address.js";

describe("NigerianAddressSchema", () => {
  it("should validate a complete Nigerian address", () => {
    const address: NigerianAddress = {
      raw: "12 Allen Avenue, Ikeja, Lagos State",
      building: {
        number: "12",
        name: "Plot B"
      },
      street: "Allen Avenue",
      area: "Ikeja",
      administrative: {
        state: "Lagos",
        stateCode: "LA",
        lga: "Ikeja"
      },
      postcode: "100281",
      coordinates: {
        latitude: 6.6018,
        longitude: 3.3515
      },
      provenance: {
        postcode: {
          source: "nipost",
          retrievedAt: "2026-10-02T10:00:00Z",
          confidence: "HIGH"
        }
      },
      verification: {
        status: "EXACT",
        method: "nipost-ndaps",
        verifiedAt: "2026-10-02T10:00:00Z"
      }
    };

    const parsed = NigerianAddressSchema.parse(address);
    expect(parsed.administrative.state).toBe("Lagos");
    expect(parsed.coordinates?.latitude).toBe(6.6018);
    expect(parsed.provenance?.postcode?.source).toBe("nipost");
  });

  it("should validate a minimal address with only administrative fields", () => {
    const minimal: NigerianAddress = {
      administrative: {
        state: "Kano"
      }
    };

    const parsed = NigerianAddressSchema.parse(minimal);
    expect(parsed.administrative.state).toBe("Kano");
  });

  it("should reject invalid coordinates outside global bounds", () => {
    const invalidAddress = {
      administrative: { state: "Lagos" },
      coordinates: {
        latitude: 195, // invalid latitude > 90
        longitude: 3.35
      }
    };

    expect(() => NigerianAddressSchema.parse(invalidAddress)).toThrow();
  });
});
