# Phase 3: React Component SDK - Research

**Researched:** 2026-10-02
**Domain:** React 18/19 UI Components, Accessible Form Controls (WCAG 2.2 AA), Headless Component Primitives, CSS Custom Properties Design Tokens
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** **Hybrid Headless + Default CSS Architecture** — Provide headless hook logic (`useAddressResolution`, `usePostcodeLookup`) and compound primitives combined with a polished default stylesheet (`@ng-address/react/styles.css`). Expose CSS custom variables (`--nga-*`) and state attributes (`data-state`, `data-loading`, `data-valid`) so developers can use it out-of-the-box or completely customize/override with Tailwind CSS or CSS Modules. — **Reversibility:** costly — changing token contracts after public release affects downstream UI styling.
- **D-02:** **Smart Unified Input with Manual Hierarchy Fallback** — The primary `<NigerianAddressInput />` is a smart search input that automatically detects NDAPS digital postcodes (e.g. `LA-11-W06-TC-10` or traditional `100001`) vs unstructured text, showing live suggestions/autocomplete. It includes an explicit toggle/fallback to manual structured selection (`<StateLgaSelect />` for State -> LGA -> Ward dropdowns). Subcomponents are also exported modularly for custom compositions. — **Reversibility:** reversible.
- **D-03:** **Dual Confirmation Pattern (Inline Card & Accessible Modal)** — Deliver both `<AddressConfirmationCard />` (for compact inline embedding within checkout/registration forms) and `<AddressConfirmationModal />` (for popup confirmation workflows). Both components display full administrative breakdown (State, LGA, Ward, Street/Building, NDAPS postcode, Coordinates) with provenance badges and comply with WCAG 2.2 AA (focus trapping, backdrop dismiss, Escape key handling). — **Reversibility:** reversible.
- **D-04:** **React Context + Prop Overrides** — Provide `<AddressConfigProvider proxyUrl="/api/address/resolve" headers={...} />` for application-wide proxy configuration, while allowing individual components and hooks to override `proxyUrl` or provide a custom `resolveAddress` async function prop. This guarantees server-side NIPOST credentials remain protected behind proxy endpoints. — **Reversibility:** one-way — context/prop configuration shape forms the core developer API contract.

### the agent's Discretion
- Exact animation/transition timings for dropdown menus and modal entrance.
- Internal debounce intervals (default 300ms for search).
- Iconography implementation (accessible SVG icons included with fallback slots).

### Deferred Ideas (OUT OF SCOPE)
- None — all discussion items stayed strictly within Phase 3 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REACT-01 | Provide `<NigerianAddressInput />` component supporting free-text address and digital postcode entry modes. | Smart unified combobox pattern with regex-based NDAPS detection and `<StateLgaSelect />` hierarchy fallback. |
| REACT-02 | Implement `useAddressResolution` and `usePostcodeLookup` React hooks with loading, error, and resolved states. | Standard React 18/19 custom hook state machine with `AbortController` cancellation and debounced query execution. |
| REACT-03 | Provide address confirmation card/modal displaying resolved location details for explicit user acceptance. | Compound `<AddressConfirmationCard />` and accessible `<AddressConfirmationModal />` with focus management and provenance indicators. |
| REACT-04 | Comply with WCAG 2.2 AA accessibility standards (ARIA combobox/input attributes, visible focus indicators, contrast >= 4.5:1). | Strict ARIA 1.2 Combobox and Dialog attributes, high-contrast token palette, screen-reader live announcements (`aria-live="polite"`). |
| REACT-05 | Full keyboard navigation support (Arrow navigation, Enter selection, Escape dismiss). | Keydown event handlers for `ArrowUp`/`ArrowDown` virtual focus in listbox, `Enter` selection, `Escape` dropdown/modal closing, and Tab focus trap in dialog. |
</phase_requirements>

## Summary

The `@ng-address/react` package delivers an accessible, framework-agnostic, and beautifully designed component SDK for Nigerian address workflows. It bridges backend resolution engines (NIPOST NDAPS and `@ng-address/core`) with modern frontend web applications (Next.js, Vite, Remix, CRA).

The architecture separates concerns across three clear layers:
1. **Context & Transport Layer:** `<AddressConfigProvider />` and underlying fetch clients that safely dispatch queries to developer-hosted backend proxy routes without exposing NIPOST credentials.
2. **Headless State & Hooks Layer:** `useAddressResolution()`, `usePostcodeLookup()`, and `useAddressState()` hooks managing asynchronous lifecycle transitions, error mapping, cancellation, and caching.
3. **Accessible UI Component Layer:** `<NigerianAddressInput />` (Combobox with auto-detect), `<StateLgaSelect />` (offline cascading administrative select), `<AddressConfirmationCard />` (inline review card), and `<AddressConfirmationModal />` (accessible focus-trapped dialog).

All components ship unopinionated semantic markup styled via semantic CSS Custom Properties (`--nga-*`) with optional class name injection (`className`), making them immediately usable via `@ng-address/react/styles.css` while remaining 100% compatible with Tailwind CSS or custom design systems.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Address Input & Suggestion Autocomplete | Browser / Client | Frontend Server (Proxy) | Client handles instantaneous UI interactions, keystroke debouncing, and ARIA combobox state. Requests route through proxy. |
| Offline State / LGA Cascade | Browser / Client | — | 36 States + FCT / 774 LGAs dataset from `@ng-address/core` runs offline with 0ms latency in the client bundle. |
| Postcode / Search API Resolution | Backend / Proxy Route | Browser (Hook State) | Browser initiates lookup via `useAddressResolution`; server proxy holds API key and queries upstream NIPOST NDAPS. |
| Address Confirmation & User Acceptance | Browser / Client | Form Submission / App | Confirmation UI displays parsed components and coordinates before dispatching confirmed address to the host application's form handler. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `react` | `^18.2.0 \|\| ^19.0.0` | Peer dependency for UI rendering | Modern standard across React ecosystems |
| `react-dom` | `^18.2.0 \|\| ^19.0.0` | Peer dependency for DOM mounting/portals | Required for rendering modal portals |
| `@ng-address/core` | `workspace:*` | Canonical domain types, schemas, normalization, and state/LGA taxonomy | Single source of truth for Nigerian addresses |

### Supporting (Dev Dependencies)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `tsup` | `^8.4.0` | Dual CJS/ESM bundling & DTS generation | Build pipeline for packages |
| `@testing-library/react` | `^16.2.0` | React component testing | Testing component behaviors and user interactions |
| `@testing-library/user-event` | `^14.6.1` | Realistic keyboard and mouse simulation | Testing WCAG keyboard accessibility (Arrow keys, Tab, Enter, Escape) |
| `jsdom` | `^26.0.0` | DOM environment for Vitest | Running React component test suites |

## Package Legitimacy Audit

| Package | Registry | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----------|-------------|---------|-------------|
| `react` | npm | >25M/wk | github.com/facebook/react | [OK] | Approved (peerDependency) |
| `react-dom` | npm | >25M/wk | github.com/facebook/react | [OK] | Approved (peerDependency) |
| `@testing-library/react` | npm | >10M/wk | github.com/testing-library/react-testing-library | [OK] | Approved (devDependency) |
| `@testing-library/user-event` | npm | >8M/wk | github.com/testing-library/user-event | [OK] | Approved (devDependency) |
| `jsdom` | npm | >20M/wk | github.com/jsdom/jsdom | [OK] | Approved (devDependency) |

## Architecture Patterns

### Recommended Package Structure
```
packages/react/
├── src/
│   ├── components/
│   │   ├── NigerianAddressInput.tsx   # Smart unified combobox input
│   │   ├── StateLgaSelect.tsx         # Cascading State -> LGA -> Ward dropdowns
│   │   ├── AddressConfirmationCard.tsx# Inline confirmation summary
│   │   └── AddressConfirmationModal.tsx# Accessible focus-trapped dialog modal
│   ├── context/
│   │   └── AddressConfigContext.tsx   # Global proxyUrl & config provider
│   ├── hooks/
│   │   ├── useAddressResolution.ts    # Debounced resolution & search hook
│   │   ├── usePostcodeLookup.ts       # Digital postcode lookup hook
│   │   └── useFocusTrap.ts            # Lightweight accessible focus-trap hook
│   ├── styles/
│   │   └── index.css                  # Polished default CSS design tokens (--nga-*)
│   ├── types/
│   │   └── index.ts                   # Component prop types and contracts
│   └── index.ts                       # Public barrel exports
├── test/
│   ├── input.test.tsx                 # Combobox and auto-detect tests
│   ├── cascade.test.tsx               # State & LGA selection tests
│   ├── modal.test.tsx                 # Modal focus trap & Escape dismiss tests
│   └── hooks.test.tsx                 # Hook lifecycle and error state tests
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### Pattern 1: ARIA 1.2 Combobox with Keyboard Virtual Focus
```typescript
// Strict WAI-ARIA Combobox implementation
<div className="nga-combobox" data-state={isOpen ? 'open' : 'closed'}>
  <input
    role="combobox"
    aria-autocomplete="list"
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    aria-controls="nga-listbox"
    aria-activedescendant={focusedIndex >= 0 ? `nga-option-${focusedIndex}` : undefined}
    value={query}
    onChange={handleInputChange}
    onKeyDown={handleKeyDown}
  />
  {isOpen && (
    <ul id="nga-listbox" role="listbox" aria-label="Address suggestions">
      {suggestions.map((item, idx) => (
        <li
          key={item.id}
          id={`nga-option-${idx}`}
          role="option"
          aria-selected={focusedIndex === idx}
          onClick={() => selectItem(item)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  )}
</div>
```

### Pattern 2: Lightweight Zero-Dependency Accessible Modal Focus Trap
```typescript
// useFocusTrap: Traps Tab / Shift+Tab within container and listens for Escape
export function useFocusTrap(ref: React.RefObject<HTMLElement | null>, isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const element = ref.current;
    const focusable = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, ref]);
}
```

## Project Skills & Design Guidelines Integration

The implementation directly adheres to the workspace skills:
- **`better-accessibility`**:
  - Semantic `<label for="...">` and `<button type="button">`.
  - `:focus-visible` custom ring with 2px solid perimeter and high contrast (>4.5:1).
  - Polite live region (`role="status"`, `aria-live="polite"`) announcing lookup count and validation results.
  - Full `@media (prefers-reduced-motion: no-preference)` guards for all dropdown/modal transitions.
  - Minimum touch target sizing (44x44px mobile, 40x40px desktop hit targets).
- **`better-ui`**:
  - Concentric border radius (`outer = inner + padding`) on combobox containers and dropdown cards.
  - Tactile button press feedback (`scale(0.96)` with `cubic-bezier(0.2, 0, 0, 1)`).
  - SVG icons using `currentColor` matching 1.5px stroke weight.
- **`vercel-react-best-practices`**:
  - `rerender-derived-state-no-effect`: Derive filtered LGA lists and active selection during render, not in `useEffect`.
  - `rerender-use-deferred-value`: Use `useDeferredValue` or `startTransition` to prevent input latency during rapid typing.
  - `client-event-listeners`: Properly bind and clean up window keydown and click-outside listeners.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| State / LGA reference lists | Ad-hoc arrays in UI files | `@ng-address/core` (`NIGERIAN_STATES`, `findMatchingLga`) | Guarantees standard naming across all 36 states + FCT and 774 LGAs with zero bundle divergence. |
| Postcode Syntax Checking | Custom inline regex | `@ng-address/core` (`isValidPostcodeFormat`) | Centralizes NDAPS digital and traditional 6-digit regex validation rules. |
| Error Code Translation | Hardcoded strings | `@ng-address/core` (`AddressError`, `AddressErrorCode`) | Provides consistent human-readable messaging for timeouts, 401s, 429 rate limits, and 404s. |

## Common Pitfalls

### Pitfall 1: Leaking Provider Credentials to the Browser
**What goes wrong:** Developers configure an API secret key directly in client React props (`<NigerianAddressInput apiKey="..." />`).
**Why it happens:** Misunderstanding public vs private environments.
**How to avoid:** Enforce `proxyUrl` / server proxy architecture in `@ng-address/react`. Do not accept raw private secret keys in client props.

### Pitfall 2: Broken Keyboard Navigation in Dropdowns
**What goes wrong:** Using `onMouseDown` instead of `onClick`, or failing to prevent default scrolling on `ArrowDown`/`ArrowUp`.
**Why it happens:** Browser default arrow key handling scrolls the viewport.
**How to avoid:** Call `e.preventDefault()` on handled key navigation events inside combobox input `onKeyDown`.

### Pitfall 3: Submitting Enclosing `<form>` on Dropdown Selection
**What goes wrong:** Pressing `Enter` to select a suggested address inadvertently submits the entire user registration / checkout form.
**Why it happens:** `Enter` key presses inside inputs bubble to form submit handlers.
**How to avoid:** Detect when suggestions list is open; on `Enter`, select the active suggestion, close the list, and call `e.preventDefault()` / `e.stopPropagation()`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + `@testing-library/react` + `jsdom` |
| Config file | `vitest.config.ts` |
| Quick run command | `export PATH=$HOME/.bun/bin:$PATH; bun test packages/react` |
| Full suite command | `export PATH=$HOME/.bun/bin:$PATH; bun test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REACT-01 | `<NigerianAddressInput />` detects postcode vs text & toggles manual hierarchy | Unit / Integration | `bun test packages/react/test/input.test.tsx` | ❌ Wave 0 |
| REACT-02 | `useAddressResolution` & `usePostcodeLookup` handle async lifecycle states | Unit | `bun test packages/react/test/hooks.test.tsx` | ❌ Wave 0 |
| REACT-03 | `<AddressConfirmationCard />` & `<AddressConfirmationModal />` display breakdown & trigger accept | Unit / Integration | `bun test packages/react/test/modal.test.tsx` | ❌ Wave 0 |
| REACT-04 | WCAG 2.2 AA ARIA attributes (`combobox`, `listbox`, `dialog`, `aria-live`) present | Unit | `bun test packages/react/test/a11y.test.tsx` | ❌ Wave 0 |
| REACT-05 | Full keyboard navigation (`ArrowUp`/`Down`, `Enter`, `Escape`, `Tab` focus trap) | Unit / Integration | `bun test packages/react/test/keyboard.test.tsx` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `bun test packages/react`
- **Per wave merge:** `bun test`
- **Phase gate:** Full test suite green before verification

### Wave 0 Gaps
- [ ] `packages/react/package.json` & `packages/react/tsconfig.json` & `packages/react/tsup.config.ts` — package scaffolding
- [ ] `packages/react/test/setup.ts` — Testing library environment setup

## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Client-side credential guard: never store or require secret keys in browser props; communicate exclusively via `proxyUrl` or secure server endpoints. |
| V5 Input Validation | yes | Offline sanitize & validate postcodes via `@ng-address/core` before network dispatch; escape rendering in DOM. |

### Known Threat Patterns for React Web Applications
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS Injection via address strings | Tampering | React JSX automatic escaping; avoid `dangerouslySetInnerHTML`. |
| API Key Exposure in Client Bundle | Information Disclosure | Architectural constraint: proxy endpoint architecture (`proxyUrl`). |
| Uncontrolled Keystroke Flooding | Denial of Service | Configurable debounce (default 300ms) and `AbortController` cancellation on in-flight requests. |

## Sources

### Primary (HIGH confidence)
- React 18/19 documentation on hooks, portals, and context.
- W3C WAI-ARIA 1.2 Authoring Practices Guide: Combobox Pattern & Modal Dialog Pattern.
- `@ng-address/core` source code for state/LGA taxonomy and validation functions.

## Metadata
**Confidence breakdown:**
- Standard stack: HIGH
- Architecture: HIGH
- Accessibility: HIGH

**Research date:** 2026-10-02
**Valid until:** 2026-11-02
