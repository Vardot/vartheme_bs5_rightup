# Language Switcher

The language switcher block's links in one row, each named in its own language.

## Bootstrap reference

> [Bootstrap 5.3 — Flex](https://getbootstrap.com/docs/5.3/utilities/flex/)

## What it does

- Renders the links of core's language switcher block as a row (`d-flex`, `gap-2`).
- Each link takes its colour from the band around it, so it reads on the dark header and on a light band.
- The current language is underlined (core adds `is-active` and `aria-current="page"`), not marked by colour alone.
- Each link is at least 24 by 24 pixels and has a visible focus ring.
- Each link carries a `lang` attribute equal to its `hreflang`, set by `vartheme_bs5_rightup_preprocess_links__language_block()`.

## Files

- `language-switcher.component.yml`, `language-switcher.twig`, `language-switcher.scss` (compiled to `language-switcher.css`).
- `templates/navigation/links--language-block.html.twig` includes this component.

## Props overview

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `links` | array | `[]` | The language links prepared by `template_preprocess_links()`, keyed by langcode. |

## Example

```twig
{% include 'vartheme_bs5_rightup:language-switcher' with { links: links, attributes: attributes } only %}
```

## Notes

- `noUi: true`: not offered in Drupal Canvas. Place the core "Language switcher" block instead.
