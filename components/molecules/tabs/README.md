# Tabs

A horizontal tab / filter bar built on Bootstrap 5.3 navs, with an active tab rendered as a filled square box (no border radius) sitting on a shared bottom border.

## Bootstrap reference

> [Bootstrap 5.3 — Navs and tabs](https://getbootstrap.com/docs/5.3/components/navs-tabs/)

## What it does

Renders a `nav-tabs`/`nav-pills` list container. Place one or more [Tab Item](../tab-item/README.md) components inside the `items` slot. By default each Tab Item is a plain link (a filter/navigation row, not a tabbed content pane) — the active tab (`is_active: true`) renders as a filled square box with no border radius (`--brand-tertiary` background, white text); inactive tabs are plain text sitting on a shared 1px bottom border, on a white box background.

Place one or more [Tab Pane](../tab-pane/README.md) components in this component's `panes` slot to turn the row into real Bootstrap JS tabs that toggle content panes below — the standard `nav` + `tab-content` Bootstrap pattern (see the [JavaScript behavior](https://getbootstrap.com/docs/5.3/components/navs-tabs/#javascript-behavior) docs). The Nth Tab Item pairs with the Nth Tab Pane automatically (see Notes) — no `pane_id`, and no matching `is_active` between the two, has to be typed anywhere; just keep Tab Items and Tab Panes in the same order in their respective slots.

## Files

- `tabs.component.yml` — SDC schema (`tabs_id`, `shape`, `active_bg`, `active_color`, `border_color`, `attributes`) and the `items`/`panes` slots.
- `tabs.twig` — template.
- `tabs.scss` — active-box, bottom-border, and active-color-override styling.
- `tabs.js` — auto-pairs Tab Item/Tab Pane ids by DOM order (see Notes).
- `tabs.stories.twig` / `tabs.stories.json` — Storybook stories.
- `tabs.mdx` — Storybook docs page.

## Props overview

| Property | Type | Description | Default |
|---|---|---|---|
| `tabs_id` | string | Tabs container id — leave empty to auto-generate | auto-generated |
| `shape` | string | `tabs` (with the shared bottom border) or `pills` (no border, standalone) | `tabs` |
| `active_bg` | string | Bootstrap theme color for the active tab's background (`black`, `secondary`, `primary`, `tertiary`, `accent`, `success`, `danger`, `warning`, `info`, `light`, `dark`, `white`). Leave as Default for the design default | `default` (brand tertiary) |
| `active_color` | string | Bootstrap theme color for the active tab's text (same color list as `active_bg`). Leave as Default for the design default | `default` (white) |
| `border_color` | string | Bootstrap `border-*` utility for the shared bottom border (`border-black`, `border-secondary`, `border-primary`, `border-tertiary`, `border-accent`, `border-success`, `border-danger`, `border-warning`, `border-info`, `border-light`, `border-dark`, `border-white`). Leave as Default for the design default | `default` (neutral) |
| `attributes` | object | HTML attributes for the nav (tabs list) element | `{}` |

## Slots

| Slot | Description |
|---|---|
| `items` | Place one or more [Tab Item](../tab-item/README.md) components here. |
| `panes` | Optional. Place one or more [Tab Pane](../tab-pane/README.md) components here, in the same order as their paired Tab Items above, to render real Bootstrap JS tab content — `tabs.js` pairs them by position automatically (see Notes). Leave empty to keep Tab Item as a plain filter/navigation link. |

## Example

### Plain filter tabs

```twig
{% set items %}
  {{ include('vartheme_bs5_rightup:tab-item', {title: 'All', url: '/', is_active: true}, with_context: false) }}
  {{ include('vartheme_bs5_rightup:tab-item', {title: 'Architecture', url: '/architecture'}, with_context: false) }}
  {{ include('vartheme_bs5_rightup:tab-item', {title: 'Fashion', url: '/fashion'}, with_context: false) }}
{% endset %}
{{ include('vartheme_bs5_rightup:tabs', {
  shape: 'tabs',
  items: items
}, with_context: false) }}
```

### Real Bootstrap JS tabs with content panes

`tabs.js` pairs the Nth Tab Item with the Nth Tab Pane automatically (see Notes) — `pane_id`/`is_active` don't need to match, or be set at all, as long as items and panes are in the same order:

```twig
{% set items %}
  {{ include('vartheme_bs5_rightup:tab-item', {title: 'All', is_active: true}, with_context: false) }}
  {{ include('vartheme_bs5_rightup:tab-item', {title: 'Architecture'}, with_context: false) }}
{% endset %}
{% set panes %}
  {% set content %}<p>All content.</p>{% endset %}
  {{ include('vartheme_bs5_rightup:tab-pane', {pane_id: 'all', content: content}, with_context: false) }}
  {% set content %}<p>Architecture content.</p>{% endset %}
  {{ include('vartheme_bs5_rightup:tab-pane', {pane_id: 'architecture', content: content}, with_context: false) }}
{% endset %}
{{ include('vartheme_bs5_rightup:tabs', {
  shape: 'tabs',
  items: items,
  panes: panes
}, with_context: false) }}
```

## Notes

- The active tab's default fill color (`--brand-tertiary`), text color (`--text-white-text`/`--text-dark-text`), and spacing (`--size-sm-size-2`/`--size-sm-size-3`) are exposed as CSS custom properties with Bootstrap-safe fallbacks, so they follow the active theme/design tokens automatically when the `active_bg`/`active_color` props are left as `default`.
- `active_bg`/`active_color` can't be passed down to the Tab Item components directly (Tab Item is a separate component, rendered independently of however the `items` slot was composed), so Tabs instead adds `tabs--active-bg-*`/`tabs--active-color-*` modifier classes to itself and targets any nested `.nav-link.active` with a plain CSS descendant selector (see `tabs.scss`) — this works regardless of how the items were authored.
- `border_color` reuses a real Bootstrap `border-*` utility class directly, same as the [Divider](../../atoms/divider/README.md) component's `border_color` prop — Bootstrap's color utilities only ever set `border-color` (never width/style), so they safely recolor just the visible bottom border without needing any extra CSS here.
- The `pills` shape does not include the shared bottom border (matches Bootstrap's own `nav-pills` semantics of a border-free, standalone group).
- Items (and panes) are composed via slots (not array props) specifically so each tab is authorable as its own component in Drupal Canvas — Canvas has no field type/widget that can populate an arbitrary array-of-objects prop, only slots and simple scalar props.
- The Bootstrap JS Tab plugin (`bs-tab-script`) is declared as a dependency and already loaded theme-wide, so JS tabs work with no extra library wiring.
- **Automatic Tab Item / Tab Pane pairing (`tabs.js`).** Tab Item and Tab Pane are separate components, each authored independently in Drupal Canvas (previous bullet), so a content editor previously had to: give the Tab Item a `pane_id` just to opt it into JS-tab mode, type that same `pane_id` into the paired Tab Pane, and keep both components' `is_active` in agreement — three manual, easy-to-typo steps for what is really one decision ("these N items go with these N panes, in order"). `tabs.js` removes all three: whenever a Tabs instance has any Tab Panes at all, it walks the tabs list and its `tab-content` panes in DOM order and, for the Nth tab + Nth pane, promotes the tab link into a real Bootstrap JS tab (`id`/`href`/`data-bs-toggle`/`data-bs-target`/`role`/`aria-controls`/`aria-selected`) and syncs the pane's visible state (`active`/`show` classes) to whichever tab link is marked active — regardless of whatever `pane_id`/`is_active` values were (or weren't) typed into either component, and regardless of duplicate `pane_id`s reused across two different Tabs blocks on one page (ids are freshly namespaced under the Tabs container's own already-unique id). Tab Items beyond the pane count are left untouched as plain navigation links, so a trailing plain filter link can still be mixed in after the paired items. Mismatched counts otherwise (more Tab Items than Tab Panes or vice versa) pair only the first N and log a `console.warn`.
