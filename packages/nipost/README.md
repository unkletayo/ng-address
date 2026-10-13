# @ng-address/nipost

> Official NIPOST NDAPS provider adapter for authoritative Nigerian digital postcode lookup, reverse geocoding, and address validation.

## Features

- **Authoritative Resolution**: Connects to official NIPOST NDAPS gateway endpoints (`/healthz`, `/v1/lookup`, `/v1/search/reverse`, `/v1/search/autocomplete`, `/v1/assembly/assemble`).
- **Client-Side Secret Guards**: Throws runtime configuration errors if mistakenly bundled into client-side code.
- **Resilient Transport**: Axios HTTP client with exponential backoff, random jitter, and rate-limit header parsing.
- **Error Mapping**: Upstream 401, 403, 429, and 5xx errors map cleanly to typed `AddressError` instances.

## Installation

```bash
pnpm add @ng-address/nipost @ng-address/core
```

## Usage

```typescript
import { NipostProvider } from '@ng-address/nipost';

const provider = new NipostProvider({
  apiKey: process.env.NIPOST_API_KEY
});

// Resolve digital postcode
const result = await provider.resolvePostcode('LA-10-A01-LK-02');
console.log(result.address.administrative.state); // "Lagos"
console.log(result.address.coordinates);          // { latitude: ..., longitude: ... }
```
