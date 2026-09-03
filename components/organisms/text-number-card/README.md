# Text Number Card

Stacked card with a numbered brand-color badge (e.g. "01") and a flexible content slot below it (heading, text, meta, button, etc.) — for step-by-step or itemized listings.

## Bootstrap reference

> [Bootstrap 5.3 — Colors](https://getbootstrap.com/docs/5.3/utilities/colors/)

## What it does

Use this component for a numbered step/feature listing (e.g. "how it works", process breakdowns) that can:

- show a short number/index in a small brand-color badge
- hold any combination of content below the number in a single flexible slot — heading, text, meta line, button, etc.
- switch the card's own background color

## Files

- `text-number-card.component.yml` — component schema and props
- `text-number-card.twig` — component template
- `README.md` — usage notes and examples
- `text-number-card.mdx` — Storybook docs page
- `text-number-card.stories.json` — Storybook story configuration
- `text-number-card.stories.twig` — Storybook story templates

## Props overview

- `number`: step or index number shown in the badge (e.g. `01`); defaults to `01`
- `number_color`: Bootstrap theme color for the number badge background — `bg-tertiary` (Blue) or `bg-accent` (Accent / Mint); defaults to `bg-tertiary`
- `background_color`: brand background color for the card — `none`, `bg-body-tertiary`, `bg-tertiary`, `bg-accent`, `bg-primary`, `bg-primary-subtle`, `bg-secondary`, `bg-secondary-subtle`, `bg-dark`; defaults to `none`

## Available attributes

- `attributes` — HTML attributes for the root element
- `number_attributes` — HTML attributes for the number badge element
- `content_attributes` — HTML attributes for the content wrapper element

## Slots

- `content` — flexible content below the number badge (heading, text, meta line, button, etc.)

## Example

```twig
{% embed 'vartheme_bs5_rightup:text-number-card' with {
  number: '01',
  number_color: 'bg-tertiary',
  background_color: 'none'
} only %}
  {% block content %}
    {% include 'vartheme_bs5_rightup:heading' with {
      heading_text: 'Studio Breakdowns',
      level: 3
    } only %}
    {% include 'vartheme_bs5_rightup:text' with {
      text: '<p>One real project, start to finish, with the parts that usually get cut from the case study.</p>'
    } only %}
  {% endblock %}
{% endembed %}
```

## Notes

- The number badge's foreground pairs the same way as `organisms/horizontal-text-icon-card`'s icon: `bg-tertiary` gets a white number, `bg-accent` gets a dark number, matching Bootstrap's own contrast pairing for each theme color.
- The number badge has square corners (no border radius) by design — it is not exposed as a prop.
- `background_color` auto-pairs with `text-white` only for the theme colors that read as visually dark (`bg-primary`, `bg-tertiary`, `bg-dark`, `bg-body-tertiary`); the rest keep the inherited dark text color. This cascades to any heading/text placed in the `content` slot that doesn't set its own explicit color.
- The `content` slot is fully flexible — combine `atoms/heading`, `atoms/text`, or anything else via `{% embed %}` / `{% block content %}`, the same pattern used by `atoms/section` and `organisms/horizontal-text-icon-card`.
