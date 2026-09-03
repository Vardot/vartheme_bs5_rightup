# Tab Pane

A single Bootstrap JS tab's content pane, meant to be placed inside a [Tabs](../tabs/README.md) component's `panes` slot.

## Bootstrap reference

> [Bootstrap 5.3 — Navs and tabs: JavaScript behavior](https://getbootstrap.com/docs/5.3/components/navs-tabs/#javascript-behavior)

## What it does

Renders one `tab-pane` element. Place it in the same Tabs component's `panes` slot as its paired [Tab Item](../tab-item/README.md) — no `pane_id` needs to be set on either component, they're paired automatically by position (see [Tabs](../tabs/README.md)'s Notes). The Tab Item toggles this pane via Bootstrap's Tab JS plugin. When `is_active` is true, the pane renders visible (`show active`); otherwise it's hidden until its paired Tab Item is activated.

In Drupal Canvas (and the SDC/component preview routes), `is_active` is ignored and the pane always renders visible — Canvas's editing canvas has no click-driven Bootstrap JS toggling, so a hidden pane would be unreachable to edit there. The live/published page still only shows the pane whose paired Tab Item is active.

## Files

- `tab-pane.component.yml` — SDC schema (`pane_id`, `is_active`, `attributes`) and the `content` slot.
- `tab-pane.twig` — template.
- `tab-pane.stories.twig` / `tab-pane.stories.json` — Storybook stories.
- `tab-pane.mdx` — Storybook docs page.

## Props overview

| Property | Type | Description | Default |
|---|---|---|---|
| `pane_id` | string | Optional — leave empty to auto-generate. `tabs.js` always assigns this pane's live id, paired with its Tab Item by position, so no value here (or a duplicate one) affects the pairing | `''` (auto-generated) |
| `is_active` | boolean | Whether this pane is the current/visible one on the live page (ignored in Canvas, where it's always visible) | `false` |
| `attributes` | object | HTML attributes for the pane element | `{}` |

## Slots

| Slot | Description |
|---|---|
| `content` | The tab's body content. |

## Example

```twig
{% set items %}
  {{ include('vartheme_bs5_rightup:tab-item', {title: 'All', is_active: true}, with_context: false) }}
  {{ include('vartheme_bs5_rightup:tab-item', {title: 'Architecture'}, with_context: false) }}
{% endset %}
{% set panes %}
  {% set content %}<p>All content.</p>{% endset %}
  {{ include('vartheme_bs5_rightup:tab-pane', {content: content}, with_context: false) }}
  {% set content %}<p>Architecture content.</p>{% endset %}
  {{ include('vartheme_bs5_rightup:tab-pane', {content: content}, with_context: false) }}
{% endset %}
{{ include('vartheme_bs5_rightup:tabs', {
  shape: 'tabs',
  items: items,
  panes: panes
}, with_context: false) }}
```

## Notes

- Not meant to be used standalone outside of a `tab-content` wrapper — see [Tabs](../tabs/README.md), which provides it automatically once its `panes` slot is filled.
- Bootstrap's toggle/fade behavior comes from the `bs-tab-script` library (already a dependency of the Tabs component) plus the core Bootstrap CSS already loaded theme-wide — no extra CSS or JS is needed in this component.
- `pane_id` is fully optional — leave it empty (the default) and the parent Tabs component's `tabs.js` re-pairs the Nth Tab Item with the Nth Tab Pane by DOM order and rewrites both sides' ids automatically. If left empty, `tab-pane.twig` auto-generates a placeholder id (same fallback pattern as the Tabs component's `tabs_id`) purely so the no-JS render still has a valid, non-empty `id` attribute — that placeholder is never relied on for pairing, so duplicating this component (e.g. copy/paste in Canvas, which copies the exact same prop values into the new instance) is harmless even if both copies end up with the same typed `pane_id`, or none at all. `is_active` here is likewise just a fallback: `tabs.js` overrides this pane's visible state to match its paired Tab Item's `active` state. Keep panes in the same order as their paired Tab Items in the `items` slot. See [Tabs](../tabs/README.md)'s Notes.
