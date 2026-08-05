# API reference

Every **custom** class, token and JS hook in jc-tailwind-ui. Stock Tailwind
utilities (`flex`, `gap-2`, `text-sm`…) are **not** listed — they work as normal.

**Colour model (read this first).** Two ways to colour a component:
- **Tone engine** — put a `tone-{type}` on the element; colour-agnostic treatments
  (`btn-solid`, `gradient`, `hero`, `badge-soft`…) read it. Works for **any** colour
  incl. custom. No tone → the app **accent**.
- **Bootstrap shorthands** — `btn-primary`, `alert-danger`, `text-bg-success`… for the
  **8 built-in types only**. Convenience wrappers over the engine.

**Built-in types:** `primary` · `secondary` · `tertiary` · `info` · `success` ·
`warning` · `danger` · `light`. Each has `-light`, `-dark`, `-fg` variants.

**Loading:** core + components + sections + motion are always in the bundle
(`@import "…/src/index.css"`). The **Interactive** layer (§12) is opt-in
(`…/interactive/interactive.css` + `ui.js`).

---

## 1 · Theme tokens (CSS variables)

Override any of these in your app's `@theme` (colours/radii/fonts/motion) or
`:root` (the rest). Colours, radii, fonts and easings also generate matching
Tailwind utilities.

### Colours — semantic types
For each of the 8 types: `--color-{type}`, `--color-{type}-light`,
`--color-{type}-dark`, `--color-{type}-fg`. → utilities `bg-{type}`, `text-{type}`,
`border-{type}`, `ring-{type}`, `bg-{type}-light`, … (also `-fg`).

### Colours — surfaces (theme-aware; the seven that flip in v2 light mode)
| Token | Role |
|---|---|
| `--color-canvas` | page background |
| `--color-surface` | cards / panels |
| `--color-surface-2` | raised / hover surface |
| `--color-edge` | borders / dividers |
| `--color-fg` | primary text |
| `--color-fg-muted` | muted text |
| `--color-fg-subtle` | subtle text / placeholders |

### Accent + tone working vars
| Token | Role |
|---|---|
| `--accent`, `--accent-fg` | app accent (set in `:root` or per-request on `<body>`) |
| `--accent-light`, `--accent-dark` | auto-derived accent shades (color-mix) |
| `--t`, `--t-l`, `--t-d`, `--t-fg` | current tone (set by `tone-*`; defaults to accent) |

### Scales
| Group | Tokens |
|---|---|
| Radii | `--radius-sm` `--radius-md` `--radius-lg` `--radius-xl` `--radius-2xl` `--radius-pill` |
| Fonts | `--font-sans` `--font-mono` |
| Easing | `--ease-pop` `--ease-standard` `--ease-out` |
| Duration | `--duration-fast` `--duration-base` `--duration-slow` |
| Elevation | `--elevation-1` … `--elevation-5` |
| Z-index | `--z-base` `--z-sticky` `--z-drawer` `--z-dropdown` `--z-modal` `--z-popover` `--z-toast` `--z-tooltip` |
| Focus | `--focus-width` `--focus-color` |
| Softness (color-mix %) | `--mix-soft` `--mix-soft-hover` `--mix-subtle` `--mix-outline-hover` `--mix-border` |
| Weights | `--weight-normal` `--weight-medium` `--weight-semibold` `--weight-bold` |
| Containers | `--container-sm` `--container-md` `--container-lg` `--container-xl` |
| Controls | `--control-height` `--control-height-sm` `--control-height-lg` `--control-pad-x` |

---

## 2 · Tone system

| Class | Effect |
|---|---|
| `tone-{type}` | set the palette to a built-in type |
| `tone-{type}-light` / `tone-{type}-dark` | shade variant of that type |
| `tone-accent` | re-pin the palette to the app accent |

Custom colour → add `--color-brand*` in `@theme` and one rule:
`.tone-brand { --t: var(--color-brand); --t-l: …; --t-d: …; --t-fg: …; }`

---

## 3 · Treatments (colour-agnostic — pair with a tone)

| Component | Classes |
|---|---|
| Button | `btn` + `btn-solid` \| `btn-outline` \| `btn-soft`; sizes `btn-sm` `btn-lg`; `disabled` attr |
| Badge | `badge` + `badge-solid` \| `badge-soft` |
| Chip | `chip` + `chip-accent` |
| Card | `card` + `card-accent` |
| Icon tile | `icon-tile` + `icon-tile-lg` |
| Alert | `alert` + `alert-accent` |

---

## 4 · Bootstrap shorthands (built-in types only)

| Pattern | Example |
|---|---|
| `btn-{type}` | `btn btn-primary` |
| `btn-outline-{type}` | `btn btn-outline-info` |
| `btn-soft-{type}` | `btn btn-soft-success` |
| `alert-{type}` | `alert alert-danger` |
| `text-bg-{type}` | `badge text-bg-warning` (solid fill + readable fg) |

---

## 5 · Gradients

- `gradient` — light→base→dark of the current tone.
- Curated fixed-pair mixes: `gradient-primary-info` `gradient-primary-tertiary`
  `gradient-info-tertiary` `gradient-info-secondary` `gradient-warning-danger`
  `gradient-light-secondary` `gradient-primary-secondary` `gradient-success-info`
  `gradient-danger-warning` `gradient-info-primary` `gradient-primary-success`
  `gradient-secondary-primary`.

## 6 · Hero

`hero` (any element) · `btn-hero` · `card-hero` · `badge-hero` — tone gradient +
glow + hover-pop. Colour from the current tone.

---

## 7 · Layout

| Class | Purpose |
|---|---|
| `container` / `container-page` | centred max-width `lg` wrapper |
| `container-sm` `-md` `-lg` `-xl` `-fluid` | width variants |
| `section` | vertical section padding |
| `full-bleed` | break out of a container to full viewport width |
| `stack` | vertical flex flow (`--gap`) |
| `cluster` | horizontal wrap flow (`--gap`) |
| `center-grid` | grid place-items center |
| `grid-auto` / `grid-fit` | auto-fill / auto-fit grid (`--col-min`, `--gap`) |
| `divider` / `divider-label` | horizontal rule / rule with centred label |
| `page-header` + `page-header__title` `__subtitle` `__actions` | title row |
| `app-shell` + `app-shell__sidebar` `__header` `__main`; `is-collapsed` | app frame |
| `footer` | page footer |

## 8 · Utilities

| Class | Effect |
|---|---|
| `text-gradient` | clip current tone gradient to text |
| `glass` | frosted translucent panel (needs a backdrop) |
| `gradient-border` | tone gradient border, surface fill |
| `elevation-1` … `elevation-5` | tokenised shadow scale |
| `scrim` | dark gradient overlay for text-over-media |
| `focus-ring` | themed focus ring on `:focus-visible` |

---

## 9 · Components

### Navigation
| Class | Notes |
|---|---|
| `navbar` + `navbar-brand` `navbar-nav` | top bar |
| `nav` + `nav-item` `nav-link` | base nav; link states `active` `disabled` |
| `nav-tabs` | underline tabs |
| `nav-pills` | pill tabs |
| `tab-content` > `tab-pane` (`active`) | tab panels (JS) |
| `breadcrumb` + `breadcrumb-item` (`active`) | breadcrumbs |
| `btn-group` | joined buttons (add `data-toggle` for active toggle) |
| `segmented` | pill segmented control (active toggles via JS) |

### Dropdown *(JS)*
`dropdown` · `dropdown-toggle` · `dropdown-menu` (+ `dropdown-menu-end`) ·
`dropdown-item` (+ `active` `disabled` `danger`) · `dropdown-divider` · `dropdown-header`

### List group
`list-group` (+ `list-group-flush`) · `list-group-item` (+ `list-group-item-action`,
states `active` `disabled`) · per-type `list-group-item-{type}`

### Tables
`table` + `table-striped` `table-hover` `table-bordered` `table-sm` `table-sticky`
`table-responsive`; sortable header `th.sortable` (+ `asc` / `desc`)

### Forms
| Class | Notes |
|---|---|
| `form-group` | field wrapper |
| `form-label` (+ `.required`) | label |
| `form-text` | help text |
| `form-control` (+ `form-control-sm` `-lg`) | input / textarea |
| `form-select` | select |
| `form-check` (+ `form-check-inline`) with `form-check-input` `form-check-label` | checkbox / radio |
| `form-switch` | toggle-style checkbox |
| `form-range` | range slider |
| `input-group` + `input-group-text` | prefix/suffix add-ons |
| `form-floating` | floating label |
| Validation | `is-valid` `is-invalid` + `valid-feedback` `invalid-feedback` |
| ASP.NET | `input-validation-error` `field-validation-error` `validation-summary-errors` `validation-summary-valid` |

### Feedback
`progress` > `progress-bar` (+ `progress-bar-striped` `progress-bar-animated`;
tone-able) · `spinner-border` · `spinner-grow` (+ `spinner-sm`) · `skeleton`
(+ `skeleton-text` `skeleton-circle`) · `placeholder` (+ `placeholder-glow`)

### Data display
| Class | Notes |
|---|---|
| `avatar` (+ `avatar-sm` `avatar-lg`) | avatar |
| `avatar-group` | overlapped stack |
| `avatar-status` (+ `offline` `busy`) | status dot |
| `stat` + `stat-label` `stat-value` `stat-trend` (+ `up` `down`) | KPI tile |
| `timeline` + `timeline-item` `timeline-time` | timeline (item tone-able) |
| `kbd` | keyboard key |
| `empty-state` + `empty-state__icon` | empty state |
| `description-list` | `dt`/`dd` grid |
| `tag` + `tag__remove` | removable tag |

### Disclosure *(JS or native)*
`accordion` · `accordion-item` · `accordion-button` (+ `collapsed`) ·
`accordion-collapse` (+ `show`) · `accordion-body`.
Zero-JS variant: `details.accordion-item > summary`.

### Overlays
| Class / attr | Notes |
|---|---|
| `btn-close` | shared × close button |
| `[data-tooltip]` (+ `data-tooltip-pos="top\|bottom"`) | pure-CSS tooltip |
| `popover` + `popover-header` `popover-body` (+ `show`) | *JS* |
| `offcanvas` + `offcanvas-start\|end\|top\|bottom`, `offcanvas-backdrop`, `offcanvas-header` `offcanvas-title` `offcanvas-body` (+ `show`) | drawer *JS* |
| `banner` | announcement bar |
| `alert-dismissible` | alert with a `btn-close` |

---

## 10 · Marketing sections

| Block | Classes |
|---|---|
| Hero | `hero-section` + `__eyebrow` `__title` `__lead` `__actions` |
| Heading | `section-heading` (+ `center`) + `__eyebrow` `__lead` |
| Features | `feature-grid` > `feature` + `__icon` `__title` `__text` |
| CTA | `cta` + `__title` `__text` |
| Pricing | `pricing-grid` > `pricing-card` (+ `featured`) + `__name` `__price` `__features` |
| Testimonial | `testimonial` + `__quote` `__author` `__name` `__role` |
| Logos | `logo-cloud` |
| Marquee | `marquee` > `marquee__track` |
| Stats | `stat-band` |
| Bento | `bento` > items + `bento-2x1` `bento-2x2` `bento-1x2` |

---

## 11 · Motion

| Class | Notes |
|---|---|
| `reveal` (+ `reveal-fade` `reveal-rise` `reveal-scale` `reveal-left` `reveal-right`) | animate in on scroll (**scrubbed** — tracks scroll position) |
| `reveal-stagger` | cascade children by inline `--i` |
| `scrollytell` > `scrollytell-stage` > `scene` | pinned scroll story (`--scenes`); scene hand-over is **triggered**, not scrubbed |
| `scene-centred` | opt-in centred-block look for a scene (centres, gaps, pads). Omit it and the scene lays itself out |

**Reveal is scrubbed; scrollytell is not.** Reveal ties the animation to scroll
position, so it plays backwards as you scroll up. Scrollytell marks one scene
`.is-active` and lets a CSS transition run on its own clock, so a small scroll across
a boundary completes the whole hand-over rather than leaving two scenes half-faded.

`scrollytell` state, set by `initScrollytell()` on each section:

| Hook | Meaning |
|---|---|
| `.scrollytell--js` | the driver has initialised; everything pinned/faded hangs off this |
| `.scene.is-active` | the scene the viewport is currently in |
| `.is-pinned` | set while the stage is stuck to the top — pair with `html:has(.scrollytell.is-pinned) …` to move fixed furniture out of the way |
| `--p` | 0…1 scroll progress, for anything that *should* track scroll (a rail, a marker) |

Vars: `--reveal-distance` `--reveal-scale-from` `--reveal-range` · `--scene-fade`
(hand-over duration, default `0.5s`). `js-reveal` is added automatically where reveal
needs its JS path.

Events: `scrollytell:change` on the section — `detail = { index, scenes, progress }`.

JS: `initReveal()` — no-op where native scroll-driven animation exists.
`initScrollytell()` — **drives every browser**; no-op only under
`prefers-reduced-motion`, which leaves scenes as plain stacked blocks.

---

## 12 · Interactive (opt-in layer)

### Classes
| Class | Notes |
|---|---|
| `modal-backdrop` + `modal` (+ `modal--lg`) + `modal__title` `__body` `__actions` | modal (`open`) |
| `toast-host` + `toast` (+ `toast--success` `toast--danger`) | toasts |
| `pagination` + `page-item` (`active` `disabled`) `page-link` | pagination |
| `switch` (+ `switch--on`) | legacy toggle |
| `edit-field` + `edit-field__view` `edit-field__form` (`editing`) | inline edit |
| `copy-btn` · `icon-btn` | copy affordance · borderless icon button |
| `palette` + `swatch` (`swatch--active`) | colour picker |
| `back-to-top` (`show`) | scroll-to-top button |

### JavaScript API (`ui.js`)
`initUI()` · `toast(msg, {variant, timeout})` · `openModal(id)` / `closeModal(el)` ·
`openOffcanvas(id)` / `closeOffcanvas()`

### Data-attribute API (wired by `initUI()`)
| Attribute | Does |
|---|---|
| `data-modal-open="ID"` / `data-modal-close` | open / close a modal (backdrop + Esc also close) |
| `data-offcanvas-open="ID"` / `data-offcanvas-close` | open / close a drawer |
| `data-dropdown-toggle` *(or `.dropdown-toggle`)* | toggle the dropdown menu |
| `data-popover-toggle="#ID"` | toggle a popover |
| `data-tab-target="#PANE"` | activate a tab |
| `data-dismiss[="#ID"]` | remove the nearest `.alert`/`.banner` (or target) |
| `data-copy="TEXT"` | copy to clipboard (+ toast) |
| `data-edit-start` / `data-edit-cancel` | inline-edit show / restore |
| `data-swatch="VALUE"` + `data-palette-input` | palette pick → hidden input |
| `data-toggle` (on `.btn-group`) | make the group's buttons single-select |
| `data-back-to-top` | scroll to top (button auto-shows past 400px) |

Custom events: `switch:change`, `palette:change`, `segment:change`.
