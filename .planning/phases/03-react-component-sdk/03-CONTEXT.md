# Phase 3: React Component SDK - Context

**Gathered:** 2026-10-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 3 delivers `@ng-address/react`, providing accessible (`WCAG 2.2 AA`), production-ready React component primitives, compound components, and hooks for Nigerian address entry, digital postcode resolution, and location confirmation.

</domain>

<decisions>
## Implementation Decisions

### Component Styling & Architecture
- **D-01:** **Hybrid Headless + Default CSS Architecture** — Provide headless hook logic (`useAddressResolution`, `usePostcodeLookup`) and compound primitives combined with a polished default stylesheet (`@ng-address/react/styles.css`). Expose CSS custom variables (`--nga-*`) and state attributes (`data-state`, `data-loading`, `data-valid`) so developers can use it out-of-the-box or completely customize/override with Tailwind CSS or CSS Modules. — **Reversibility:** costly — changing token contracts after public release affects downstream UI styling.

### Input Interaction & Mode Switching
- **D-02:** **Smart Unified Input with Manual Hierarchy Fallback** — The primary `<NigerianAddressInput />` is a smart search input that automatically detects NDAPS digital postcodes (e.g. `LA-11-W06-TC-10` or traditional `100001`) vs unstructured text, showing live suggestions/autocomplete. It includes an explicit toggle/fallback to manual structured selection (`<StateLgaSelect />` for State -> LGA -> Ward dropdowns). Subcomponents are also exported modularly for custom compositions. — **Reversibility:** reversible.

### Confirmation UX & Presentation
- **D-03:** **Dual Confirmation Pattern (Inline Card & Accessible Modal)** — Deliver both `<AddressConfirmationCard />` (for compact inline embedding within checkout/registration forms) and `<AddressConfirmationModal />` (for popup confirmation workflows). Both components display full administrative breakdown (State, LGA, Ward, Street/Building, NDAPS postcode, Coordinates) with provenance badges and comply with WCAG 2.2 AA (focus trapping, backdrop dismiss, Escape key handling). — **Reversibility:** reversible.

### Backend API Transport & Proxying
- **D-04:** **React Context + Prop Overrides** — Provide `<AddressConfigProvider proxyUrl="/api/address/resolve" headers={...} />` for application-wide proxy configuration, while allowing individual components and hooks to override `proxyUrl` or provide a custom `resolveAddress` async function prop. This guarantees server-side NIPOST credentials remain protected behind proxy endpoints. — **Reversibility:** one-way — context/prop configuration shape forms the core developer API contract.

### the agent's Discretion
- Exact animation/transition timings for dropdown menus and modal entrance.
- Internal debounce intervals (default 300ms for search).
- Iconography implementation (accessible SVG icons included with fallback slots).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core Schemas & Taxonomy
- `packages/core/src/types/address.ts` — Canonical `NigerianAddress`, `AdministrativeInfo`, `Coordinates`, `VerificationInfo` types.
- `packages/core/src/types/provider.ts` — Standard `AddressProvider` and `AddressResolution` contracts.
- `packages/core/src/validation/postcode.ts` — Postcode syntax validation rules and regex.
- `packages/core/src/normalization/nigerian-states.ts` — 36 States + FCT, 774 LGAs reference data and fuzzy matching.

### Requirements & Boundaries
- `.planning/REQUIREMENTS.md` § React Component SDK (REACT-01 to REACT-05) — Acceptance criteria for WCAG accessibility, keyboard navigation, hooks, and confirmation modal.
- `.planning/PROJECT.md` § Key Decisions — Client-side credential security rules.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@ng-address/core`: `findNigerianState`, `findMatchingLga`, `isValidPostcodeFormat`, `normalizeNigerianAddress`, and `NIGERIAN_STATES` for zero-latency client-side taxonomy dropdowns and syntax checking.
- `@ng-address/core`: `AddressError` and `AddressErrorCode` for structured frontend error message mapping.

### Established Patterns
- Dual ESM/CJS build via `tsup` configured in root and sibling packages.
- Strict TypeScript with `noUncheckedIndexedAccess`.
- Vitest / Testing Library for unit and React component tests.

### Integration Points
- Frontend components communicate with backend API proxy routes (e.g. Next.js / Express routes wrapping `@ng-address/nipost`).

</code_context>

<specifics>
## Specific Ideas
- Support keyboard shortcuts: `ArrowDown`/`ArrowUp` to navigate autocomplete suggestions, `Enter` to select, `Escape` to close dropdown or modal.
- ARIA accessibility: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-live="polite"` for status messages.

</specifics>

<deferred>
## Deferred Ideas
- None — all discussion items stayed strictly within Phase 3 scope.

</deferred>

---

*Phase: 3-React Component SDK*
*Context gathered: 2026-10-02*
