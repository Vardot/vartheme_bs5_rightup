# Byline

Author and/or date byline (e.g. "By Jane Doe · Jan 1, 2026") used under article headlines and teasers.

## Bootstrap reference

> [Bootstrap 5.3 — Colors](https://getbootstrap.com/docs/5.3/utilities/colors/)
> [Bootstrap 5.3 — Text](https://getbootstrap.com/docs/5.3/utilities/text/#font-size)

## What it does

Use this component under a headline or teaser title when you need a compact byline that can:

- show an author name, optionally as a link
- show a date, using the same `<time>` element as `atoms/date`
- show both together, separated by a middle dot
- render nothing at all when neither is set, so it's safe to always include

## Files

- `byline.component.yml` — component schema and props
- `byline.twig` — component template
- `README.md` — usage notes and examples
- `byline.mdx` — Storybook docs page
- `byline.stories.json` — Storybook story configuration
- `byline.stories.twig` — Storybook story templates

## Props overview

- `author`: Author name shown after "By"; leave empty to omit. Defaults to `''`
- `author_url`: If set, the author name renders as a link. Defaults to `''`
- `date`: ISO 8601 date string (`YYYY-MM-DD`); leave empty to omit. Defaults to `''`
- `size`: Bootstrap font-size utility — `fs-1` through `fs-6`; defaults to `fs-6`
- `text_color`: Bootstrap text color utility — `text-muted`, `text-body`, `text-primary`, `text-secondary`, `text-dark`; defaults to `text-muted`

## Available attributes

- `attributes` — HTML attributes for the root `<p>` element

## Example

```twig
{% include 'vartheme_bs5_rightup:byline' with {
  author: 'Tomas Adeyemi',
  date: '2026-01-31',
  size: 'fs-6',
  text_color: 'text-muted'
} only %}
```

Author only, no date:

```twig
{% include 'vartheme_bs5_rightup:byline' with {
  author: 'Tomas Adeyemi',
  author_url: '/authors/tomas-adeyemi'
} only %}
```

## Notes

- Renders nothing (no empty `<p>`) when both `author` and `date` are empty.
- The author link uses `text-reset` so it inherits the byline's own color instead of Bootstrap's default link blue, matching a subtle editorial byline look.
- No inline styles or custom SCSS are used; styling is driven entirely by Bootstrap utility classes.
