# Author

Author byline with a static prefix and a dynamic author name (e.g. "By: Jane Doe"). Used to credit content authors on cards and teasers.

## Bootstrap reference

> [Bootstrap 5.3 — Text](https://getbootstrap.com/docs/5.3/utilities/text/#font-size)
> [Bootstrap 5.3 — Colors](https://getbootstrap.com/docs/5.3/utilities/colors/)

## What it does

Use this component when you need a simple author credit line that can:

- combine a static prefix (e.g. "By:") with a dynamic author name
- render nothing at all when the author name is empty, so it's safe to always include
- omit the prefix on its own when it's left blank, while still showing the author name

## Files

- `author.component.yml` — component schema and props
- `author.twig` — component template
- `README.md` — usage notes and examples
- `author.mdx` — Storybook docs page
- `author.stories.json` — Storybook story configuration
- `author.stories.twig` — Storybook story templates

## Props overview

- `prefix`: static text shown before the author name (e.g. `By:`); defaults to `By:`
- `author`: dynamic author name shown after the prefix; leave empty to omit the whole component. Defaults to `''`
- `size`: Bootstrap font-size utility — `fs-1` through `fs-6`; defaults to `fs-6`
- `text_color`: Bootstrap text color utility — `text-muted`, `text-body`, `text-primary`, `text-secondary`, `text-dark`; defaults to `text-muted`

## Available attributes

- `attributes` — HTML attributes for the root `<p>` element

## Example

```twig
{% include 'vartheme_bs5_rightup:author' with {
  prefix: 'By:',
  author: 'Jane Doe',
  size: 'fs-6',
  text_color: 'text-muted'
} only %}
```

Author name only, no prefix:

```twig
{% include 'vartheme_bs5_rightup:author' with {
  prefix: '',
  author: 'Jane Doe'
} only %}
```

Larger, primary-colored byline:

```twig
{% include 'vartheme_bs5_rightup:author' with {
  prefix: 'By:',
  author: 'Jane Doe',
  size: 'fs-4',
  text_color: 'text-primary'
} only %}
```

## Notes

- Renders nothing (no empty `<p>`) when `author` is empty.
- No inline styles or custom SCSS are used; styling is driven entirely by Bootstrap utility classes.
- For a byline that also needs a date or a linked author name, use `molecules/byline` instead.
