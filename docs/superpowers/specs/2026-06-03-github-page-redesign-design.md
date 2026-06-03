# MIYO GitHub Pages Landing Page Redesign Design

Date: 2026-06-03
Target: `/index.html`

## Goal

Reimagine the main MIYO GitHub Pages landing page as a polished Android product landing page. The redesign should make MIYO feel professional, engineered, and user-facing while preserving factual project information and existing release links.

## Scope

Modify primarily:

- `index.html`
- `styles.css`

Preserve:

- Existing screenshot assets under `assets/screenshots/`
- Existing app icon and SVG icon sprite
- Existing subpages and routes
- Existing `script.js` behavior for theme switching, sidebar navigation, and carousel controls
- Current factual links, including the v0.0.5 APK URL, docs route, and GitHub route
- Local AI assistant artifacts must stay untracked and out of `main`, including `.claude/`, `.remember/`, `CLAUDE.md`, and related local-only files

## Page Architecture

The new `/index.html` will use this structure:

1. **Hero**
   - Position MIYO as an Android reader for people who want ownership and offline reliability.
   - Use concise product copy and three CTAs: download APK, read docs, and GitHub.
   - Show real MIYO screenshots inside layered Android phone frames.

2. **Trust / release facts strip**
   - High-signal metadata only: Android 5.0+, GPLv3, GitHub Releases, and package name.
   - No invented usage numbers or fake statistics.

3. **Product promise section**
   - Three editorial blocks:
     - Offline-first reading
     - Source and plugin boundaries
     - Transparent release assets
   - Each block explains a real user/project benefit.

4. **Screenshot gallery**
   - Use existing screenshot assets as real app evidence.
   - Display screenshots inside custom Android phone UI templates.
   - Keep labels short and tied to actual app surfaces: History, Favorites, Title details, Explore, Feed.

5. **Architecture section**
   - Replace the current simple architecture list with a more deliberate system diagram.
   - Show how the library, reader core, download worker, source layer, native helpers, and GitHub releases relate.
   - Use a technical dark panel with rails and nodes rather than generic cards.

6. **Final CTA**
   - Reinforce download, docs, and GitHub actions.
   - Keep hosting disclaimer clear: the website does not host manga, mirrors, or third-party source catalogs.

## Visual Direction

Use a refined dark editorial Android-product aesthetic.

- **Base colors:** deep ink and charcoal.
- **Accent colors:** existing MIYO lavender/purple used sparingly, plus a warm parchment accent for library/reader cues.
- **Typography:** dependency-free typography with large serif display headlines, clean sans body text, and compact mono metadata.
- **Phones:** custom Android phone frames with black bezels, screenshot clipping, glass highlights, and gesture bars.
- **Architecture diagram:** thin rails, numbered nodes, understated glow, and strong spacing.
- **Motion:** one controlled page-load reveal and subtle hover polish. Respect reduced-motion preferences.

Avoid:

- Fake metrics
- Decorative emoji
- Generic dashboard cards
- Purple-gradient AI slop
- SVG-drawn fake app screens
- New heavy dependencies or frameworks

## Accessibility and Responsiveness

- Preserve skip link, semantic headings, and meaningful alt text.
- Keep CTAs visible and tap-friendly.
- Desktop: split editorial hero and layered phone showcase.
- Tablet/mobile: stack sections and make phone groups horizontally scrollable where useful.
- Maintain readable contrast in both existing theme modes or provide page-specific variables that still work with the existing theme system.
- Keep `prefers-reduced-motion` support.

## Verification Plan

Before completion and push:

1. Load the static site locally.
2. Verify `/index.html` in a browser using Playwright or equivalent.
3. Check for console errors.
4. Inspect desktop and mobile screenshots.
5. Confirm download/docs/GitHub links remain correct.
6. Commit and push to `origin/main` only after verification passes.

## Self-Review

- No placeholders remain in this spec.
- Scope is limited to the landing page and its CSS support.
- The design uses existing real screenshots rather than invented imagery.
- The design avoids ambiguous metrics and keeps factual claims constrained to existing project information.
- The implementation path is clear enough for a single implementation plan.
