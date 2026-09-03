# Horizontal Text Icon Card

Full-width horizontal card: a flexible content slot (category, heading, text, meta, button, etc.) on the start side and a fixed circular play icon in one of two brand colors on the end side. The heading in the slot underlines on hover.

## Bootstrap reference

> [Bootstrap 5.3 — Flex](https://getbootstrap.com/docs/5.3/utilities/flex/)
> [Bootstrap 5.3 — Colors](https://getbootstrap.com/docs/5.3/utilities/colors/)
> [Bootstrap 5.3 — Border radius](https://getbootstrap.com/docs/5.3/utilities/borders/#border-radius)
> [Bootstrap 5.3 — Stretched link](https://getbootstrap.com/docs/5.3/helpers/stretched-link/)

## What it does

Use this component for a full-width, editorial-style row (e.g. a podcast episode listing) that can:

- hold any combination of content in a single flexible slot — category/taxonomy label, heading, text, meta line, button, etc.
- show a fixed circular play icon on the end side in one of two brand colors
- underline the first heading (`h1`–`h6`) found in the slot when the whole card is hovered
- switch background color, border radius, padding, and vertical alignment of the row
- optionally make the whole card clickable with Bootstrap's stretched-link

## Files

- `horizontal-text-icon-card.component.yml` — component schema and props
- `horizontal-text-icon-card.twig` — component template
- `horizontal-text-icon-card.scss` — icon sizing and the hover-underline behavior
- `README.md` — usage notes and examples
- `horizontal-text-icon-card.mdx` — Storybook docs page
- `horizontal-text-icon-card.stories.json` — Storybook story configuration
- `horizontal-text-icon-card.stories.twig` — Storybook story templates

## Props overview

- `icon_color`: Bootstrap theme color for the circular icon background — `bg-tertiary` (Blue) or `bg-accent` (Accent / Mint); defaults to `bg-tertiary`
- `background_color`: brand background color for the card — `none`, `bg-body-tertiary`, `bg-tertiary`, `bg-accent`, `bg-primary`, `bg-primary-subtle`, `bg-secondary`, `bg-secondary-subtle`, `bg-dark`; defaults to `bg-primary`
- `corner_style`: Bootstrap rounded utility — `rounded-0` through `rounded-5`, or `rounded-pill`; defaults to `rounded-0`
- `padded`: adds `p-4` to the card when enabled, `p-0` when disabled; defaults to `true`
- `content_vertical_alignment`: vertical alignment of the content slot and icon within the row — `align-items-start`, `align-items-center`, `align-items-end`; defaults to `align-items-center`
- `stretched_link`: when enabled and `link_url` is set, the entire card becomes clickable via Bootstrap's stretched-link; defaults to `false`
- `link_url`: URL for the card link; only used when `stretched_link` is enabled. Defaults to `''`
- `link_target`: `_self` or `_blank`; only used when `stretched_link` is enabled and `link_url` is set. Defaults to `_self`

## Available attributes

- `attributes` — HTML attributes for the root element
- `content_attributes` — HTML attributes for the content wrapper element
- `icon_attributes` — HTML attributes for the icon wrapper element

## Slots

- `content` — flexible content for the start side (category label, heading, text, meta line, button, etc.)

## Example

```twig
{% embed 'vartheme_bs5_rightup:horizontal-text-icon-card' with {
  icon_color: 'bg-accent',
  background_color: 'bg-primary',
  corner_style: 'rounded-3',
  padded: true,
  content_vertical_alignment: 'align-items-center',
  stretched_link: true,
  link_url: '/episodes/13',
  link_target: '_self'
} only %}
  {% block content %}
    {% include 'vartheme_bs5_rightup:text' with {
      text: '<span class="text-uppercase fw-bold text-accent small">Episode 13</span>'
    } only %}
    {% include 'vartheme_bs5_rightup:heading' with {
      heading_text: 'No Straight Walls',
      level: 3
    } only %}
    {% include 'vartheme_bs5_rightup:text' with {
      text: '<p>An architect on designing a museum wing with no straight walls, and why the client said yes.</p>'
    } only %}
  {% endblock %}
{% endembed %}
```

## Notes

- The icon is a fixed inline SVG play triangle (not an uploaded image, and the same shape for both variants) — only its background/foreground color pair changes between `bg-tertiary` (white triangle) and `bg-accent` (dark triangle), matching Bootstrap's own contrast pairing for each theme color.
- The icon glyph itself renders at a fixed `1.05rem` × `1.35rem` (`horizontal-text-icon-card.scss`, `&__icon-svg`), independent of the `3rem` circle it sits in. Because the SVG's `viewBox` is square, the markup sets `preserveAspectRatio="none"` so the triangle actually stretches to fill that non-square box instead of being letterboxed to a smaller square.
- `background_color` auto-pairs with `text-white` only for the theme colors that read as visually dark (`bg-primary`, `bg-tertiary`, `bg-dark`, `bg-body-tertiary`); the rest keep the inherited dark text color.
- The hover-underline targets any `h1`–`h6` inside the `content` slot generically, since the slot's markup is defined by whoever embeds the component, not by this template.
- `stretched_link` renders an invisible, full-card `<a>` (via `atoms/link` with the `stretched-link` utility class) whose accessible name is taken from the stripped text of the `content` slot. It only renders when both `stretched_link` is enabled and `link_url` is set — `link_url` alone does nothing.
- When `link_target` is `_blank`, `rel="noopener noreferrer"` is added automatically.
