# Badge

A Bootstrap 5 badge that renders as a `<span>`, or as a link when a URL is provided, with an optional icon, notification indicator, and contextual color, size and radius utilities.

Badges are small count and labeling components. They scale to match the size of their immediate parent element by using relative font sizing and `em` units.

## Bootstrap reference

> #### [Bootstrap Documentation on Badges](https://getbootstrap.com/docs/5.3/components/badge/)
> * [Headings](https://getbootstrap.com/docs/5.3/components/badge/#headings) Badges scale to match the size of the immediate parent element.
> * [Background colors](https://getbootstrap.com/docs/5.3/components/badge/#background-colors) to make badges more rounded 
> * [Pill badges](https://getbootstrap.com/docs/5.3/components/badge/#pill-badges)
> * [Buttons](https://getbootstrap.com/docs/5.3/components/badge/#buttons): Badges can be used as part of links or buttons to provide a counter.
> * [Positioned](https://getbootstrap.com/docs/5.3/components/badge/#positioned)

## What it does

Use this component when you need a reusable badge that can:

- show a text label with a Bootstrap contextual color (`text-bg-*`)
- render as a link (`<a>`) when a `url` is provided, otherwise a `<span>`
- show an optional Bootstrap Icon before or after the label
- display a notification dot or a count bubble on the badge
- switch between small, medium, and large sizing utilities
- accept a `radius` prop, though badges render square in this theme regardless of its value (see Notes)

## Files

- `badge.component.yml` — component schema and props
- `badge.twig` — component template
- `README.md` — usage notes and examples
- `badge.scss` / `badge.css` — component styles
- `badge.mdx` — Storybook docs page
- `badge.stories.json` — Storybook story configuration
- `badge.stories.twig` — Storybook story templates

## Props overview

### Content

- `label` (required): text shown inside the badge
- `url`: if provided, the badge renders as a link; defaults to `""`

### Appearance

- `variant` (required): Bootstrap contextual color — `text-bg-primary`, `text-bg-secondary`, `text-bg-success`, `text-bg-danger`, `text-bg-warning`, `text-bg-info`, `text-bg-light`, `text-bg-dark`; defaults to `text-bg-primary`
- `size`: sizing utilities (font-size + padding) — `fs-6 px-2 py-1` (Small), `fs-6 px-3 py-2` (Medium), `fs-5 px-3 py-2` (Large); defaults to `fs-6 px-3 py-2`
- `radius`: border-radius utility — `rounded-0`, `rounded-1`, `rounded-pill`; defaults to `rounded-0`. Badges are always square in this theme regardless of this value (see Notes).

### Icon

- `icon`: optional Bootstrap Icon name without the `bi-` prefix; use `none` to disable; defaults to `none`
- `icon_first`: icon before the label when `true`, after when `false`; defaults to `true`

### Indicator

- `indicator`: notification indicator — `none`, `dot`, `count`; defaults to `none`
- `indicator_text`: text shown in the count bubble (e.g. `1`, `9`, `99+`); used only when `indicator` is `count`; defaults to `99+`

## Variant values

| Value | Color |
|---|---|
| `text-bg-primary` | Primary |
| `text-bg-secondary` | Secondary |
| `text-bg-success` | Success |
| `text-bg-danger` | Danger |
| `text-bg-warning` | Warning |
| `text-bg-info` | Info |
| `text-bg-light` | Light |
| `text-bg-dark` | Dark |

## Size values

| Value | Label |
|---|---|
| `fs-6 px-2 py-1` | Small |
| `fs-6 px-3 py-2` | Medium (default) |
| `fs-5 px-3 py-2` | Large |

## Example: link badge with icon and count

```twig
{% include 'vartheme_bs5_rightup:badge' with {
  label: 'New',
  url: 'https://example.com',
  variant: 'text-bg-success',
  size: 'fs-6 px-3 py-2',
  radius: 'rounded-0',
  icon: 'check',
  icon_first: true,
  indicator: 'count',
  indicator_text: '3'
} only %}
```

## Example: simple text badge

```twig
{% include 'vartheme_bs5_rightup:badge' with {
  label: 'Reminder',
  variant: 'text-bg-primary',
  icon: 'none'
} only %}
```

## Notes

- The root tag is `<a>` when a non-empty `url` (other than `No URL`) is provided, otherwise `<span>`.
- The `label` is also set as the `aria-label` on the root element.
- An internal SCSS size-modifier class (`badge-small` / `badge-medium` / `badge-large`) is mapped from the `size` utility to keep indicator sizing consistent.
- The icon is rendered through the `vartheme_bs5_rightup:icon` component using the `icon` value without its `bi-` prefix.
- The count bubble and dot are positioned absolutely on the badge; the root gains `position-relative` when an indicator is present.
- Custom styling uses CSS Logical Properties (e.g. `padding-inline`, `inline-size`) for RTL/LTR support.
- `text-bg-primary` and `text-bg-secondary` use brand-specific background colors (tertiary and accent respectively — see `badge.scss`), overriding Bootstrap's own primary/secondary badge colors.
- Badges are square in this theme: `badge.scss` forces `border-radius: 0 !important` on all three size-modifier classes, overriding the `radius` prop's `.rounded-*` utility class regardless of which value it's set to. The notification dot/count bubble keep their own circular/pill shape — that's unrelated to the `radius` prop.
- The boolean prop `icon_first` is validated by SDC and arrives as a real boolean.
