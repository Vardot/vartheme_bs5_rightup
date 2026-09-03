# Live Feed

A colored ticker bar with a fixed label and a continuously auto-scrolling row of timestamped news items.

## Bootstrap reference

> [Bootstrap 5.3 — Utilities: Background](https://getbootstrap.com/docs/5.3/utilities/background/)
> [Bootstrap 5.3 — Utilities: Colors](https://getbootstrap.com/docs/5.3/utilities/colors/)
> [Bootstrap 5.3 — Utilities: Flex](https://getbootstrap.com/docs/5.3/utilities/flex/)

## What it does

Use this component when you need a "latest news" ticker that can:

- show a fixed label (e.g. "Latest") followed by a scrolling list of items
- accept one or more [Live Feed Item](../../atoms/live-feed-item/) components via drag & drop (each pairs a timestamp with a headline, optionally linked)
- keep scrolling readable: pauses on hover/focus, and is fully static (no animation) under `prefers-reduced-motion` or without JS

## Files

- `live-feed.component.yml` — component schema, props, and slots
- `live-feed.twig` — component template
- `live-feed.scss` — ticker background, divider, and scroll animation
- `live-feed.js` — clones the items once for a seamless scroll loop (see Notes)
- `README.md` — usage notes and examples
- `live-feed.mdx` — Storybook docs page
- `live-feed.stories.json` — Storybook story configuration
- `live-feed.stories.twig` — Storybook story templates

## Props overview

### Content

- `label`: fixed label shown before the scrolling feed; defaults to `Latest`

## Slots

- `items`: add one or more [Live Feed Item](../../atoms/live-feed-item/) components here (unlimited, drag & drop reorder)

## Available attributes

- `attributes`: attributes for the root element
- `label_attributes`: attributes for the fixed label element
- `track_attributes`: attributes for the scrolling track element

## Example

```twig
{% embed 'vartheme_bs5_rightup:live-feed' with {
  label: 'Latest',
} %}
  {% block items %}
    {{ include('vartheme_bs5_rightup:live-feed-item', {
      time: '5:10 PM',
      title: 'Adobe Quietly Kills Its Font-Pairing Tool',
      url: '/news/adobe-font-pairing-tool',
    }, with_context: false) }}
    {{ include('vartheme_bs5_rightup:live-feed-item', {
      time: '6:00 PM',
      title: 'Milan Design Week Adds a Fourth Venue for 2027',
    }, with_context: false) }}
  {% endblock %}
{% endembed %}
```

## Notes

- The bar background is `bg-accent` (the theme's mint accent color); the label is `text-black` at `fs-6` (`0.875rem`) — each item's own time/title colors and sizes live in `live-feed-item` itself.
- **Empty-slot drop target, and why it's built this way.** Canvas sizes a slot's drag & drop overlay by measuring the real DOM between `<!-- canvas-slot-start -->`/`-end-` comment markers it injects at compile time around every `{{ items }}` print statement — this happens regardless of what value `items` holds, but *only* around that literal print statement. Branching to a separate element in an `{% else %}` (as an earlier version of this file did) left that fallback outside the markers entirely, so Canvas measured nothing and the drop zone collapsed to a sliver. The fix: when the slot is empty, `items` itself is reassigned (`{% set items %}...{% endset %}`) to a fallback fragment (`.live-feed__fallback`, fixed at `12.5rem` — 200px at the default root font-size — via `live-feed.scss`) *before* the single, unconditional `{{ items }}` print — so the fallback is always what sits between the markers, and Canvas always has a real, consistently sized box to measure. Verified directly by rendering with Canvas's preview context (`canvas_is_preview`, `canvas_uuid`, `canvas_slot_ids` props) and confirming the markers wrap the fallback.
- **Why a slot instead of an array prop:** an earlier version of this component took `items` as an array-of-objects prop. Drupal Canvas couldn't map that shape to a storable field type, so the component never appeared in Canvas's component picker at all (the same issue affects `molecules/list-group`'s array-of-objects `items`). Slot content, since each item is its own component instance, doesn't have this problem — this mirrors `organisms/hero-slider-container`'s `slides` slot.
- The scroll-loop duplication and the animation itself are both progressive-enhancement JS (`live-feed.js`): without it, the slot's items render once, in order, fully readable and static — the CSS animation only activates once the script adds an `is-looping` class, so a no-JS visitor never sees an animation that abruptly resets. When it does run, it clones the items once (so a CSS `translateX(-50%)` animation can loop seamlessly), marks the clone `aria-hidden="true"`, and sets `tabindex="-1"` on every focusable element inside it — `aria-hidden` alone doesn't remove an element from the tab order, so without this a keyboard user could tab into a hidden duplicate link.
- The animation pauses on `:hover`/`:focus-within` and is disabled entirely under `prefers-reduced-motion: reduce` (in that case `live-feed.js` skips cloning altogether, so there's nothing to pause — just one static, fully readable copy).
- The animation is also skipped inside the Drupal Canvas editor's own canvas (same pattern as `atoms/figure`'s count-up animation) — a continuously scrolling ticker there makes it harder to click/select/drag items while editing. Canvas's live-preview iframe (which mirrors the frontend) and the public frontend both still animate normally.
- `label_attributes` and `track_attributes` can be passed in by a caller (e.g. to add an `id`) without losing their default classes, per this theme's nested-attributes convention.
