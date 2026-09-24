# Vartheme BS5 Rightup functional testing suite

Automated functional acceptance tests for the theme, written in Gherkin and run
with [@vardot/varbase-e2e](https://www.npmjs.com/package/@vardot/varbase-e2e)
(Playwright + Cucumber-js), the same harness as the Varbase functional testing
suite and the RightUp site template recipe suite.

## Run it

```bash
yarn install
npx playwright install --with-deps chromium
LAUNCH_URL=https://<your-site> yarn test
LAUNCH_URL=https://<your-site> FEATURES=tests/features/01-01-header-search.feature yarn test
```

`LAUNCH_URL` is the only per-environment setting; no feature file carries a
hostname.

## Fixtures the suite expects

`01-02-header-search-signed-in.feature` signs in as the Varbase testing users
the workspace builder's `--add-users` step creates (`Normal user`, `Content
editor`, `Content admin`, `SEO admin`, `Site admin`, `Super admin`, password
`dD.123123ddd`). On a site without them, create them with the site's own role
machine names before running that file. The uid 1 account is read from
`DRUPAL_ADMIN_USERNAME` / `DRUPAL_ADMIN_PASSWORD`.

The header search scenarios expect the RightUp site template content, where the
site header carries the full-width icon toggle and `/search` is the search view.

Search result counts are never asserted (see Drupal CMS work item 3591453).
