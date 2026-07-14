# Quick start — using jc-tailwind-ui in an app

How to consume the bundle in an ASP.NET (Razor Pages / MVC) or static app. The
bundle is **source** that compiles *into* your app's single CSS file with
Tailwind v4 — so the app needs a small Node build step and gets the components
**plus** the Tailwind utilities its own markup uses.

```
your markup ┐
the bundle  ├─►  Tailwind CLI  ─►  wwwroot/css/site.css  ─►  <link> in _Layout
theme.css   ┘
```

---

## Prerequisites

- **Node.js 18+** (build-time only — your published app doesn't need Node).
- An app repo (this guide assumes ASP.NET; a static site is the same minus the Razor bits).

---

## 1 · Add the bundle as a git submodule

From the **root of your app repo**:

```bash
git submodule add https://github.com/JC-Foundry/Tailwind-UI.git vendor/jc-tailwind-ui
git commit -m "Add jc-tailwind-ui bundle (submodule)"
```

This pins the bundle at a specific commit under `vendor/jc-tailwind-ui`.

> Cloning your app later? Use `git clone --recurse-submodules …`, or run
> `git submodule update --init --recursive` in an existing clone.

---

## 2 · Add the Tailwind build

In your app root, if you don't already have one:

```bash
npm init -y
npm install -D tailwindcss @tailwindcss/cli
```

Add two scripts to `package.json`:

```json
{
  "scripts": {
    "css:build": "tailwindcss -i ./Styles/site.css -o ./wwwroot/css/site.css --minify",
    "css:watch": "tailwindcss -i ./Styles/site.css -o ./wwwroot/css/site.css --watch"
  }
}
```

---

## 3 · Author one entry file — `Styles/site.css`

Copy `vendor/jc-tailwind-ui/src/templates/app.css` to `Styles/site.css` and set
your brand colours. Minimal version:

```css
/* 1 · the bundle (Tailwind + core + components + motion) */
@import "../vendor/jc-tailwind-ui/src/index.css";
/* optional interactive component CSS (modals, dropdowns, toasts, …) */
@import "../vendor/jc-tailwind-ui/src/interactive/interactive.css";

/* 2 · scan your markup so Tailwind generates the utilities you use */
@source "../Pages/**/*.cshtml";
@source "../Areas/**/*.cshtml";
@source "../Views/**/*.cshtml";

/* 3 · your brand — override only what you change */
@theme {
  --color-primary: #2563eb; --color-primary-light: #5c8bf0; --color-primary-dark: #1e40af; --color-primary-fg: #fff;
  /* add secondary / tertiary / info similarly, and any custom colours */
}

/* 4 · the app accent (drives every untoned component) */
:root { --accent: var(--color-primary); --accent-fg: var(--color-primary-fg); }

/* 5 · a custom colour? one tone rule unlocks every treatment for it */
/* .tone-brand { --t: var(--color-brand); --t-l: …; --t-d: …; --t-fg: …; } */
```

Adjust the `@import`/`@source` paths to wherever `Styles/` sits relative to the
submodule and your views.

---

## 4 · Build the CSS

```bash
npm run css:watch     # during development (rebuilds on change)
npm run css:build     # one-off production build (minified)
```

Output lands at `wwwroot/css/site.css`.

---

## 5 · Reference it once in `_Layout.cshtml`

```html
<link rel="stylesheet" href="~/css/site.css" asp-append-version="true" />
```

Dark theme applies to `<body>` automatically. For per-request accent theming
(multi-tenant / per-area brand), set it on the body:

```html
<body style="--accent:@Model.Accent; --accent-fg:#fff;">
```

---

## 6 · (Optional) wire the JavaScript

Only needed for behavioural widgets (modals, dropdowns, tabs, accordion,
offcanvas, popovers, toasts, back-to-top) and the motion drivers. The files are
plain ES modules with no dependencies.

Copy the ones you want into `wwwroot/js/` (or add a copy step), then:

```html
<script type="module">
  import { initUI } from "/js/ui.js";
  import { initReveal } from "/js/reveal.js";
  import { initScrollytell } from "/js/scrollytell.js";
  initUI(); initReveal(); initScrollytell();
</script>
```

Source modules live at `vendor/jc-tailwind-ui/src/interactive/ui.js`,
`…/src/motion/reveal.js`, `…/src/motion/scrollytell.js` (also pre-copied under
the bundle's `dist/`). CSS-only components need none of this.

For flicker-free reveal, add the tiny head snippet documented in `reveal.js`.

---

## 7 · Use the classes

```html
<button class="btn btn-primary">Save</button>          <!-- Bootstrap-style shorthand -->
<button class="btn btn-solid tone-brand">Custom</button><!-- tone engine (any colour) -->
<div class="card"><div class="card-header">…</div></div>
<div class="alert alert-success">Saved.</div>
```

Naming is Bootstrap-guessable: `navbar`, `nav-link`, `dropdown-menu`,
`form-control`, `list-group`, `progress-bar`, `accordion-item`, `nav-tabs`,
`offcanvas`… Built-in colours use `-primary`/`-danger` suffixes; custom colours
use `tone-*`.

---

## Updating the bundle later

```bash
git -C vendor/jc-tailwind-ui pull origin main   # or: git submodule update --remote
git add vendor/jc-tailwind-ui
git commit -m "Update jc-tailwind-ui"
npm run css:build
```

---

## Source vs. prebuilt `dist/`

- **Compile from source (this guide)** — you get components **and** the Tailwind
  utilities your markup uses. The intended path.
- **Just `<link>` `dist/jc-tailwind-ui.css`** — has the components/tokens but
  **not** raw utilities for your pages (`flex`, `grid`, `mt-4`…), because it was
  built without seeing your markup. Only fine if you never use raw utilities.
