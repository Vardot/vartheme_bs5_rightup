# Subscribe Box

A single-row email signup form: an email input and a submit button joined into one bordered, square-cornered Bootstrap input-group.

## Bootstrap reference

> [Bootstrap 5.3 — Input group](https://getbootstrap.com/docs/5.3/forms/input-group/)

## What it does

Use this component when you need a compact email signup form that can:

- render an email input and a submit button as one seamless, bordered group
- point the form at any endpoint via an optional action URL (e.g. a newsletter service), or submit to the current page by default
- swap the button's Bootstrap color variant
- resize the whole group with Bootstrap's input-group size classes

## Files

- `subscribe-box.component.yml` — component schema and props
- `subscribe-box.twig` — component template
- `README.md` — usage notes and examples

## Props overview

- `label`: accessible label for the email input (visually hidden); defaults to `Email address`
- `placeholder`: placeholder text shown inside the empty email input; defaults to `Email Address`
- `input_name`: the `name` attribute submitted with the email value; defaults to `email`
- `button_label`: submit button text; defaults to `Subscribe`
- `button_variant`: Bootstrap button style class (`btn-primary`, `btn-secondary`, `btn-accent`, `btn-success`, `btn-danger`, `btn-warning`, `btn-info`, `btn-light`, `btn-dark`); defaults to `btn-accent`
- `size`: Bootstrap input-group size (`md`, `sm`, `lg`); defaults to `md`
- `action`: form action URL; left empty, the form submits to the current page
- `method`: form method (`post` | `get`); defaults to `post`

## Example

```twig
{% include 'vartheme_bs5_rightup:subscribe-box' with {
  label: 'Email address',
  placeholder: 'Email Address',
  button_label: 'Subscribe',
  button_variant: 'btn-accent',
  action: 'https://example.us1.list-manage.com/subscribe/post',
  method: 'post',
} only %}
```

## Notes

- The email input is `required` and uses `type="email"` for native browser validation; there is no server-side handling built in — point `action` at a real endpoint (e.g. a Mailchimp/newsletter service form action, or a custom Drupal route) to make it functional.
- Both the input and the button use the `border-dark` utility so their borders read as one continuous dark line around the group, and `rounded-0` so no corner is rounded, regardless of the button variant chosen.
- This is a self-contained form, not a wrapper around a Drupal-rendered form/block — use `icon-toggle` or `offcanvas-menu` instead when you need to embed an actual exposed-filter or webform block.
