# Offcanvas Menu

A hamburger trigger for the header (or anywhere else) that opens a full takeover navigation panel: a dark header strip with a close button, and a light panel body holding the main menu, a divider, secondary utility links, and search.

## Bootstrap reference

> [Bootstrap 5.3 — Offcanvas](https://getbootstrap.com/docs/5.3/components/offcanvas/)

This is a thin wrapper around Bootstrap's own Offcanvas plugin (`data-bs-toggle="offcanvas"` / `data-bs-dismiss="offcanvas"`) — no custom JavaScript is needed, since `bs-offcanvas-script` is already part of the theme's global `bootstrap-scripts` library.

## What it does

Use this component when you need a header/navbar hamburger trigger that can:

- render as a single hamburger icon button until clicked
- open a full-height Bootstrap Offcanvas panel sliding in from the start or end side
- hold a main menu (`menu` slot), a divider, secondary utility links (`utility` slot), and a search form (`search` slot)
- close on the close button, <kbd>Escape</kbd>, or clicking the backdrop — all handled by Bootstrap's Offcanvas plugin (focus trap, scroll lock, `aria-*` included)

## Files

- `offcanvas-menu.component.yml` — component schema, props, and slots
- `offcanvas-menu.twig` — component template
- `offcanvas-menu.css` — compiled component styles
- `offcanvas-menu.scss` — component styles source
- `offcanvas-menu.js` — Canvas editor preview behavior
- `README.md` — usage notes and examples

## Props overview

- `label`: accessible label for the closed-state trigger button (visually hidden); defaults to `Open menu`
- `close_label`: accessible label for the panel's close button (visually hidden); defaults to `Close menu`
- `placement`: which side the panel slides in from — `start` or `end` (RTL-aware); defaults to `start`
- `expand_in_editor`: force the panel open while previewed inside the Drupal Canvas editor, so its `menu`/`utility`/`search` slots stay reachable for dropping components in; turn off once content is placed if the always-open panel clutters the editor view; defaults to `true`

## Slots

- `menu`: the primary navigation links, e.g. a "Main navigation" menu block rendered through the Nav Menu component
- `utility`: secondary links shown below the divider, e.g. Newsletter, About, Advertise — styled as italic serif to read as secondary
- `search`: search form, e.g. the "Exposed form: search-page" block

## Example

```twig
{% embed 'vartheme_bs5_rightup:offcanvas-menu' with {
  label: 'Open menu',
  close_label: 'Close menu',
  placement: 'start',
} %}
  {% block menu %}
    {{ drupal_block('system_menu_block:main') }}
  {% endblock %}
  {% block utility %}
    {{ drupal_block('system_menu_block:footer') }}
  {% endblock %}
  {% block search %}
    {{ drupal_block('views_exposed_filter_block:search-page') }}
  {% endblock %}
{% endembed %}
```

## Notes

- The divider between `menu` and `utility` is only rendered when both slots have content — it is structural (hardcoded in the template, like the footer's top/bottom `<hr>`), not an author-placed slot item.
- The panel header strip uses the same dark background as the site's header/footer (`--bs-primary-text-emphasis`); the body uses a light tint derived from the brand-tertiary indigo (`#4F46E1`) since no Bootstrap token carries that color.
- The `utility` slot's italic styling uses a system serif stack (Georgia/Times) — this theme has no serif webfont loaded, so no new font file or build step is required.
- Unlike `icon-toggle` (a small anchored popover that keeps sibling navigation visible), this component is a full takeover panel — use it for a hamburger menu, not an inline search/utility toggle.
- Inside the Drupal Canvas editor preview, the panel starts open by default (`expand_in_editor: true`) so its `menu`/`utility`/`search` slots are reachable for drag-and-drop, without Bootstrap's own backdrop covering (and disabling clicks on) the rest of the canvas — set `expand_in_editor: false` on an instance once content is placed if the always-open panel is cluttering the editor view. This only affects the editor preview; front-end visitors always get the normal click-to-open/close behavior, backdrop included.
