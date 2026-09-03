# Tab Item

A single tab (`<li><a>` pair), meant to be placed inside a [Tabs](../tabs/README.md) component's `items` slot.

## Bootstrap reference

> [Bootstrap 5.3 — Navs and tabs](https://getbootstrap.com/docs/5.3/components/navs-tabs/)
> [JavaScript behavior](https://getbootstrap.com/docs/5.3/components/navs-tabs/#javascript-behavior)

## What it does

Renders one `nav-item`/`nav-link` pair, in one of two modes:

- **Plain filter/navigation link** (default) — set `url`; the link navigates like any other link.
- **Real Bootstrap JS tab** — set `pane_id` instead; the link gets `data-bs-toggle="tab"` plus the ARIA attributes Bootstrap's Tab plugin needs, and toggles the [Tab Pane](../tab-pane/README.md) with the matching `pane_id` in the parent Tabs component's `panes` slot, instead of navigating.

When `is_active` is true, the link gets the `active` class, which Tabs' styling turns into a filled `--brand-tertiary` box with no border radius (or the parent Tabs component's `active_bg`/`active_color` override, if set).

## Files

- `tab-item.component.yml` — SDC schema (`title`, `url`, `pane_id`, `is_active`, `attributes`).
- `tab-item.twig` — template.
- `tab-item.stories.twig` / `tab-item.stories.json` — Storybook stories.
- `tab-item.mdx` — Storybook docs page.

## Props overview

| Property | Type | Description | Default |
|---|---|---|---|
| `title` | string | The tab's label | |
| `url` | string | Where this tab links to. Used as a plain navigation link when Pane ID is empty | |
| `pane_id` | string | Turns this tab into a real Bootstrap JS tab that toggles a content pane instead of navigating (only matters for the no-JS render — `tabs.js` promotes plain links into tabs automatically whenever the parent Tabs component has panes). Leave empty to use `url` as a plain link | `''` |
| `is_active` | boolean | Whether this tab is the current/active one | `false` |
| `attributes` | object | HTML attributes for the link element | `{}` |

## Example

### Plain link

```twig
{{ include('vartheme_bs5_rightup:tab-item', {
  title: 'Architecture',
  url: '/architecture'
}, with_context: false) }}
```

### Real Bootstrap JS tab

```twig
{{ include('vartheme_bs5_rightup:tab-item', {
  title: 'Architecture',
  pane_id: 'architecture-pane'
}, with_context: false) }}
```

## Notes

- Not meant to be used standalone outside of a `<ul class="nav">`-like wrapper — see [Tabs](../tabs/README.md).
- The active tab's background/font color options live on the parent [Tabs](../tabs/README.md) component (`active_bg`/`active_color`), not here — Tabs applies them via a CSS descendant selector, so Tab Item stays the same regardless of which Tabs instance it's nested in.
- `pane_id` doesn't have to be set at all to pair with a Tab Pane — the parent Tabs component's `tabs.js` promotes every plain link into a real JS tab and re-pairs the Nth Tab Item with the Nth Tab Pane by DOM order automatically, as long as the Tabs component's `panes` slot has at least one Tab Pane. `is_active` doesn't have to agree with the paired Tab Pane's `is_active` either — `tabs.js` syncs the pane's visible state to this Tab Item's `active` state. See [Tabs](../tabs/README.md)'s Notes.
