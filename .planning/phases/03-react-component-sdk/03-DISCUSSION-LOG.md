# Phase 3: React Component SDK - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-02
**Phase:** 3-React Component SDK
**Areas discussed:** Component Styling & Architecture, Input Interaction & Mode Switching, Confirmation UX & Presentation, Backend API Transport & Proxying

---

## Component Styling & Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Hybrid Headless + Default CSS | Headless core logic + polished default stylesheet with CSS variables (data-* attributes, vanilla CSS tokens) | ✓ |
| Tailwind Native | Tailwind-first class props with cn helper | |
| Pure Unstyled Headless | Developer brings all CSS / markup | |

**User's choice:** Hybrid: Headless core logic + polished default stylesheet with CSS variables (e.g. data-* attributes, vanilla CSS tokens) that can be overridden by Tailwind or custom CSS.
**Notes:** Provides out-of-the-box styling while allowing zero-friction customization and framework independence.

---

## Input Interaction & Mode Switching

| Option | Description | Selected |
|--------|-------------|----------|
| Smart Unified Input + Fallback Toggle | Auto-detects postcode vs text with autocomplete and fallback button to manual State/LGA dropdowns | ✓ |
| Segmented Tabs | Explicit tab switcher between Postcode, Free-Text, and Hierarchy | |
| Independent Modular Components | Standalone single-purpose components | |

**User's choice:** Smart unified search input with automatic postcode detection and a fallback button/toggle to manual State/LGA hierarchy selection.
**Notes:** Smart search improves UX for 90% of use cases while manual hierarchy selector guarantees coverage when postcodes or exact street names are unknown.

---

## Confirmation UX & Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Dual Patterns (Card + Modal) | Provide both Inline Confirmation Card and Accessible Modal/Dialog with focus-trapping | ✓ |
| Inline Card Only | Compact expandable card beneath input | |
| Modal Only | Pop-up dialog only | |

**User's choice:** Provide both: Inline Confirmation Card (for checkouts/forms) and Accessible Modal/Dialog with focus-trapping (for popups/wizards).
**Notes:** Enables seamless integration in both inline embedded checkout forms and multi-step modal checkout wizards.

---

## Backend API Transport & Proxying

| Option | Description | Selected |
|--------|-------------|----------|
| React Context + Prop Overrides | `<AddressConfigProvider />` + component/hook prop overrides (`proxyUrl`, custom `resolveAddress`) | ✓ |
| Prop-Based Only | Pass proxyUrl / fetcher to every component directly | |
| Direct Publishable Key | Client-side publishable key auth | |

**User's choice:** React Context (<AddressConfigProvider />) + Component Prop Overrides (supports proxyUrl string, headers, or custom fetcher function).
**Notes:** Ensures NIPOST secret API keys remain strictly server-side behind user-defined proxy endpoints while allowing ergonomic global context configuration.

---

## the agent's Discretion

- Micro-animations and transition durations.
- Debounce intervals for autocomplete typing.
- Default SVG iconography for search, loading spinners, state markers, and verification badges.

## Deferred Ideas

- None — all items stayed strictly within Phase 3 scope.
