# jc-tailwind-ui

A reusable **Tailwind v4** styling bundle: JC Foundry design tokens, a semantic
colour system, theme-aware light/dark surfaces, and a thin layer of
Bootstrap-flavoured component classes (`btn`, `card`, `badge`, `alert`, forms,
tables, admin shell) — **without** a Bootstrap dependency.

Drop it into any project, override colours in one declarative file, and compile
to a single CSS file.

> Tailwind **v4, CSS-first, no SCSS**. See `Tailwind UI Plan.md` for the full
> design rationale and locked-in decisions (§21).

---

## Quick start

```bash
npm install
npm run build          # -> dist/jc-tailwind-ui.css
npm run dist           # + minified build
```

### Use it in an app

Author **one** entry file — the bundle, then your theme overrides:

```css
/* input.css */
@import "jc-tailwind-ui";     /* tokens, colours, theme plumbing, components */
@import "./theme.css";        /* your overrides + new colours (values only) */
@source "./**/*.html";        /* or *.cshtml — tell Tailwind what to scan */
```

```bash
tailwindcss -i ./input.css -o ./wwwroot/css/site.css --minify
```

Copy `src/templates/custom.css` as your `theme.css` starting point.

---

## Colour system

Semantic colours, not raw brand colours. Write `btn-primary` / `bg-surface`, not
`bg-blue-600 dark:bg-gray-950` — so the same markup re-skins per project.

**Brand colours** ship with explicit `-light` / `-dark` variants. There is **no
automatic shade generation** — override or add each variant explicitly:

```css
@theme {
  --color-primary: #0d9488;          /* changes bg-/text-/border-/ring-primary */
  --color-primary-dark: #0f766e;

  --color-monappoly: #b91c1c;        /* new colour -> full utility set, no variants */
}
```

**Colour variants ≠ theme modes.** `primary-light`/`primary-dark` are fixed
shades. The *page theme* (light/dark) flips the semantic surface/content tokens:

| Token | Light | Dark |
|---|---|---|
| `surface`, `surface-muted`, `surface-raised` | light backgrounds | dark backgrounds |
| `content`, `content-muted` | dark text | light text |
| `border`, `border-muted` | light border | subtle dark border |

Dark mode is **class-based** — toggle `.dark` on `<html>`:

```js
document.documentElement.classList.toggle('dark');
```

---

## Structure

```
src/
  styling.css          # bundle entry (import this)
  tokens.css           # radius / shadow / JC tokens
  colors.css           # default brand colours + variants
  theme.css            # light/dark surface plumbing + .dark variant
  utilities.css        # custom @utility helpers
  components.css        # aggregates component partials:
  components/
    buttons.css cards.css badges.css alerts.css
    forms.css tables.css layout.css admin.css
  templates/
    custom.css         # copy this into your app as theme.css
examples/
  static-html/         # runnable demo (npm run example:html)
  aspnet-razor/        # Razor + ASP.NET validation wiring
dist/                  # compiled bundle (npm run dist)
```

---

## Components

`btn` (+ `btn-primary/secondary/accent/success/warning/danger/info`, `btn-ghost`,
`btn-outline-*`, sizes `btn-xs…btn-xl`, `btn-loading`) · `card` (+ header/body/footer,
`card-muted/raised/primary/danger`) · `badge-*` · `alert-*` · forms
(`form-group`, `form-label`, `form-help`, `form-error`, `input`, `select`,
`textarea`, `checkbox`, `radio`, plus ASP.NET `input-validation-error` /
`validation-summary`) · `table` (+ `table-striped/compact`) · layout (`page-shell`,
`section`, `navbar`, `sidebar`, `empty-state`) · admin (`admin-shell`,
`admin-sidebar`, `admin-topbar`, `admin-content`, `admin-card`, `admin-grid`,
`stat-card`).

Raw Tailwind utilities always work and win on order — components live in
`@layer components`.

---

## Scripts

| Script | Does |
|---|---|
| `npm run build` | Compile `src/styling.css` → `dist/jc-tailwind-ui.css` |
| `npm run build:min` | Minified build |
| `npm run dist` | Both of the above |
| `npm run watch` | Rebuild the bundle on change |
| `npm run example:html` | Watch-build the static-html demo |
