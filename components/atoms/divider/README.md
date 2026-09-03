# Divider

A Bootstrap 5.3-compatible horizontal divider rendered with the native `<hr>` element, with an optional label shown before the line.

## Bootstrap reference

> [Bootstrap 5.3 — Horizontal rules](https://getbootstrap.com/docs/5.3/content/reboot/#horizontal-rules)

## What it does

Use this component when you need a clean visual separator between sections, cards, text blocks, media areas, or layout groups that can:

- render a semantic `<hr>` element following the Bootstrap 5.3 horizontal rule approach
- optionally show a bold, uppercase label before the line (e.g. "FEATURED"), with the line filling the remaining width
- control border width, border color, and opacity with Bootstrap utilities
- control top and bottom spacing with Bootstrap margin utilities

## Files

- `divider.component.yml` — component schema and props
- `divider.twig` — component template
- `README.md` — usage notes and examples
- `divider.mdx` — Storybook docs page
- `divider.stories.json` — Storybook story configuration
- `divider.stories.twig` — Storybook story templates

## Props overview

### Label

- `text`: Optional label shown before the line (e.g. `FEATURED`); leave empty for a plain divider. Defaults to `''`
- `text_size`: Bootstrap font-size utility for the label — `fs-1` through `fs-6`; only used when `text` is set. Defaults to `fs-6` (0.875rem in this theme)

### Appearance

- `border_width`: Bootstrap border width utility — `border-1`, `border-2`, `border-3`, `border-4`, `border-5`; defaults to `border-1`
- `border_color`: Bootstrap border color utility — `border-black`, `border-secondary`, `border-primary`, `border-tertiary`, `border-accent`, `border-success`, `border-danger`, `border-warning`, `border-info`, `border-light`, `border-dark`, `border-white`; defaults to `border-black`
- `opacity`: Bootstrap opacity utility — `opacity-25`, `opacity-50`, `opacity-75`, `opacity-100`; defaults to `opacity-100`

### Spacing

- `margin_top`: Bootstrap margin-top utility — `mt-0` through `mt-5`; defaults to `mt-3`
- `margin_bottom`: Bootstrap margin-bottom utility — `mb-0` through `mb-5`; defaults to `mb-3`

## Available attributes

- `attributes` — HTML attributes for the root element: the `<hr>` when `text` is empty, or the label/line wrapper `<div>` when a label is set

## Example

Plain divider (unchanged from before):

```twig
{% include 'vartheme_bs5_rightup:divider' with {
  border_width: 'border-1',
  border_color: 'border-secondary',
  opacity: 'opacity-100',
  margin_top: 'mt-3',
  margin_bottom: 'mb-3'
} only %}
```

With a label, line filling the rest of the width:

```twig
{% include 'vartheme_bs5_rightup:divider' with {
  text: 'FEATURED',
  text_size: 'fs-6',
  border_width: 'border-1',
  border_color: 'border-primary',
  opacity: 'opacity-100',
  margin_top: 'mt-3',
  margin_bottom: 'mb-3'
} only %}
```

## Notes

- The divider is full width by default, matching standard Bootstrap behavior.
- Leaving `text` empty renders exactly the same bare `<hr>` as before — this is fully backward compatible.
- When `text` is set, the label uses `fw-bold text-uppercase` plus the `text_size` font-size utility, and the line uses `flex-grow-1` to fill the remaining width; all Bootstrap utility classes, not custom CSS.
- No inline styles or custom SCSS are used; styling is driven entirely by Bootstrap utility classes.
- All props have schema defaults, so the component renders correctly with no values supplied.
