# Ardyn Harness Console — UI/UX & Accessibility Review

**Author:** Jules (UI/UX Engineering Specialist)
**Target App:** `apps/console` (Next.js 15, Tailwind CSS, Dark "Command-Room" Palette)
**Date:** August 2026
**Status:** Comprehensive Per-Page Assessment & Concrete Fix Specification

---

## Executive Summary

The Ardyn Harness Console provides an operator UI for managing and monitoring local-first, approval-gated AI harness runtimes. The visual aesthetic establishes a high-tech "command-room" atmosphere using deep void backgrounds (`#08090d`), signal-cyan accents (`#06b6d4`), and monospace telemetry typography.

This audit evaluates the console across **Visual Hierarchy & Consistency**, **Spacing & Typography**, **Component States (Loading / Empty / Error)**, **Responsive Behavior**, **Accessibility (WCAG 2.1 AA Compliance)**, and **Information Design**.

---

## Global Design & Layout Findings

### 1. Active Navigation Hardcoding
- **Severity:** High (Usability & Accessibility)
- **Finding:** In `layout.jsx`, active nav state is hardcoded (`item.href === "/"`). Navigating to `/trace`, `/federation`, `/runtime`, `/fixtures`, or `/onboarding` leaves the "Dashboard" tab visually highlighted and sets `aria-current="page"` incorrectly on Dashboard.
- **Fix:** Implement a client navigation component (`Navigation.jsx`) using Next.js `usePathname()` to dynamically apply `active` class and `aria-current="page"`.

### 2. Mobile Responsiveness & Navigation Drawer
- **Severity:** High (Responsive / Mobile Usability)
- **Finding:** The sidebar (`nav`) is fixed at `240px` width with `height: 100vh`, non-collapsible. On viewports `< 768px`, main content shrinks or overflows horizontally, rendering the console unusable on mobile devices.
- **Fix:** Add a responsive top header bar with a mobile toggle button and sliding navigation drawer for viewports under `768px`, while preserving the sticky 240px sidebar on desktop (`md:` breakpoint).

### 3. Touch Target Sizes (WCAG 2.1 AA)
- **Severity:** Medium (Accessibility)
- **Finding:** Nav links (`.nav-link`) and action buttons (`.btn-ghost`, `.btn-primary`) have small padding resulting in target heights of ~32px–36px, below the WCAG 2.1 target size minimum of 44×44px.
- **Fix:** Adjust button and nav link minimum target heights to `min-height: 44px` or `padding: 0.625rem 1rem` for mobile touch accessibility.

### 4. Skip Navigation Link
- **Severity:** Medium (Accessibility)
- **Finding:** Keyboard and screen reader users must tab through all navigation links on every page before reaching `<main>` content.
- **Fix:** Add a skip-to-content link (`<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>`).

---

## Per-Page Detailed Critique & Remediation Plan

---

### Page 1: Dashboard (`/`)

#### Findings
1. **Live Feed Interactivity & Filtering:**
   - **Severity:** Medium (Information Design)
   - **Finding:** The Live Session Events feed renders stream events but lacks filter controls by event type (`session_event`, `audit`, `error`) or search by query.
   - **Fix:** Add filter pill buttons (All, Session, Telemetry, Audit) and event count badges.
2. **System Status Cards Contrast & Hierarchy:**
   - **Severity:** Medium (Visual Hierarchy)
   - **Finding:** Status cards display static status text. When `/api/status` is unreachable, the card renders "unavailable" in neutral grey without clear retry or diagnostic guidance.
   - **Fix:** Add visual indicator badges with explicit color semantics (`badge-success`, `badge-danger`) and a manual refresh action button.
3. **SSE Connection State Display:**
   - **Severity:** Low (Usability)
   - **Finding:** Live feed shows a small text indicator for connection status.
   - **Fix:** Add an animated pulse dot for active live feed (`status-dot-success pulse-glow`) and reconnection counter.

---

### Page 2: Trace Viewer (`/trace`)

#### Findings
1. **Static Trace Viewer / Missing Interactive Inspection:**
   - **Severity:** High (Feature Completeness & Information Design)
   - **Finding:** Trace Viewer renders an empty state card with dead non-functional buttons ("Load Transcript", "Replay Last"). Operators cannot inspect or filter actual JSONL trace logs.
   - **Fix:** Build a client trace inspector with sample fixture loader, drag-and-drop file upload, search input, filter by event type (`frame`, `audit`, `kill`), and collapsible JSON tree/raw viewer.
2. **Schema Reference Clarity:**
   - **Severity:** Low (Visual Design)
   - **Finding:** The JSON code block showing `session-transcript-v1` format is static.
   - **Fix:** Add a copy-to-clipboard button and interactive schema inspector toggle.

---

### Page 3: Runtime Control (`/runtime`)

#### Findings
1. **Approval Gate Visual Emphasis:**
   - **Severity:** Medium (Visual Hierarchy & Security Awareness)
   - **Finding:** The security approval gate requirement (`--enable-runtime --approve`) is listed in a card, but lacks interactive copyable CLI invocation blocks and clear visual callouts for safety constraints.
   - **Fix:** Elevate security warning badges with high-contrast amber borders, interactive command copy buttons, and status indicator matrix for kill switch & secret redaction.
2. **CLI Snippet Ergonomics:**
   - **Severity:** Low (Usability)
   - **Finding:** CLI usage examples are in a single code block without individual copy buttons.
   - **Fix:** Provide individual copyable command cards with confirmation tooltips ("Copied!").

---

### Page 4: Federation (`/federation`)

#### Findings
1. **Mesh Topology Visualization:**
   - **Severity:** Medium (Information Design)
   - **Finding:** Federation page displays text lists for peer nodes without status indications, latency telemetry, or protocol transport contract details.
   - **Fix:** Add interactive node status cards showing Matrix/A2A transport details, active message counters, encryption posture, and connectivity state.
2. **Empty / Standalone Node State:**
   - **Severity:** Medium (State Handling)
   - **Finding:** When running standalone (no remote peers connected), the page lacks explanatory text on how to bootstrap federation.
   - **Fix:** Add explicit "Standalone Mode" card with CLI join instructions (`ardyn federation join`).

---

### Page 5: Fixtures (`/fixtures`)

#### Findings
1. **Grid Spacing & Search:**
   - **Severity:** Medium (Information Design)
   - **Finding:** Fixture categories are rendered in a basic grid. There is no search/filter bar to locate specific fixture paths or schema boundaries across the 150+ host policy and schema test files.
   - **Fix:** Add real-time category filter search, total count KPI banner, and path copy buttons.
2. **Category Deep-Link Guidance:**
   - **Severity:** Low (Usability)
   - **Finding:** Path paths are code strings without links to docs or repo test directories.
   - **Fix:** Add interactive file path view modal / copy action for developer convenience.

---

### Page 6: Onboarding (`/onboarding`)

#### Findings
1. **Interactive Quickstart Experience:**
   - **Severity:** Medium (Usability)
   - **Finding:** 5-step integration guide provides command blocks, but users cannot easily copy commands or track step completion.
   - **Fix:** Add interactive "Copy Command" buttons to each step, progress step badges, and interactive manifest generator/validator preview snippet.
2. **SDK Sample Code Syntax Styling:**
   - **Severity:** Low (Visual Hierarchy)
   - **Finding:** Code block uses monochromatic syntax.
   - **Fix:** Enhance code block container with header badges, language tags, and copy buttons.

---

## Action Plan Summary & Priorities

1. **Global Tokens & Layout:** Refactor `globals.css` (tokens, focus states, responsive grid) and `layout.jsx` (active nav highlighting, mobile header/drawer, skip link).
2. **Dashboard & Feed:** Polish `page.jsx` and `events-feed.jsx` with filters, clear status badges, and SSE status indicator.
3. **Trace Viewer:** Turn `trace/page.jsx` into a fully interactive JSONL inspector with sample loader, filtering, and search.
4. **Runtime & Security:** Update `runtime/page.jsx` with interactive CLI copy widgets and security posture metrics.
5. **Federation & Fixtures:** Upgrade `federation/page.jsx` and `fixtures/page.jsx` with search, copy actions, and topology cards.
6. **Onboarding:** Upgrade `onboarding/page.jsx` with step progress, interactive copy actions, and SDK quickstart.
