# JC Tailwind UI Bundle Plan

## 1. Goal

Create a reusable Tailwind-based styling bundle that can be dropped into any project and compiled into that project's final CSS.

The bundle should provide:

- Tailwind defaults.
- JC Foundry design tokens.
- A default semantic colour system.
- Optional project-level colour overrides.
- Optional project-level new colours.
- Reusable component classes built on top of Tailwind utilities.
- A simple consuming-project entry file, such as `custom.scss` or `custom.css`.

The goal is not to recreate Bootstrap. The goal is to keep Tailwind's utility-first workflow while adding a thin, reusable JC Foundry layer for common UI patterns.

---

## 2. Core Direction

Use Tailwind as the foundation and add a custom design-system layer on top.

The preferred long-term model is:

```text
Tailwind core
+ JC design tokens
+ JC semantic colours
+ JC custom utilities
+ JC component classes
+ consuming app overrides
= final project CSS
```

The consuming app should be able to import the default bundle, override selected values, add new colours, and compile one final CSS file.

---

## 3. Important Tailwind Direction

Tailwind v4 is CSS-first. The bundle should avoid relying too heavily on Sass-style variable maps for the Tailwind layer.

SCSS can still be used by consuming projects if useful, but the Tailwind-facing configuration should be based around CSS imports, theme variables, CSS variables, and Tailwind-compatible directives.

This avoids building the system around an older Tailwind v3-style `tailwind.config.js` mindset.

Practical implication:

- Keep Tailwind theme/token definitions in CSS-compatible files.
- Use SCSS only where it genuinely helps the project.
- Do not make Sass maps the main source of truth for Tailwind colours.
- Do not require heavy JavaScript config unless there is a clear need later.

---

## 4. Non-Goals

This bundle should not try to be:

- A full Bootstrap clone.
- A huge UI framework.
- A replacement for every Tailwind utility.
- A complex design-token engine.
- A public polished package from day one.
- A system that automatically generates colour variants from one base colour.

The first version should be simple, predictable, and easy to copy into projects.

---

## 5. Colour System

### 5.1 Colour Philosophy

Use semantic colours rather than raw brand colours everywhere.

For example, prefer:

```html
<button class="btn btn-primary">Save</button>
```

rather than:

```html
<button class="bg-blue-600 text-white">Save</button>
```

This allows each project to redefine what `primary` means without changing markup.

---

### 5.2 Default Colour Tokens

The bundle should ship with default values for the core colours.

Initial semantic colours:

```text
primary
secondary
accent
success
warning
danger
info
surface
surface-muted
surface-raised
content
content-muted
border
border-muted
```

Brand-style colours should also have explicit variant tokens:

```text
primary
primary-light
primary-dark
secondary
secondary-light
secondary-dark
accent
accent-light
accent-dark
success
success-light
success-dark
warning
warning-light
warning-dark
danger
danger-light
danger-dark
info
info-light
info-dark
```

No automatic `-light` or `-dark` generation is required.

If a consuming app wants to change a colour's light or dark variant, it must explicitly define that variant.

---

### 5.3 Default Variant Rule

The bundle provides default `-light` and `-dark` values for built-in colours.

Example:

```css
--color-primary: ...;
--color-primary-light: ...;
--color-primary-dark: ...;
```

A consuming app can override only the values it cares about.

Example:

```css
--color-primary: ...;
--color-primary-light: ...;
--color-primary-dark: ...;
```

If the consuming app only overrides `--color-primary`, the default `--color-primary-light` and `--color-primary-dark` still remain in use.

That is acceptable and intentional.

---

### 5.4 Adding New Colours

A consuming app can add new project-specific colours.

Example:

```css
--color-monappoly: ...;
--color-monappoly-light: ...;
--color-monappoly-dark: ...;
```

The key rule:

> New colours do not automatically get `-light` or `-dark` variants. If the project wants those variants, it must define them explicitly.

This keeps the system predictable and avoids complicated colour generation logic.

---

### 5.5 Utility Expectations

For each available colour token, the project should be able to use Tailwind-style utilities such as:

```text
bg-primary
text-primary
border-primary
ring-primary
outline-primary
decoration-primary
shadow-primary
```

For variants:

```text
bg-primary-light
bg-primary-dark
text-primary-light
text-primary-dark
border-primary-light
border-primary-dark
```

The exact utilities generated depend on how the colour tokens are exposed to Tailwind.

---

## 6. Light Mode and Dark Mode

The `-light` and `-dark` colour variants are not the same thing as site light mode and dark mode.

This distinction matters.

### 6.1 Colour Variants

These are colour shades:

```text
primary-light
primary
primary-dark
```

They can be used in either light mode or dark mode.

Example:

```html
<div class="bg-primary-light text-primary-dark">...</div>
```

---

### 6.2 Theme Modes

These control the page theme:

```text
light mode
dark mode
```

Theme mode should mostly affect semantic surface/content tokens.

Example:

```text
surface
surface-muted
surface-raised
content
content-muted
border
border-muted
```

In light mode:

```text
surface = light background
content = dark text
border = light border
```

In dark mode:

```text
surface = dark background
content = light text
border = dark/subtle border
```

---

### 6.3 Preferred Theme-Aware Markup

Prefer this:

```html
<div class="bg-surface text-content border border-border">
  ...
</div>
```

instead of this everywhere:

```html
<div class="bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
  ...
</div>
```

The aim is to make common components automatically theme-aware.

---

## 7. Component Layer

The bundle should include a small component layer that gives Bootstrap-like speed without losing Tailwind flexibility.

Initial components:

```text
btn
card
badge
alert
input
select
textarea
checkbox
radio
form-group
form-label
form-help
form-error
navbar
sidebar
page-shell
section
modal
table
admin-panel
empty-state
stat-card
```

---

### 7.1 Buttons

Button classes should be semantic and predictable.

Examples:

```html
<button class="btn btn-primary">Save</button>
<button class="btn btn-secondary">Cancel</button>
<button class="btn btn-danger">Delete</button>
<button class="btn btn-ghost">Close</button>
<button class="btn btn-outline-primary">Edit</button>
```

Button size variants:

```text
btn-xs
btn-sm
btn-md
btn-lg
btn-xl
```

Button state expectations:

```text
hover
focus-visible
disabled
loading
active
```

---

### 7.2 Cards

Cards should cover common layouts.

Examples:

```html
<div class="card">
  <div class="card-header">...</div>
  <div class="card-body">...</div>
  <div class="card-footer">...</div>
</div>
```

Variants:

```text
card
card-muted
card-raised
card-primary
card-danger
```

---

### 7.3 Badges

Examples:

```html
<span class="badge badge-success">Live</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Failed</span>
```

Variants:

```text
badge-primary
badge-secondary
badge-accent
badge-success
badge-warning
badge-danger
badge-info
badge-muted
```

---

### 7.4 Alerts

Examples:

```html
<div class="alert alert-success">Saved successfully.</div>
<div class="alert alert-danger">Something went wrong.</div>
```

Variants:

```text
alert-info
alert-success
alert-warning
alert-danger
```

---

### 7.5 Forms

Forms should cover the common ASP.NET app use case.

Classes:

```text
form-group
form-label
form-help
form-error
input
select
textarea
checkbox
radio
input-validation-error
validation-summary
```

The form system should work nicely with ASP.NET validation output.

---

### 7.6 Admin UI Components

Because many of the user's projects include admin panels, include admin-focused components early.

Classes:

```text
admin-shell
admin-sidebar
admin-topbar
admin-content
admin-card
admin-grid
admin-table
admin-action-bar
stat-card
stat-value
stat-label
```

This is likely more useful than generic marketing-site components in the first version.

---

## 8. File Structure

Suggested early repo structure:

```text
jc-tailwind-ui/
  README.md
  package.json
  src/
    styling.css
    tokens.css
    theme.css
    colors.css
    utilities.css
    components.css
    components/
      buttons.css
      cards.css
      badges.css
      alerts.css
      forms.css
      layout.css
      admin.css
      tables.css
    templates/
      custom.css
      custom.scss
  dist/
    jc-tailwind-ui.css
    jc-tailwind-ui.min.css
  examples/
    aspnet-razor/
      input.css
      example.cshtml
    static-html/
      index.html
```

Early development can skip `dist/` if the consuming project always compiles from source.

---

## 9. Entry File Design

### 9.1 Bundle Entry

The bundle should have one main entry file.

Example:

```css
@import "tailwindcss";

@import "./tokens.css";
@import "./theme.css";
@import "./colors.css";
@import "./utilities.css";
@import "./components.css";
```

This file represents the default JC Tailwind UI bundle.

---

### 9.2 Consuming App Entry

The consuming project should have its own entry file.

Example:

```css
@import "./vendor/jc-tailwind-ui/src/styling.css";
@import "./custom-overrides.css";
```

Or, for an SCSS-based project:

```scss
@import "./vendor/jc-tailwind-ui/src/styling.css";
@import "./custom-overrides.scss";
```

The exact build order needs testing because Tailwind v4 is CSS-first. The safest approach is to keep Tailwind-specific files as CSS and only use SCSS for project-specific extras that compile cleanly before or alongside Tailwind.

---

## 10. Consuming App Override File

The consuming app should get a template override file.

Example:

```css
/* custom-overrides.css */

@theme {
  --color-primary: ...;
  --color-primary-light: ...;
  --color-primary-dark: ...;

  --color-secondary: ...;
  --color-secondary-light: ...;
  --color-secondary-dark: ...;

  --color-monappoly: ...;
  --color-monappoly-light: ...;
  --color-monappoly-dark: ...;
}

:root {
  --jc-radius-base: ...;
  --jc-shadow-card: ...;
}

.dark {
  --color-surface: ...;
  --color-content: ...;
  --color-border: ...;
}
```

This gives each project a clear place to customize the design without editing the bundle directly.

---

## 11. Build Strategy

### 11.1 Early Development

Start simple:

```text
copy bundle folder into project
edit custom override file
run Tailwind build
output final CSS into wwwroot/css/site.css
```

This is good enough while the bundle changes frequently.

---

### 11.2 Later Options

Once stable, consider packaging as one of:

```text
npm package
Git submodule
Git subtree
NuGet package with static web assets
ASP.NET project template
```

For ASP.NET projects, a NuGet static web asset package could be useful later, but it is probably premature for v1.

---

## 12. ASP.NET Integration Goal

The bundle should work cleanly in Razor Pages / MVC projects.

Desired project structure:

```text
MyProject/
  Styles/
    input.css
    custom-overrides.css
  wwwroot/
    css/
      site.css
  vendor/
    jc-tailwind-ui/
```

Possible build script:

```json
{
  "scripts": {
    "css:build": "tailwindcss -i ./Styles/input.css -o ./wwwroot/css/site.css --minify",
    "css:watch": "tailwindcss -i ./Styles/input.css -o ./wwwroot/css/site.css --watch"
  }
}
```

The final output should be one CSS file referenced by `_Layout.cshtml`.

---

## 13. Naming Direction

Possible package/repo names:

```text
JC.TailwindUI
JC.UI
JC.Frontend
JC.DesignSystem
JC.FoundryUI
JC.WebStyles
jc-tailwind-ui
jc-foundry-ui
```

Best early name:

```text
jc-tailwind-ui
```

Reason:

- Clear.
- Searchable.
- Obvious dependency on Tailwind.
- Does not overclaim as a complete design system yet.

Possible later rename:

```text
jc-foundry-ui
```

---

## 14. Version 1 Scope

The first version should include:

```text
Tailwind import
core colour tokens
theme-aware surface/content tokens
button components
card components
badge components
alert components
basic form components
basic table styling
admin shell primitives
example ASP.NET usage
custom override template
README with usage notes
```

Avoid advanced features until the basics feel good across at least two real projects.

---

## 15. Version 1 Deferred Items

Defer these until later:

```text
automatic colour shade generation
complex JS components
dropdowns
modals with behaviour
tabs with behaviour
toasts with behaviour
NuGet packaging
npm publishing
full documentation site
visual regression testing
component preview site
Figma/design-tool integration
```

The first version should focus on styling, not behaviour.

---

## 16. Suggested First Real Test Projects

Use the bundle in projects with different visual needs:

```text
Portfolio site
Ultimate Monopoly / Monappoly site
Admin-heavy ASP.NET app
Alwaha-style client/restaurant site
```

This will prove whether the colour system is flexible enough.

If it only works for one brand, the abstraction is too narrow.

---

## 17. Risks

### 17.1 Fighting Tailwind

Risk:

Trying to make Tailwind behave exactly like Bootstrap.

Mitigation:

Keep components thin and let Tailwind handle layout, spacing, responsiveness, and one-off styling.

---

### 17.2 Too Many Components Too Early

Risk:

Building a massive UI system before knowing what is actually reused.

Mitigation:

Only add components after they appear in real projects more than once.

---

### 17.3 Colour System Overengineering

Risk:

Trying to build automatic colour intelligence too early.

Mitigation:

Use explicit colour tokens only. Built-in colours get defaults. Project-specific variants must be manually defined.

---

### 17.4 SCSS/Tailwind Build Confusion

Risk:

Mixing Sass and Tailwind incorrectly and creating a fragile build chain.

Mitigation:

Keep Tailwind files CSS-first. Use SCSS only where it does not interfere with Tailwind processing.

---

## 18. Success Criteria

The bundle is successful when:

- A new ASP.NET project can import it quickly.
- The project can override primary/secondary/accent colours without editing bundle files.
- The project can add its own colours explicitly.
- Common buttons/cards/forms/admin panels look good immediately.
- Raw Tailwind utilities still work normally.
- The bundle does not feel bloated.
- The same markup can look different across different branded projects.
- Maintenance is easier than copying old Bootstrap customisations between projects.

---

## 19. Recommended Initial Implementation Order

1. Create repo structure.
2. Add Tailwind build script.
3. Add base `styling.css` entry file.
4. Add default colour tokens.
5. Add light/dark theme surface tokens.
6. Add button components.
7. Add card components.
8. Add badges and alerts.
9. Add basic forms.
10. Add admin shell primitives.
11. Add ASP.NET example.
12. Test in portfolio project.
13. Test in one admin-heavy project.
14. Refine naming and component API.
15. Only then consider packaging.

---

## 20. Final Direction

Build this as a small reusable Tailwind layer, not a full framework.

The strongest version is:

```text
Tailwind for raw power.
JC tokens for consistency.
JC components for speed.
Project overrides for branding.
```

Keep v1 boring, explicit, and easy to reason about.

---

## 21. Confirmed Decisions (2026-07-14)

These decisions are locked in and supersede any conflicting guidance earlier in this document (notably the SCSS references in §3, §8, §9.2 and §10).

### 21.1 Repository Location

The bundle lives in **its own repository** (`jc-tailwind-ui`), **not** as a folder inside the `JC-Packages` .NET monorepo.

Reasons:

- Different ecosystem — `JC-Packages` is a pure NuGet/.NET monorepo with no node toolchain. The bundle is npm/node/Tailwind and would be a foreign body here (`node_modules`, npm lockfile, separate CI, `.gitignore` changes, not part of the `.sln`).
- Different release cadence — the bundle churns fast early (§11.1); the NuGet packages are stable and tagged. Keep the cycles decoupled.
- Cleaner consumption — a standalone repo supports every delivery route (git submodule, subtree, npm, copy-in) without living beside `JC.Core`.

**Deferred, not rejected:** later, a thin **`JC.Web.UI` Razor Class Library** may be added *inside* `JC-Packages` that simply embeds the compiled `dist/jc-tailwind-ui.css` as a static web asset, so `JC.*` consumers can reference it via NuGet like everything else. This is a v2+ concern (§11.2 already calls NuGet packaging premature for v1).

### 21.2 Tailwind + Bootstrap Relationship

**Hybrid in spirit, not in dependencies.**

- **Do NOT** ship Bootstrap CSS alongside Tailwind. Two competing base layers (Bootstrap **Reboot** vs Tailwind **Preflight**) conflict, double the CSS weight, and cause specificity/class-name collisions.
- **DO** provide Bootstrap-flavoured *ergonomics* — semantic component classes (`btn btn-primary`, `card`, `badge`, `alert`, etc.) — built as a thin Tailwind `@layer components` layer on top of utilities. This is already §7.

The goal is Bootstrap-like developer speed and familiarity **without** depending on Bootstrap.

### 21.3 Consuming-App Footprint: One Theme File, No Custom CSS

A consuming app must get **everything it needs** from the bundle and be able to **customise theme colours** and **add new theme colours** without authoring any component or utility CSS.

The realistic minimum footprint for an ASP.NET consumer is **one entry file** plus the Tailwind build step:

```css
/* input.css */
@import "jc-tailwind-ui";   /* everything: tokens, components, utilities, dark-mode plumbing */
@import "./theme.css";       /* app colour overrides + new colours — declarative values only */
```

Because Tailwind v4 auto-generates the full utility set (`bg-`, `text-`, `border-`, `ring-`, …) from a single `--color-x` declaration in `@theme`:

- **Customise an existing colour** → change one line.
- **Add a brand-new colour + get all its utilities** → add one line.
- **Component CSS authored by the app** → zero.
- **Utility CSS authored by the app** → zero.

Honest caveat: in v4 the theme *is* CSS, so the single `theme.css` (declarative values, no styling logic) is the one genuinely-needed file. "No custom CSS" means "no hand-written styling" — not literally zero files.

**Bundle owns the dark-mode plumbing.** Colour variants (`primary-light`) are distinct from theme modes (site light/dark) per §6. The interaction between build-time `@theme` variables and runtime `:root` / `.dark` overrides is handled *inside the bundle* so the consuming app only ever sets values and never has to understand it.

### 21.4 Tailwind v4, CSS-First, No SCSS

**Locked in:** Tailwind **v4, CSS-first, with no SCSS anywhere.**

- Theme/tokens/colours defined via `@theme`, CSS variables, and `@import "tailwindcss"`.
- No `tailwind.config.js` v3-style mindset; no Sass variable maps as a source of truth.
- The `custom.scss` template (§8), the SCSS entry option (§9.2), and any other SCSS references are **withdrawn**. All bundle and consuming-app files are `.css`.

