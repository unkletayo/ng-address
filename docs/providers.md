# Provider Integration & Custom Adapter Guide

**NG Address** provides a unified provider contract (`AddressProvider`) allowing any external geolocation, geocoding, or postal service to be plugged into the ecosystem seamlessly.

---

## 1. The `AddressProvider` Contract

All adapters implement the TypeScript interface defined in `@ng-address/core`:

```typescript
import type {
  AddressProvider,
  ProviderCapabilities,
  AddressResolution,
  Coordinates,
  AddressSearchQuery,
  AddressSearchResult,
  AddressValidation,
  AddressInput
} from '@ng-address/core';

export class CustomMapProvider implements AddressProvider {
  readonly name = 'custom_provider';

  readonly capabilities: ProviderCapabilities = {
    search: true,
    postcodeLookup: false,
    reverseGeocode: true,
    validation: false
  };

  async resolvePostcode(postcode: string): Promise<AddressResolution> {
    throw new Error('Postcode lookup not supported by CustomMapProvider');
  }

  async reverseGeocode(coordinates: Coordinates): Promise<AddressResolution> {
    // 1. Fetch from custom geocoding API
    // 2. Normalize response into canonical NigerianAddress
    return {
      status: 'MATCHED',
      provider: this.name,
      address: {
        raw: 'Victoria Island, Lagos',
        administrative: {
          state: 'Lagos',
          stateCode: 'LA',
          lga: 'Eti Osa'
        },
        coordinates,
        provenance: {
          raw: { source: 'other', retrievedAt: new Date().toISOString() }
        }
      }
    };
  }
}
```

---

## 2. Best Practices for Custom Adapters

1. **Stamp Provenance**: Always stamp the `provenance` field on resolved addresses with `{ source, retrievedAt }`.
2. **Standardize Administrative Taxonomy**: Pass returned state and LGA strings through `findNigerianState()` and `findMatchingLga()` from `@ng-address/core` to ensure downstream consistency.
3. **Map Errors to `AddressError`**: Catch upstream HTTP/Network errors and throw structured `AddressError` instances (`INVALID_POSTCODE`, `NOT_FOUND`, `RATE_LIMITED`, `NETWORK_ERROR`).
