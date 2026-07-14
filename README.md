# jc-tailwind-ui

A reusable **Tailwind v4** design system built on one idea: **colour is
decoupled from treatment.** A `tone` sets the colour; a `treatment` (button,
badge, card, gradient, hero…) consumes it. So **any colour — built-in or
custom — composes with every component**, and switching a whole app's accent
is one variable.

Drop it into an app, declare your brand colours, compile one CSS file. Dark
theme today; light mode is a planned v2 (surfaces are already tokenised for it).

---

## The core idea: tone + treatment

```html
<!-- treatment = shape/behaviour · tone = colour -->
<button class="btn btn-solid tone-primary">Save</button>
<button class="btn btn-solid tone-danger">Delete</button>

<div class="hero tone-success">…</div>        <!-- a green hero            -->
<div class="gradient tone-monappoly">…</div>   <!-- a custom-colour gradient -->
<button class="btn-hero">Get started</button>  <!-- no tone → the app accent  -->
```

- **Treatments** (`.btn-solid`, `.btn-outline`, `.btn-soft`, `.badge-solid`,
  `.badge-soft`, `.chip-accent`, `.card-accent`, `.alert-accent`, `.gradient`,
  `.hero`, `.icon-tile`…) name **no colour**. They read the current tone:
  `--t` / `--t-l` / `--t-d` / `--t-fg`.
- **Tones** (`.tone-primary`, `.tone-success`, `.tone-danger-dark`, …) set those
  four vars. Add `[-light|-dark]` for a shade.
- **No tone?** The treatment falls back to the app **accent** (`--accent`), so
  unclassed components auto-theme.

### Any colour, including custom

Every `--color-x` in `@theme` generates Tailwind's utility set. To make a
**new** colour work with every *treatment*, add **one** tone rule:

```css
@theme { --color-monappoly: #b91c1c; --color-monappoly-light: #f87171; --color-monappoly-dark: #7f1d1d; --color-monappoly-fg: #fff; }
.tone-monappoly { --t: var(--color-monappoly); --t-l: var(--color-monappoly-light); --t-d: var(--color-monappoly-dark); --t-fg: var(--color-monappoly-fg); }
```

Now `.btn-solid.tone-monappoly`, `.hero.tone-monappoly`, `.gradient.tone-monappoly`
all just work — no component edits.

### The accent — one dynamic colour for everything

`--accent` is the default tone. Set it statically, or **per request** for
multi-tenant theming:

```css
:root { --accent: var(--color-primary); --accent-fg: var(--color-primary-fg); }
```
```html
<body style="--accent:#b91c1c; --accent-fg:#fff;">  <!-- re-themes the whole page -->
```

`--accent` can be **any** colour; its light/dark shades are derived with
`color-mix`, so even a colour with no `-light/-dark` defined works everywhere.

---

## Quick start

```bash
npm install
npm run dist            # -> dist/jc-tailwind-ui.css (+ .min, + ui.js)
```

In an app, author **one** entry file (copy `src/templates/app.css`):

```css
@import "jc-tailwind-ui";                 /* Tailwind + core + motion */
/* @import "jc-tailwind-ui/interactive";  ← optional behavioural components */
@source "./**/*.cshtml";                   /* scan your markup */

@theme { --color-primary: #2563eb; /* …your brand… */ }
:root  { --accent: var(--color-primary); }
```

```bash
tailwindcss -i ./site.css -o ./wwwroot/css/site.css --minify
```

---

## What's in the box

**Core** (always) — `src/core/`
| File | Provides |
|---|---|
| `tokens.css` | fonts, dark surfaces, full semantic colour set (defaults), radii, motion, + scales: elevation, z-index, durations, focus, softness, weights, container/control sizes |
| `accent.css` | `--accent` fallback + the default tone |
| `tones.css` | `.tone-{type}[-light\|-dark]` — the only per-colour code |
| `base.css` | opinionated dark-theme styling for raw HTML tags, forms, tables, ASP.NET validation |
| `treatments.css` | `btn` (solid/outline/soft/sm/lg), `badge`, `chip`, `card`, `icon-tile`, `alert` |
| `shorthands.css` | Bootstrap per-type colour classes: `btn-primary`, `btn-outline-info`, `alert-danger`, `text-bg-success` (built-ins) |
| `gradients.css` | `.gradient` (per-tone) + curated two-colour mixes |
| `hero.css` | `.hero` / `.btn-hero` / `.card-hero` / `.badge-hero` (gradient + glow + pop) |
| `layout.css` | containers (`container`, `-sm/md/lg/xl`), primitives (`stack`, `cluster`, `grid-auto`), `divider`, `page-header`, `app-shell`, `footer`, `full-bleed` |
| `utilities.css` | `text-gradient`, `glass`, `gradient-border`, `elevation-1…5`, `scrim`, `focus-ring` |

**Components** (always) — `src/components/`, using **Bootstrap class vocabulary** so they're guessable:

| File | Classes |
|---|---|
| `nav.css` | `navbar`, `nav`, `nav-link`, `nav-tabs`, `nav-pills`, `tab-content`/`tab-pane`, `breadcrumb`, `btn-group`, `segmented` |
| `dropdown.css` | `dropdown`, `dropdown-toggle`, `dropdown-menu`, `dropdown-item`, `dropdown-divider`, `dropdown-header` |
| `list-group.css` | `list-group`, `list-group-item(-action)`, `-flush`, per-type `list-group-item-success`… |
| `tables.css` | `table`, `table-striped/hover/bordered/sm`, `table-responsive`, sortable header, sticky header |
| `forms.css` | `form-control`, `form-label`, `form-text`, `form-check`, `form-switch`, `form-select`, `form-range`, `input-group`, `form-floating`, `is-valid/is-invalid` |
| `feedback.css` | `progress`/`progress-bar` (+striped/animated), `spinner-border`, `spinner-grow`, `skeleton`, `placeholder` |
| `data.css` | `avatar` (+group/status), `stat`, `timeline`, `kbd`, `empty-state`, `description-list`, `tag` |
| `disclosure.css` | `accordion`, `accordion-item/button/collapse` (JS) + native `<details>` variant |
| `overlay.css` | `tooltip` (CSS `data-tooltip`), `popover`, `offcanvas`, `banner`, `btn-close` |

**Sections** (always) — `src/sections/`: `hero-section`, `section-heading`, `feature`/`feature-grid`, `cta`, `pricing-card`/`pricing-grid`, `testimonial`, `logo-cloud`, `marquee`, `stat-band`, `bento`.

**Motion** (always) — `src/motion/`. Works consistently across Chrome, Firefox
and Safari:

- **`reveal`** — animate elements in as they enter the viewport. Driven by
  `reveal.js` (IntersectionObserver), so it behaves the same everywhere; with
  no JS / under reduced-motion, content is simply visible.
- **`scrollytell`** — pin a section and scrub through scenes. Native pure-CSS
  scroll-driven timelines where supported, with `scrollytell.js` reproducing the
  pinned hold-then-fade for browsers that lack them (Firefox today). No-op where
  native support exists.

```js
import { initReveal } from "jc-tailwind-ui/motion/reveal.js";
import { initScrollytell } from "jc-tailwind-ui/motion/scrollytell.js";
initReveal();
initScrollytell();
```

For reveal with zero first-paint flash, also add a tiny head snippet (see
`reveal.js` header) that sets `.js-reveal` on `<html>` before paint.

**Interactive** (optional) — `src/interactive/`: `interactive.css` + vanilla
ESM `ui.js`. Data-attribute driven, zero dependencies, progressive enhancement.
Behaviours: **modals, offcanvas drawers, dropdowns, tabs, accordions, popovers,
dismissible alerts/banners, back-to-top**, plus toasts, switches, inline-edit,
copy-button and a colour palette picker.

```js
import { initUI, toast } from "jc-tailwind-ui/interactive/ui.js";
initUI();
toast("Saved", { variant: "success" });
```

---

## Naming convention

So you can **guess classes** without reading docs:

- **Structure** uses Bootstrap's vocabulary — `navbar`, `nav-link`, `dropdown-menu`,
  `form-control`, `input-group`, `list-group`, `breadcrumb`, `progress-bar`,
  `accordion-item`, `nav-tabs`, `offcanvas`, `modal-body`, `card-header`…
- **Colour (built-ins)** uses Bootstrap's per-type suffix — `btn-primary`,
  `btn-outline-info`, `alert-danger`, `text-bg-success`, `list-group-item-warning`.
- **Colour (custom, or full flexibility)** uses the tone engine — `.btn.btn-solid.tone-brand`.
  The two coexist: a Bootstrap dev guesses right; custom colours still compose everywhere.

## Roadmap

- **v1** — this: tone/treatment engine + Bootstrap shorthands, full component set,
  marketing sections, motion, optional interactive layer, dark theme.
- **v2** — light mode (redefine the seven `--color-canvas…fg-subtle` surfaces
  under a `.light` selector; tones/treatments need no change), packaging (npm / NuGet RCL).

## Scripts

| Script | Does |
|---|---|
| `npm run build` / `build:min` | Compile `src/index.css` → `dist/jc-tailwind-ui[.min].css` |
| `npm run dist` | Both, plus copy `ui.js` into `dist/` |
| `npm run watch` | Rebuild the bundle on change |
| `npm run example:html` | Watch-build the static-html demo |
