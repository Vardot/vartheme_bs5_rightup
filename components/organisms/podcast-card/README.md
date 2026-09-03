# Podcast Card

A podcast/show card: uploaded cover image, a single drag & drop content slot, a fixed meta text (bottom-left), and a "view show" button (bottom-right), with an optional stretched-link overlay.

## Bootstrap reference

> [Bootstrap 5.3 — Card](https://getbootstrap.com/docs/5.3/components/card/)
> [Bootstrap 5.3 — Stretched link](https://getbootstrap.com/docs/5.3/helpers/stretched-link/)

## What it does

Use this component when you need a podcast/show teaser card that can:

- upload a cover image and crop it to a fixed ratio
- control how the cover image fits inside that ratio
- toggle padding around the content area
- hold arbitrary drag & drop content (heading, description, or any other component)
- show a fixed meta label (e.g. episode count) at the bottom-left
- link out to the show with a "view show" button at the bottom-right
- optionally turn the whole card into a clickable stretched link

## Files

- `podcast-card.component.yml` — component schema and props
- `podcast-card.twig` — component template
- `podcast-card.scss` / `podcast-card.css` — component styles
- `README.md` — usage notes and examples
- `podcast-card.mdx` — Storybook docs page
- `podcast-card.stories.json` — Storybook story configuration
- `podcast-card.stories.twig` — Storybook story templates

## Props overview

### Cover image

- `media_image`: Canvas image object (`src`, `alt`, `width`, `height`)
- `image_ratio`: crop ratio — `ratio-auto`, `ratio-16x9`, `ratio-4x3`, `ratio-1x1`, `ratio-21x9`; defaults to `ratio-1x1`
- `image_fit`: `object-fit-cover` or `object-fit-contain`; defaults to `object-fit-cover`

### Content

- `content_padding`: add padding inside the content area below the image; defaults to `true`
- `meta_text`: small fixed label at the bottom-left (e.g. "38 Episodes"); leave empty to omit it; defaults to `38 Episodes`

### Button

- `button_text`: label for the "view show" button, shown at the bottom-right; only rendered when `button_url` is set; defaults to `View Show`
- `button_url`: destination for the button; defaults to `''`
- `button_target`: `_self` or `_blank`; defaults to `_self`
- `stretched_link`: when enabled and `button_url` is set, the whole card becomes clickable; defaults to `false`

## Slots

- `content_slot` — drop the card's heading and description here (e.g. `atoms/heading` + `atoms/text`, or a rich text field)

## Example

```twig
{% embed 'vartheme_bs5_rightup:podcast-card' with {
  media_image: {
    src: '/path/to/cover.jpg',
    alt: 'Last Call cover art'
  },
  image_ratio: 'ratio-1x1',
  image_fit: 'object-fit-cover',
  content_padding: true,
  meta_text: '38 Episodes',
  button_text: 'View Show',
  button_url: '/podcasts/last-call',
  stretched_link: true
} only %}
  {% block content_slot %}
    <h3 class="h4 fw-bold mb-3">Last Call</h3>
    <p class="text-muted mb-0">The decisions nobody sees, told by the people who made them.</p>
  {% endblock %}
{% endembed %}
```

## Notes

- If no content is provided for the content slot, a small "Drop content here" hint is rendered.
- The footer row is only rendered when `meta_text` or `button_url` is set; when only one is present, the other side's alignment adjusts automatically (meta text alone sits left, button alone sits right).
- The "view show" button reuses `atoms/button` (`btn-secondary`, which renders white background/black text in this theme's token set) with an `arrow-right` icon, no border, no padding, and a fixed `1.125rem` font size — `podcast-card.scss` overrides these directly since `atoms/button`'s size variants don't land on this exact size (and add a responsive font-size override below the `md` breakpoint).
- On hover the button underlines while keeping its white background and black text. `atoms/button`'s own `.btn.btn-secondary` rule (higher specificity than plain Bootstrap's `btn-secondary`) otherwise switches to a dark hover background with white text — `podcast-card.scss` overrides those hover/active variables back to white/black with `!important` so only the underline changes on hover.
- The button's default `me-3 mb-3` margin (from `atoms/button`'s "inline" alignment, meant for buttons flowing in a paragraph) is neutralized in `podcast-card.scss` so it pairs with the footer row's own `gap-3` instead.
- The cover image has its own `mb-3` bottom margin, independent of `content_padding`.
- The stretched link is only rendered when both `stretched_link` is enabled and `button_url` is set; its accessible label combines the content slot's text and the button text so screen reader users hear "Last Call ... View Show" rather than just "View Show" repeated for every card.
- Per Bootstrap's stretched-link documentation, the visible button needs its own `position-relative`/`z-2` to stay independently clickable above the stretched overlay — both point to the same URL, so this only affects focus order, not behavior.
- Boolean props (`content_padding`, `stretched_link`) are validated and defaulted by SDC, so they arrive as real booleans.
