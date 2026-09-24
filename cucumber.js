// cucumber-js configuration for the Vartheme BS5 Rightup functional testing
// suite. Loads the Varbase E2E core step definitions plus the theme's own
// steps under tests/step-definitions/.
//
//   LAUNCH_URL=https://<site> npx cucumber-js --config cucumber.js
//   FEATURES=tests/features/01-01-header-search.feature npx cucumber-js
//
// Reports land in tests/reports/. Disable the auto HTML hook with
// VARBASE_E2E_REPORT_DISABLE=1 and run generate-reports in CI instead.
module.exports = {
  default: {
    // Above Playwright's own 30s default, so a locator timeout surfaces as a
    // friendly varbase-e2e error rather than cucumber's raw "function timed out".
    timeout: 60000,
    // Retry once, as the RightUp recipe suite does: the first signed-in page on
    // a cold cache can outlast a step timeout without any real defect.
    retry: 1,
    paths: [process.env.FEATURES || 'tests/features/**/*.feature'],
    requireModule: ['tsx/cjs'],
    require: [
      'node_modules/@vardot/varbase-e2e/tests/step-definitions/**/*.js',
      'tests/step-definitions/**/*.js',
    ],
    format: [
      '@cucumber/pretty-formatter',
      `json:tests/reports/${process.env.CUCUMBER_JSON || 'cucumber_report'}.json`,
    ],
    worldParameters: {
      launchUrl:
        process.env.LAUNCH_URL ||
        process.env.DDEV_PRIMARY_URL ||
        'https://localhost',
      // The Varbase testing users, as the workspace builder's --add-users step
      // creates them. The uid 1 account is env-driven: its password is per
      // machine and never belongs in a committed file.
      users: {
        webmaster: {
          username: process.env.DRUPAL_ADMIN_USERNAME || 'webmaster',
          password: process.env.DRUPAL_ADMIN_PASSWORD || 'dD.123123ddd',
        },
        'Normal user': { username: 'Normal user', password: 'dD.123123ddd' },
        'Content editor': {
          username: 'Content editor',
          password: 'dD.123123ddd',
        },
        'Content admin': {
          username: 'Content admin',
          password: 'dD.123123ddd',
        },
        'SEO admin': { username: 'SEO admin', password: 'dD.123123ddd' },
        'Site admin': { username: 'Site admin', password: 'dD.123123ddd' },
        'Super admin': { username: 'Super admin', password: 'dD.123123ddd' },
      },
      minWaitTime: {
        // Per-navigation settle budget. The front page carries media that keeps
        // a request in flight, so the budget is a ceiling the steps rarely reach.
        page: 8000,
        before_scenario: 0,
        after_scenario: 0,
        before_step: 0,
        after_step: 0,
      },
      selectors: {
        css: {},
        xpath: {},
        filesPath: './tests/selectors/',
        files: [],
        offset: 60,
        breakpoints: {
          xs: { width: 375, height: 667 },
          sm: { width: 576, height: 800 },
          md: { width: 768, height: 1024 },
          lg: { width: 992, height: 768 },
          xl: { width: 1200, height: 900 },
          xxl: { width: 1400, height: 900 },
          xxxl: { width: 1920, height: 1080, default: true },
        },
      },
      screenshot: {
        dir: './tests/screenshots',
        purge: false,
        onFailed: true,
        onEveryStep: false,
        alwaysFullscreen: false,
        failedPrefix: 'failed_',
        filenamePattern: '{datetime}.{feature_file}.feature_{step_line}.{ext}',
        filenamePatternFailed:
          '{failed_prefix}{datetime}.{feature_file}.feature_{step_line}.{ext}',
      },
      video: {
        mode: process.env.VARBASE_E2E_VIDEO || 'off',
        dir: './tests/videos',
        size: { width: 1920, height: 1080 },
        filenamePattern: '{datetime}.{feature_file}.{scenario}.{status}.{ext}',
      },
      javascript: {
        // Collected console errors are reported, not fatal: the front page
        // carries third-party embeds this theme does not own. Do not tag
        // scenarios @javascript: that tag forces the failing mode.
        mode: process.env.VARBASE_E2E_JS_ERROR_MODE || 'warn',
        levels: ['error'],
        ignore: '',
        beforeScenario: false,
        afterScenario: true,
      },
    },
  },
};
