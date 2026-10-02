---
last_mapped_commit: 8ee1b9954b829144762fbb96036eb9d62ea0347b
last_mapped_at: 2026-10-02
---
# Coding Conventions & Standards

**Analysis Date:** 2026-10-02

## Code Style & Language Rules

- **TypeScript Strictness:** Strict mode (`"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`) enforced across all packages.
- **Explicit Types:** Exported functions and public API methods must have explicit return type annotations and JSDoc documentation.
- **Immutability & Pure Functions:** Core normalization and parsing functions must be pure, deterministic, and free of side effects.
- **No Direct Secrets in Code:** Configuration and API keys must always be passed via options objects or environment variables; never hardcoded.

## Architectural Guidelines

- **Provider Neutrality:** The core library must not import provider-specific SDKs or code. All provider logic resides in adapter packages.
- **Provenance by Design:** When returning or transforming addresses, preserve source metadata (`FieldSource`: `source: "user" | "nipost" | "osm" | "derived"`).
- **Conservative Normalization:** Never guess or extrapolate address details without concrete evidence. When uncertain, retain raw input and mark status as `UNRESOLVED` or `PARTIAL`.
- **Structured Error Handling:** All internal errors must be mapped to typed `AddressError` instances with standardized error codes and actionable messages.

## UI & Accessibility Conventions (`@ng-address/react`)

- **WCAG 2.2 AA Compliance:**
  - Standard ARIA attributes (`aria-expanded`, `aria-autocomplete`, `aria-describedby`) for address comboboxes and input fields.
  - Full keyboard navigability (Arrow keys, Enter, Escape, Tab).
  - Clear visual focus states and contrast ratios exceeding 4.5:1.
  - No color-only status indicators; pair colors with descriptive icons and text labels.
- **Headless & Flexible Styling:** Provide unstyled, composable primitives with sensible default styling hooks (compatible with Tailwind CSS and CSS Modules).

## Versioning & Git Commits

- **Semantic Versioning:** SemVer (`major.minor.patch`) across all `@ng-address/*` packages.
- **Conventional Commits:**
  - `feat:` New features or user-facing capabilities
  - `fix:` Bug fixes
  - `docs:` Documentation updates
  - `test:` Test suites and fixtures
  - `refactor:` Code refactoring without behavior change
  - `chore:` Build scripts, dependencies, configuration

---

*Conventions analysis: 2026-10-02*
*Update when coding standards evolve*
