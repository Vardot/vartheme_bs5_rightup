# Card Slider

A horizontally scrollable slider that shows multiple card components (e.g. Article Teaser) side by side, with an optional label and previous/next controls.

## Bootstrap reference

> [Bootstrap 5.3 — Flex](https://getbootstrap.com/docs/5.3/utilities/flex/)

## What it does

Use this component when you need to:

- show several cards in a row that scrolls horizontally instead of wrapping
- control how many cards are visible at once on desktop (1–4)
- add a small label (e.g. "On display") with a divider line and previous/next controls
- drop any card-shaped component into the slot — Article Teaser, Card Featured, or any other component
- adapt the title and divider color for a black/dark background section

## Files

- `card-slider.component.yml` — component schema and props
- `card-slider.twig` — component template
- `card-slider.scss` / `card-slider.css` — component styles
- `card-slider.js` — previous/next scroll behavior
- `README.md` — usage notes and examples
- `card-slider.mdx` — Storybook docs page
- `card-slider.stories.json` — Storybook story configuration
- `card-slider.stories.twig` — Storybook story templates

## Props overview

- `label`: small heading shown above the cards (e.g. "On display"); leave empty to omit it; defaults to `''`
- `title_color`: Bootstrap text color utility for the label — `text-dark`, `text-body`, `text-white`, or `text-muted`; use `text-white` on a black/dark background section; defaults to `text-dark`
- `divider_color`: Bootstrap border color utility for the horizontal line — the same palette as `atoms/section`'s `border_color`; use `border-white` on a black/dark background section; defaults to `border-primary`
- `show_controls`: show the previous/next controls; defaults to `true`
- `control_bg_color`: theme color for the previous/next icon box background — `accent`, `tertiary`, `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`, `white`, or `black`; defaults to `accent`
- `control_icon_color`: theme color for the previous/next chevron icon — `white`, `black`, `dark`, `light`, `accent`, `tertiary`, `primary`, `secondary`, `success`, `danger`, `warning`, or `info`; defaults to `white`
- `control_disabled_opacity`: opacity of the icon box when its direction has no more cards to scroll to — `opacity-0`, `opacity-25`, `opacity-50`, `opacity-75`, or `opacity-100`; defaults to `opacity-50`
- `visible_items`: how many cards are visible at once on desktop (md, 768px, and up) — `1`, `2`, `3`, or `4`; narrower viewports show fewer — 2 (or fewer) from sm (576px) up to md, 1 below that; defaults to `3`

## Slots

- `cards` — add two or more card components here (e.g. Article Teaser). Unlimited, drag & drop reorder.

## Example

```twig
{% embed 'vartheme_bs5_rightup:card-slider' with {
  label: 'On display',
  show_controls: true,
  visible_items: '3'
} only %}
  {% block cards %}
    {{ include('vartheme_bs5_rightup:article-teaser', {
      media_image: { src: '/path/to/photo-1.jpg', alt: 'Photo' },
      category_label: 'Culture',
      heading_text: 'A Photographer’s 10-Year Study of Ceremony and Color in West Africa',
      author: 'Sana Kovač',
      date: '2026-07-07',
      show_divider: false
    }) }}
    {{ include('vartheme_bs5_rightup:article-teaser', {
      media_image: { src: '/path/to/photo-2.jpg', alt: 'Photo' },
      category_label: 'Process',
      heading_text: 'What Fen & Marble Actually Use to Pitch New Clients',
      author: 'Tom James',
      date: '2026-07-07',
      show_divider: false
    }) }}
  {% endblock %}
{% endembed %}
```

## Notes

- The slider only lays out and scrolls its direct children — it doesn't know or care which component was dropped into the `cards` slot, so any card-shaped component works without changes.
- The track is a native scrollable/swipeable flex row with scroll-snap; without JavaScript it remains fully usable by touch, trackpad, or drag. JavaScript only adds the previous/next click behavior and keeps the controls' disabled state in sync with scroll position.
- The previous/next buttons reuse `atoms/button` (icon-only, with a visually-hidden label for screen readers). Their icon box is a fixed 1.875rem (30px) square with zero padding, independent of `title_color`/`divider_color`.
- `control_bg_color`, `control_icon_color`, and `control_disabled_opacity` are backed by this theme's root color custom properties (`--bs-accent`, `--bs-primary`, etc. from `base/root/root.css`), each with a literal hex fallback in case a derived theme ships without that file.
- The disabled (no-more-cards-to-scroll-to) state dims via the chosen `control_disabled_opacity`; the enabled direction always renders at full opacity.
- `visible_items` only takes effect at `sm` (576px) and up, capped at 2 until `md` (768px); below `sm` every card is full width so touch users get the clearest swipe target.
- Boolean props (`show_controls`) are validated and defaulted by SDC, so they arrive as real booleans.
