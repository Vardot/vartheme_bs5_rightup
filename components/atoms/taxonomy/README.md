# Taxonomy

A Bootstrap-styled taxonomy badge that renders as a link when a URL is provided, otherwise as a span.

## What it does

Use this component when you need to:

- display a taxonomy term as a compact, uppercase badge
- optionally turn the badge into a link to the term page
- open that link in the same or a new tab
- choose between a large and small typography size

## Files

- `taxonomy.component.yml` — component schema and props
- `taxonomy.twig` — component template
- `README.md` — usage notes and examples
- `taxonomy.mdx` — Storybook docs page
- `taxonomy.stories.json` — Storybook story configuration
- `taxonomy.stories.twig` — Storybook story templates

## Props overview

### Content

- `label`: text shown inside the taxonomy badge (required). An integer is accepted too, so a numeric field — an episode number, a year — can be bound straight to it
- `prefix`: fixed word printed before the label, for an eyebrow whose label comes from a number or a term (a prefix of `Episode` with a label of `17` reads `EPISODE 17`); defaults to `''`

### Link

- `url`: if provided, the taxonomy renders as a link; defaults to `''`
- `target`: where to open the link, only used when `url` is provided — `_self` or `_blank`; defaults to `_self`

### Appearance

- `size`: typography size (taxonomy modifier class) — `taxonomy-lg` or `taxonomy-sm`; defaults to `taxonomy-lg`
- `color`: Bootstrap text color utility for the badge label — `text-tertiary`, `text-accent`, `text-primary`, `text-secondary`, `text-success`, `text-danger`, `text-warning`, `text-info`, `text-dark`, `text-white`, or `text-muted`; defaults to `text-tertiary`
- `no_padding`: removes the badge's padding for a flush, zero-padding label; defaults to `false`
- `justify_content`: horizontal alignment of the badge content — `justify-content-start`, `justify-content-center`, or `justify-content-end`; defaults to `justify-content-center`

## Target values

| Value | Label |
|---|---|
| `_self` | Same tab |
| `_blank` | New tab |

## Size values

| Value | Label |
|---|---|
| `taxonomy-lg` | Large |
| `taxonomy-sm` | Small |

## Justify content values

| Value | Label |
|---|---|
| `justify-content-start` | Left |
| `justify-content-center` | Center |
| `justify-content-end` | Right |

## Available attributes

- `attributes`: attributes array available to the component
- `taxonomy_attributes`: attributes for the rendered badge element (`<a>` or `<span>`)

## Example

```twig
{% include 'vartheme_bs5_rightup:taxonomy' with {
  label: 'Announcements',
  url: '/taxonomy/term/12',
  target: '_blank',
  size: 'taxonomy-lg'
} only %}
```

```twig
{% include 'vartheme_bs5_rightup:taxonomy' with {
  label: 'Draft',
  size: 'taxonomy-sm'
} only %}
```

## Notes

- With a non-empty `url` the badge renders as `<a>`; otherwise it renders as `<span>`.
- No background or border — just bold, uppercase, colored text; `color` defaults to `text-tertiary` but can be set to any Bootstrap text color utility, including this theme's `text-accent` token.
- The `taxonomy-lg`/`taxonomy-sm` size prop values double as the modifier class name. Bootstrap's `fs-*` scale doesn't land on the exact sizes needed, so `taxonomy.scss` sets them directly: `taxonomy-lg` is `0.75rem`, `taxonomy-sm` is `0.625rem`.
- When `target` is `_blank`, the link also gets `rel="noopener noreferrer"`.
- The badge is uppercased and tracked out by `0.08em`, the eyebrow treatment the design uses at every size, stated once on `.taxonomy` in `em` so it follows the size modifier.
- The weight is `fw-medium`, not `fw-bold`: the heading family ships 400 and 500 only, so a 700 would be synthesised by the browser and the glyphs smear.
- The link variant adds `text-decoration-none`; `url` is escaped on output, and `prefix` and `label` are printed as one text node so the tracking applies across both.
- `no_padding: true` adds Bootstrap's `p-0` utility, which overrides the badge's default padding.
- `justify_content` swaps in Bootstrap's `justify-content-*` flex utility on the badge's own `d-inline-flex` layout.
