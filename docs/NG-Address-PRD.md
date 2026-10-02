# NG Address — Comprehensive Product Requirements Document

## Executive Summary

NG Address is an open-source developer infrastructure layer for Nigerian address workflows. It is designed to help developers capture, normalize, resolve, validate, store, and use Nigerian location information while integrating with authoritative providers such as NIPOST's National Digital Alphanumeric Postcode System (NDAPS).

NG Address is not intended to recreate or redistribute the NDAPS database. It provides the software layer around address workflows: common schemas, provider adapters, SDKs, UI components, CLI tooling, documentation, testing utilities, and integrations.

## Product Vision

> Make Nigerian locations as easy for software to understand as they are for Nigerians to describe.

## Product Mission

NG Address provides open, developer-friendly infrastructure for working with Nigerian addresses and location references.

The project should make it easier to:
1. Capture Nigerian addresses.
2. Normalize messy address input.
3. Resolve location references.
4. Validate postcode/location relationships.
5. Represent addresses consistently.
6. Integrate official postcode services.
7. Build address-aware applications.
8. Move between supported providers.
9. Build reusable location workflows.

## Product Principles

- Open source first.
- Provider neutral.
- Respect data ownership and provider terms.
- Code and specifications over copied databases.
- Human-readable address plus machine-readable location reference.
- Verification is contextual.
- Developer experience matters.
- Production-grade reliability underneath a simple API.
- Never fabricate certainty.

## Target Users

### Application developers
Frontend, backend, full-stack, mobile, and platform engineers building Nigerian applications.

### Ecommerce companies
Stores and marketplaces that need better address capture and delivery workflows.

### Logistics companies
Businesses that need consistent location references and fewer ambiguous delivery addresses.

### Fintechs
Businesses needing structured customer, merchant, branch, or field-operation locations.

### Insurance companies
Businesses handling policy, asset, inspection, and claims locations.

### Property companies
Platforms handling listings, buildings, inspections, and property locations.

### Healthcare organizations
Organizations supporting home visits, delivery, facility search, and field operations.

### Government and NGOs
Organizations handling service delivery, facilities, field operations, and program coverage.

## Jobs To Be Done

### Developer
When I receive a Nigerian address from a user, I want to turn it into structured location data so my application can reliably use it.

### Ecommerce merchant
When a customer enters an address, I want to confirm the intended delivery location before accepting the order.

### Logistics company
When I receive a delivery address, I want a consistent location reference that my dispatch system can use.

### Fintech
When onboarding a customer, I want to capture a structured location reference without confusing location verification with identity verification.

### Property platform
When someone creates a listing, I want the location represented consistently.

## MVP Scope

### Core
- Nigerian address schema.
- Runtime address validation.
- Provider abstraction.
- NIPOST provider adapter.
- Postcode syntax validation.
- Structured errors.
- TypeScript support.
- Provenance model.

### Developer tooling
- Node.js SDK.
- CLI.
- Documentation.
- Examples.
- Test utilities.

### Frontend
- React address component.
- Postcode input.
- Postcode resolution flow.
- Confirmation UI.
- Accessibility support.

### Integration
- NIPOST API adapter.
- Secure server-side credential handling.
- Configurable environment support.

## Out of Scope

- Building a competing postcode database.
- Reproducing or redistributing NDAPS data without authorization.
- Recreating NIPOST's consumer application.
- General-purpose maps.
- Turn-by-turn navigation.
- Identity verification.
- Property ownership verification.
- Residency verification.
- Emergency response operations.

## Core Architecture

```text
Application
    |
    v
NG Address SDK
    |
    +--------------------+
    |                    |
Address Core        Provider Layer
                         |
                  +------+------+
                  |             |
                NIPOST         Other
               Provider       Providers
```

The key boundary is:

```text
Application
    |
NG Address interface
    |
Provider implementation
    |
External location service
```

Applications should not need to know provider-specific response formats.

## Core Domain Model

Conceptual model:

```typescript
interface NigerianAddress {
  raw?: string;

  building?: {
    number?: string;
    name?: string;
    unit?: string;
  };

  street?: string;
  area?: string;
  district?: string;

  administrative?: {
    ward?: string;
    lga?: string;
    state?: string;
  };

  postcode?: string;

  coordinates?: {
    latitude: number;
    longitude: number;
  };

  provider?: {
    name: string;
    reference?: string;
  };

  verification?: {
    status: VerificationStatus;
    method?: string;
    verifiedAt?: string;
  };
}
```

This is a conceptual starting point. The final schema must distinguish:
- user-supplied data
- provider-supplied data
- locally normalized data
- derived data
- verified data

## Data Provenance

Significant location fields should support provenance.

```typescript
interface FieldSource {
  source: "user" | "nipost" | "osm" | "other" | "derived";
  retrievedAt?: string;
}
```

The system must never represent inferred information as authoritative provider information.

## Address Lifecycle

```text
RAW
  |
  v
PARSED
  |
  v
NORMALIZED
  |
  v
RESOLVED
  |
  v
VALIDATED
  |
  v
CONFIRMED
  |
  v
STORED
```

Not every address must reach every state.

An unresolved address is a valid outcome.

## Address Input

Supported conceptual inputs:
- Free-text address.
- Structured fields.
- Digital postcode.
- Coordinates.
- Provider-specific identifiers where supported.

## Normalization

Normalization should be deterministic where possible and conservative where ambiguity exists.

The system must not turn landmarks, directions, or free text into authoritative street/building information without sufficient evidence.

## Postcode Validation

Provide local syntax validation through a function such as:

```typescript
isValidPostcodeFormat(postcode)
```

Format validity must not be confused with existence or resolution.

```text
format-valid != exists
```

The exact validation rules must come from current official provider documentation.

## Provider Interface

Conceptual interface:

```typescript
interface AddressProvider {
  resolvePostcode(
    postcode: string
  ): Promise<AddressResolution>;

  search(
    query: AddressSearchQuery
  ): Promise<AddressSearchResult[]>;

  reverseGeocode(
    coordinates: Coordinates
  ): Promise<AddressResolution>;

  validate(
    address: AddressInput
  ): Promise<AddressValidation>;
}
```

Provider capabilities should be explicit.

```typescript
interface ProviderCapabilities {
  search: boolean;
  postcodeLookup: boolean;
  reverseGeocode: boolean;
  validation: boolean;
}
```

## NIPOST Provider

The NIPOST adapter is the first official provider integration.

Responsibilities:
- authentication
- request construction
- response parsing
- response normalization
- error translation
- timeout handling
- rate-limit handling
- environment configuration
- provider metadata

NIPOST-specific details must remain isolated from the core package.

## Authentication

Secrets must never be exposed in:
- browser bundles
- mobile binaries
- Git repositories
- public frontend environment variables
- logs
- error messages

Default architecture:

```text
React application
    |
    v
Application backend
    |
    v
NIPOST
```

not direct exposure of provider secrets to clients.

## Configuration

Conceptual configuration:

```typescript
const client = new NgAddress({
  provider: "nipost",
  apiKey: process.env.NIPOST_API_KEY
});
```

Configuration should support:
- provider
- credentials
- base URL
- timeout
- retry policy
- logging
- environment
- cache strategy

## Error Model

```typescript
type AddressErrorCode =
  | "INVALID_INPUT"
  | "INVALID_POSTCODE"
  | "NOT_FOUND"
  | "PROVIDER_UNAVAILABLE"
  | "AUTHENTICATION_FAILED"
  | "PERMISSION_DENIED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "PROVIDER_ERROR"
  | "UNSUPPORTED_OPERATION";
```

Errors should expose:
- code
- human-readable message
- retryability
- provider where relevant
- optional retry-after information

## Retry Strategy

Retry only retryable failures:
- timeout
- temporary network failure
- transient provider errors
- documented temporary service unavailability

Do not automatically retry:
- invalid input
- authentication failure
- permission failure
- malformed requests

Use exponential backoff.

## Timeout Strategy

Every external request must have a timeout. The default should be configurable and validated against real provider behavior.

## Rate Limiting

Provider rate-limit information must be surfaced rather than hidden.

## Caching

Caching must be configurable and provider-specific rules must be respected.

Potential interfaces:

```text
disabled
memory
redis
custom
```

The project must not assume that provider data can be permanently cached or redistributed.

## React Component

Conceptual API:

```tsx
<NigerianAddressInput
  onChange={handleAddressChange}
/>
```

Capabilities:
- free-text input
- postcode input
- search
- validation
- location confirmation
- loading state
- error state
- accessibility
- keyboard navigation
- mobile-friendly behavior

## React Component States

```text
EMPTY
TYPING
SEARCHING
RESULTS
SELECTED
VALIDATING
VALID
INVALID
ERROR
OFFLINE
```

## Confirmation UX

The user should see enough resolved information to determine whether the intended location was found.

Example:

```text
We found this location:

12 Allen Avenue
Ikeja
Lagos

Digital Postcode:
XXXXXXXXXXX

[Confirm location]
[Choose another location]
```

## Accessibility

Target WCAG 2.2 AA where applicable:
- semantic labels
- keyboard navigation
- screen-reader support
- visible focus
- accessible errors
- sufficient contrast
- touch-friendly controls
- no color-only status communication

## CLI

Potential commands:

```bash
ng-address validate
ng-address lookup
ng-address search
ng-address normalize
ng-address config
```

Example:

```bash
ng-address lookup XXXXXXXXXXX
```

## Future Hosted API

Potential endpoints:

```http
POST /v1/addresses/normalize
POST /v1/addresses/validate
POST /v1/addresses/resolve
GET  /v1/postcodes/{postcode}
POST /v1/search
POST /v1/reverse-geocode
```

The open-source SDK should not require the hosted service.

## Search

A future search endpoint could accept free-text location queries and return normalized results, subject to provider capabilities.

## Reverse Geocoding

The provider abstraction should support reverse geocoding where available, even if it is not in the first SDK release.

## Address Confidence

Do not invent confidence scores.

Where providers provide a quality signal, expose it. Otherwise use explicit statuses such as:

```text
EXACT
MATCHED
PARTIAL
UNRESOLVED
AMBIGUOUS
INVALID
```

## Privacy

NG Address should follow data minimization.

The core library should be usable without collecting personal information.

Sensitive data may include:
- customer name
- phone number
- home address
- coordinates
- device information
- IP address
- identity information

## Privacy by Architecture

Prefer:

```text
Application
    |
NG Address
    |
Provider
```

over a centralized address-data service unless the consuming application explicitly chooses hosted infrastructure.

## Logging

Do not log by default:
- provider secrets
- full customer addresses
- personal information unnecessarily
- authentication tokens

Safe structured logs may contain:
- provider
- operation
- duration
- status
- request identifier

## Security

Requirements:
- secure secret management
- dependency scanning
- static analysis
- vulnerability disclosure process
- secure defaults
- no credentials in examples
- HTTPS-only provider communication
- input validation
- output validation
- SSRF protection where configurable URLs exist
- dependency update process

## Compliance Boundary

NG Address is infrastructure, not a compliance service.

Applications remain responsible for their regulatory obligations.

Location verification must not be represented as:
- identity verification
- ownership verification
- residency verification
- business legitimacy verification

## NIPOST Licensing Boundary

The project must not:
- scrape NDAPS
- bulk-copy NDAPS
- redistribute NDAPS database contents without authorization
- create a competing postcode database from protected data
- present copied NDAPS data as independently owned
- use NIPOST trademarks without permission

The project may integrate with NDAPS where authorized.

## Relationship With NIPOST

Desired relationship:

```text
NIPOST
Official national location infrastructure
          |
          | authorized API
          v
NG Address
Developer infrastructure
          |
          v
Nigerian software ecosystem
```

The project should not be presented as an official NIPOST product unless formal authorization exists.

## Open Source Strategy

Suggested repository:

```text
ng-address/
├── packages/
│   ├── core/
│   ├── provider-nipost/
│   ├── react/
│   └── cli/
├── examples/
├── docs/
├── specs/
├── tests/
├── integrations/
├── .github/
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

## Package Strategy

### @ng-address/core
- schemas
- types
- validation primitives
- provider interfaces
- errors
- utilities

### @ng-address/nipost
- NIPOST API client
- authentication
- provider adapter
- response mapping

### @ng-address/react
- address input
- postcode input
- search UI
- confirmation UI
- hooks

### @ng-address/cli
- lookup
- search
- validation
- debugging

## Testing Strategy

### Unit tests
- postcode syntax
- schema validation
- normalization
- provider mapping
- errors
- configuration
- retry logic

### Integration tests
Test the NG Address to provider boundary where permitted.

### Contract tests
Detect upstream response changes.

### Component tests
Test rendering, typing, selection, keyboard navigation, loading and errors.

### End-to-end tests
Test complete address capture and confirmation flows.

## Test Data

Never put private real-person addresses into public fixtures.

Use:
- official public examples
- synthetic addresses
- authorized public data
- provider-approved test data

## Documentation

Documentation should support:
- beginner integration
- intermediate SDK usage
- advanced custom providers
- production concerns

Suggested structure:

```text
docs/
├── getting-started/
├── concepts/
├── address-schema/
├── providers/
├── nipost/
├── react/
├── node/
├── cli/
├── security/
├── privacy/
├── caching/
├── errors/
├── testing/
├── integrations/
└── contributing/
```

## WooCommerce Integration

Post-MVP.

Potential features:
- enable/disable NG Address
- require postcode
- validate address
- confirmation flow

The integration should support advisory, standard, and strict validation modes.

## Migration Tool

Future CLI concept:

```bash
ng-address migrate addresses.csv
```

The migration tool must respect provider API limits and data-use restrictions.

## Database Integration

Applications should be encouraged to migrate incrementally rather than immediately replacing existing address fields.

A reference schema may include:

```sql
address_raw
address_line_1
address_line_2
city
area
lga
state
postcode
latitude
longitude
provider
provider_reference
verified_at
```

## Location Identity

Keep these separate:

```text
Location
  !=
Person
  !=
Ownership
```

A digital postcode identifies or references a location; it does not by itself prove the identity, ownership, tenancy, or residency of a person.

## Future Extensions

Potential future modules:
- agriculture
- emergency services
- healthcare
- business verification
- serviceability
- address-change detection
- location events
- webhooks
- provider fallback
- open address specification

These should remain separate from the core address library.

## Roadmap

### Phase 0 — Research
- current NIPOST API review
- licensing review
- schema proposal
- provider interface
- feasibility

### Phase 1 — Core OSS
- types
- schema
- provider interface
- errors
- validation
- docs

### Phase 2 — NIPOST Adapter
- authentication
- lookup
- supported search
- supported reverse lookup
- response mapping
- tests

### Phase 3 — React SDK
- postcode input
- search
- loading
- errors
- confirmation
- accessibility

### Phase 4 — CLI
- lookup
- search
- validate
- normalize

### Phase 5 — Real Integration
- ecommerce example
- WooCommerce proof of concept
- migration example

### Phase 6 — Community
- GitHub
- documentation
- issues
- discussions
- contribution process

### Phase 7 — Hosted Services
Only after real usage and validation.

Potential:
- hosted API
- managed caching
- dashboards
- enterprise integrations
- analytics

## Success Metrics

### Adoption
- active repositories
- npm downloads
- contributors
- forks
- documentation traffic

### Developer success
- time to first successful integration
- installation success
- API success rate
- issue frequency
- SDK adoption

### Product success
- successful address resolution workflows
- resolution success rate
- failed resolution rate
- confirmation rate
- provider error rate

## North Star Metric

Number of successful Nigerian address-resolution workflows completed through NG Address.

## Quality Targets

Initial engineering targets:

```text
TypeScript strict mode: enabled
Critical vulnerabilities: 0
Credential leaks: 0
Unhandled provider errors: 0
High-value paths covered by tests
```

Coverage should be treated as an engineering signal, not proof of quality by itself.

## Performance

Local operations such as syntax validation and normalization should be effectively immediate.

Provider resolution latency is provider-dependent and should be observable rather than hidden.

## Developer Experience Target

A developer should be able to install the package and complete a first successful postcode-resolution integration in roughly 10 minutes using the documentation.

## Versioning

Use semantic versioning:

```text
MAJOR.MINOR.PATCH
```

Use explicit API and schema versions for hosted interfaces and stable data contracts.

## Governance

Initial model:

```text
Maintainers
   |
Core maintainers
   |
Contributors
```

Major changes should use an RFC process.

RFCs should cover:
- problem
- proposal
- alternatives
- security
- privacy
- provider implications
- compatibility
- migration
- open questions

## Risks

### NIPOST API changes
Mitigation: provider isolation, contract tests, versioned adapter.

### Licensing restrictions
Mitigation: no unauthorized database redistribution, legal/data-use review.

### Low developer adoption
Mitigation: excellent React/Node experience, practical examples, clear documentation.

### Scope creep
Mitigation: keep core focused on address infrastructure.

### Provider dependency
Mitigation: provider abstraction.

### Incorrect address assumptions
Mitigation: provenance, explicit uncertainty, confirmation.

### Privacy issues
Mitigation: data minimization, no unnecessary centralized address database, secure logging.

## MVP Acceptance Criteria

### Core
- [ ] Address schema documented.
- [ ] Runtime validation.
- [ ] TypeScript types exported.
- [ ] Provider interface.
- [ ] Common error model.
- [ ] Provenance model.

### NIPOST
- [ ] Adapter exists.
- [ ] Credentials remain server-side.
- [ ] Supported lookup works.
- [ ] Supported search works.
- [ ] Supported reverse geocoding is mapped where applicable.
- [ ] Provider errors map to common errors.
- [ ] Provider responses are tested.

### React
- [ ] Postcode input.
- [ ] Resolution.
- [ ] Loading state.
- [ ] Error state.
- [ ] Confirmation.
- [ ] Keyboard navigation.
- [ ] Accessibility labels.

### CLI
- [ ] Lookup.
- [ ] Validate.
- [ ] Search where supported.

### Documentation
- [ ] README.
- [ ] Getting-started guide.
- [ ] NIPOST setup.
- [ ] Security guide.
- [ ] Provider guide.
- [ ] Contribution guide.
- [ ] Privacy guidance.

### Engineering
- [ ] CI.
- [ ] Unit tests.
- [ ] Integration tests where feasible.
- [ ] Secret scanning.
- [ ] Dependency scanning.
- [ ] Semantic versioning.

## Recommended Initial Stack

- TypeScript
- Node.js
- React
- pnpm workspaces
- Vitest or equivalent
- Playwright
- GitHub Actions
- ESLint
- Prettier
- TypeScript strict mode
- MDX-based documentation

The exact tools can change without changing the product architecture.

## Proposed Monorepo

```text
ng-address/
├── apps/
│   └── docs/
├── packages/
│   ├── core/
│   ├── nipost/
│   ├── react/
│   └── cli/
├── examples/
│   ├── nextjs/
│   └── express/
├── specs/
├── tests/
├── .github/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

## Immediate Next Deliverables

Before production implementation, produce:

1. Technical Specification / SDD.
2. Exact current NIPOST API contract notes.
3. Normalized address schema.
4. Provider interface specification.
5. Package boundary specification.
6. Threat model.
7. Data and privacy model.
8. MVP implementation plan.
9. Public repository structure.
10. Working demo specification.

## Product Thesis

NIPOST answers:

> What location is this?

NG Address answers:

> How does my software work with that location?

That distinction should guide every product decision.

## Final Product Boundary

NG Address owns:
- developer experience
- address schema
- provider abstraction
- SDKs
- UI components
- validation primitives
- normalization
- error model
- tooling
- documentation
- integrations

NIPOST owns/administers:
- NDAPS
- official postcode infrastructure
- official postcode data
- provider APIs
- provider-specific permissions
- provider-specific data rights

Applications own:
- customer data
- business workflows
- identity decisions
- delivery decisions
- risk decisions
- regulatory obligations

## Long-Term Vision

The progression is:

```text
NIPOST NDAPS
      |
      v
NG Address SDK
      |
      +---- React
      +---- Node
      +---- CLI
      |
      v
Common Address Schema
      |
      +---- Ecommerce
      +---- Logistics
      +---- Fintech
      +---- Property
      +---- Healthcare
      +---- Agriculture
      +---- Government
      |
      v
Nigerian Location Interoperability Layer
```

The first goal is not to build every downstream product.

The first goal is to make Nigerian address infrastructure easy for developers to use correctly.
