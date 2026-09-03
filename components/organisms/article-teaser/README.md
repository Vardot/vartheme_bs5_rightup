# Article Teaser

Editorial article teaser — optional image, category label, headline, byline, and a bottom divider — for magazine-style listings and grids.

## Bootstrap reference

> [Bootstrap 5.3 — Colors](https://getbootstrap.com/docs/5.3/utilities/colors/)
> [Bootstrap 5.3 — Ratio](https://getbootstrap.com/docs/5.3/helpers/ratio/)
> [Bootstrap 5.3 — Horizontal rules](https://getbootstrap.com/docs/5.3/content/reboot/#horizontal-rules)

## What it does

Use this component for each item in an editorial/magazine grid (a "latest articles" row, a sidebar list, a featured + list layout) that can:

- optionally show a teaser image with a controlled crop ratio, or omit it entirely for a text-only teaser
- show a small uppercase category label (e.g. "ARCHITECTURE"), plain or linked
- show a headline at any heading level/size, plain or linked
- show a byline (author and/or date) via `molecules/byline`
- show a thin divider below the byline, for stacking teasers in a list

It composes `atoms/image`, `atoms/heading`, `molecules/byline`, and `atoms/divider` — it does not introduce any new markup or styling of its own beyond the category label.

## Files

- `article-teaser.component.yml` — component schema and props
- `article-teaser.twig` — component template
- `README.md` — usage notes and examples
- `article-teaser.mdx` — Storybook docs page
- `article-teaser.stories.json` — Storybook story configuration
- `article-teaser.stories.twig` — Storybook story templates

## Props overview

### Image

- `media_image`: Optional teaser image; leave empty for a text-only teaser
- `image_ratio`: Bootstrap ratio crop — `ratio-auto`, `ratio-16x9`, `ratio-4x3`, `ratio-1x1`, `ratio-21x9`; only used when `media_image` is set; defaults to `ratio-4x3`

### Category

- `category_label`: Small uppercase label above the headline; leave empty to omit. Defaults to `''`
- `category_url`: If set, the category label renders as a link. Defaults to `''`
- `category_color`: Bootstrap text color utility — `text-primary`, `text-secondary`, `text-success`, `text-danger`, `text-warning`, `text-info`, `text-dark`; defaults to `text-primary`

### Headline

- `heading_text`: The headline. Defaults to `'Enter the title'`
- `heading_level`: HTML heading tag, `1`–`6`. Defaults to `3`
- `heading_size`: Optional typography utility overriding the level's visual size. Defaults to `default`
- `heading_url` / `heading_target`: Optional headline link and target

### Byline

- `author` / `author_url`: Optional byline author, plain or linked
- `date`: Optional ISO 8601 byline date (`YYYY-MM-DD`)

### Divider

- `show_divider`: Adds a thin divider below the byline. Defaults to `true`

## Available attributes

- `attributes` — HTML attributes for the root `<article>` element
- `media_attributes` — the image wrapper; only rendered when `media_image` is set

## Example

Featured teaser with an image:

```twig
{% include 'vartheme_bs5_rightup:article-teaser' with {
  media_image: { src: '/path/to/image.jpg', alt: 'Rotterdam flagship', width: 1200, height: 900 },
  image_ratio: 'ratio-4x3',
  category_label: 'Architecture',
  category_color: 'text-primary',
  heading_text: 'Fen & Marble Reveal First Look at Rotterdam Flagship',
  heading_level: 2,
  author: 'Tomas Adeyemi'
} only %}
```

Text-only teaser (no image), no bottom divider:

```twig
{% include 'vartheme_bs5_rightup:article-teaser' with {
  category_label: 'Process',
  heading_text: 'What Fen & Marble Actually Use to Pitch New Clients',
  heading_level: 4,
  author: 'Tom James',
  show_divider: false
} only %}
```

## Notes

- `media_image` presence is detected the same way `atoms/image` detects it (`media_image.src` not empty) — leaving it unset renders a text-only teaser with no empty image markup.
- The `date` prop uses JSON Schema `format: date`. When it's empty, this component omits the key entirely before calling `molecules/byline` — passing an explicit empty string into a `format: date` prop fails SDC schema validation, unlike a plain string prop where `''` is a valid "not set" value.
- No inline styles or custom SCSS are used; styling is driven entirely by Bootstrap utility classes plus the composed atoms/molecule.
