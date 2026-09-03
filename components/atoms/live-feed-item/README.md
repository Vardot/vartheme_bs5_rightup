# Live Feed Item

A single timestamped news item, meant to be dropped into a [Live Feed](../../organisms/live-feed/) component's "Items" slot.

## Bootstrap reference

> [Bootstrap 5.3 — Utilities: Colors](https://getbootstrap.com/docs/5.3/utilities/colors/)

## What it does

Use this component when you need a feed/ticker entry that can:

- pair a short timestamp with a headline
- optionally render as a link to a URL

## Files

- `live-feed-item.component.yml` — component schema and props
- `live-feed-item.twig` — component template
- `README.md` — usage notes and examples

## Props overview

### Content

- `time` (required): short timestamp shown before the title (e.g. `5:10 PM`)
- `title` (required): the news item's headline
- `url` (optional): if provided, the item renders as a link; defaults to `''`

## Example

```twig
{% include 'vartheme_bs5_rightup:live-feed-item' with {
  time: '5:10 PM',
  title: 'Adobe Quietly Kills Its Font-Pairing Tool',
  url: '/news/adobe-font-pairing-tool',
} only %}
```

## Notes

- With a non-empty `url` the item renders as `<a>`; otherwise it renders as `<span>`.
- The time is `text-tertiary` (the theme's indigo) and the title is `text-black`; both at `fs-6` (`0.875rem`).
- Standalone this renders as an inline item; it's meant to be composed inside `vartheme_bs5_rightup:live-feed`'s `items` slot, which lays multiple instances out in a row and adds the scrolling behavior.
