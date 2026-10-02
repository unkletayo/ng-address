import { describe, it, expect } from "vitest";
import { normalizeNigerianAddress, findNigerianState, findMatchingLga } from "../src/index.js";

describe("State & LGA Taxonomy Lookup", () => {
  it("should resolve state by official name and case-insensitively", () => {
    const lagos = findNigerianState("lagos");
    expect(lagos?.code).toBe("LA");
    expect(lagos?.capital).toBe("Ikeja");

    const kano = findNigerianState("KANO STATE");
    expect(kano?.code).toBe("KN");
  });

  it("should resolve FCT / Abuja aliases to Federal Capital Territory", () => {
    const fct = findNigerianState("Abuja");
    expect(fct?.name).toBe("Federal Capital Territory");
    expect(fct?.code).toBe("FC");

    const fct2 = findNigerianState("FCT");
    expect(fct2?.name).toBe("Federal Capital Territory");
  });

  it("should match LGAs within a resolved state", () => {
    const lagos = findNigerianState("Lagos");
    const lga = findMatchingLga("ikeja", lagos);
    expect(lga).toBe("Ikeja");

    const etiOsa = findMatchingLga("eti-osa", lagos);
    expect(etiOsa).toBe("Eti Osa");
  });
});

describe("normalizeNigerianAddress", () => {
  it("should parse and normalize a free-text address string", () => {
    const raw = "Plot 4, Admiralty Way, Lekki Phase 1, Eti Osa, Lagos State, 105102";
    const result = normalizeNigerianAddress(raw);

    expect(result.raw).toBe(raw);
    expect(result.administrative.state).toBe("Lagos");
    expect(result.administrative.stateCode).toBe("LA");
    expect(result.administrative.lga).toBe("Eti Osa");
    expect(result.postcode).toBe("105102");
    expect(result.provenance?.state?.source).toBe("derived");
    expect(result.provenance?.lga?.source).toBe("derived");
  });

  it("should clean structured object input with whitespace and state alias", () => {
    const input = {
      raw: "   25 Ring Road, Ibadan  ",
      street: "  Ring Road  ",
      administrative: {
        state: "  Oyo State  ",
        lga: " Ibadan South-West "
      },
      postcode: " 200256 "
    };

    const normalized = normalizeNigerianAddress(input);

    expect(normalized.street).toBe("Ring Road");
    expect(normalized.administrative.state).toBe("Oyo");
    expect(normalized.administrative.stateCode).toBe("OY");
    expect(normalized.administrative.lga).toBe("Ibadan South-West");
    expect(normalized.postcode).toBe("200256");
    expect(normalized.provenance?.state?.source).toBe("derived");
  });

  it("should preserve unresolved status when state cannot be determined", () => {
    const unresolved = normalizeNigerianAddress("Some Unknown Location in Nowhere");
    expect(normalizedState(unresolved)).toBeUndefined();
    expect(unresolved.verification?.status).toBe("UNRESOLVED");
  });
});

function normalizedState(addr: { administrative?: { state?: string } }) {
  return addr.administrative?.state;
}
