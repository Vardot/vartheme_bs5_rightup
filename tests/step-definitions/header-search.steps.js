// -----------------------------------------------------------------------------
// Header search step definitions for the Vartheme BS5 Rightup theme.
//
// The full-width header search bar (components/organisms/icon-toggle) is
// `position: fixed` and gets its own top offset from JavaScript, measured
// against the header's bottom edge on every open. Nothing in varbase-e2e can
// assert that relationship: the built-in relative-position steps compare
// absolute page coordinates of two named selectors, which passes for a bar
// that has landed anywhere below the header, including behind an admin
// toolbar. These steps read the live geometry instead, so a toolbar that
// shifts the header down is caught rather than tolerated.
// -----------------------------------------------------------------------------

const { Then } = require('@cucumber/cucumber');
const assert = require('assert');
const {
  smartSettle,
  friendly,
} = require('@vardot/varbase-e2e/tests/step-definitions/varbase-e2e');

// The JS rounds the measured offset to whole pixels, and the header's own
// bottom edge is fractional, so the bar can legitimately sit up to a pixel
// away from it.
const EDGE_TOLERANCE = 2;

// Every fixed bar Drupal's admin toolbars paint: the Navigation module's
// sidebar and top bar, Gin's top bar, and the classic core toolbar.
const TOOLBAR_SELECTORS =
  '#admin-toolbar, .admin-toolbar, .top-bar, #toolbar-administration, .toolbar-oriented';

const PANEL = '.icon-toggle--panel-full .icon-toggle__panel';
const SCRIM = '.icon-toggle--panel-full .icon-toggle__scrim';
const HEADER = 'header[role="banner"]';

/**
 * Read the geometry of the header, the bar, the fade and any admin toolbar.
 *
 * @param {object} page
 *   The Playwright page.
 * @param {string} toolbarSelectors
 *   Selectors for every admin toolbar that may be painted.
 * @param {string} panel
 *   The search bar selector.
 * @param {string} scrim
 *   The page fade selector.
 * @param {string} header
 *   The site header selector.
 *
 * @return {Promise<object>}
 *   The measured boxes.
 */
async function readLayout(page, toolbarSelectors, panel, scrim, header) {
  return page.evaluate(
    ([toolbarSel, panelSel, scrimSel, headerSel]) => {
      const box = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
      };
      const panelEl = document.querySelector(panelSel);
      const scrimEl = document.querySelector(scrimSel);
      const headerEl = document.querySelector(headerSel);
      const toolbars = Array.from(document.querySelectorAll(toolbarSel))
        .map((el) => ({
          selector: el.id ? `#${el.id}` : `.${el.classList[0]}`,
          box: box(el),
        }))
        .filter((t) => t.box);
      // What the visitor actually sees at a point is what settles whether one
      // fixed layer covers another: z-index alone lies, because a nested
      // stacking context can rank a 1000 below a 501.
      const topmostAt = (x, y) => {
        const el = document.elementFromPoint(x, y);
        if (!el) return null;
        return {
          inPanel: Boolean(el.closest(panelSel)),
          inScrim: Boolean(el.closest(scrimSel)),
          inToolbar: Boolean(el.closest(toolbarSel)),
          tag: el.tagName.toLowerCase(),
        };
      };
      return {
        panel: box(panelEl),
        scrim: box(scrimEl),
        header: box(headerEl),
        toolbars,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        topmostAt: (() => {
          if (!toolbars.length || !panelEl) return null;
          const t = toolbars[0].box;
          const p = panelEl.getBoundingClientRect();
          const x = Math.round(t.left + Math.min(t.right - t.left, 40) / 2);
          const y = Math.round(p.top + p.height / 2);
          if (y < t.top || y > t.bottom) return null;
          return { x, y, ...topmostAt(x, y) };
        })(),
      };
    },
    [toolbarSelectors, panel, scrim, header],
  );
}

/**
 * Assert the open search bar is pinned to the header's bottom edge.
 *
 * Example #1: Then the search bar should sit directly below the site header
 * Example #2: And the search bar should sit directly below the site header
 * Example #3: Then we see the search bar should sit directly below the site header
 * Example #4: Then the search bar should sit directly below the site header
 * Example #5: And I see the search bar should sit directly below the site header
 */
Then(
  /^(?:(?:I |we )*see )?the search bar should sit directly below the site header$/,
  async function () {
    await smartSettle(this.page, 1500);
    const layout = await readLayout(
      this.page,
      TOOLBAR_SELECTORS,
      PANEL,
      SCRIM,
      HEADER,
    );

    if (!layout.panel) {
      throw friendly(
        'Could not measure the header search bar.',
        'Open it first: the panel is hidden while the search is closed.',
      );
    }
    if (!layout.header) {
      throw friendly(
        'Could not measure the site header.',
        'No visible header[role="banner"] on this page.',
      );
    }

    const gap = layout.panel.top - layout.header.bottom;
    assert.ok(
      Math.abs(gap) <= EDGE_TOLERANCE,
      `The search bar starts ${gap.toFixed(1)}px from the header's bottom edge ` +
        `(header bottom ${layout.header.bottom.toFixed(1)}, bar top ${layout.panel.top.toFixed(1)}), ` +
        `which is more than the ${EDGE_TOLERANCE}px the rounding allows.`,
    );
    assert.ok(
      layout.panel.top >= 0,
      `The search bar starts at ${layout.panel.top.toFixed(1)}px, above the top of the viewport.`,
    );
  },
);

/**
 * Assert the page fade starts below the bar rather than over it.
 *
 * Example #1: Then the page fade should start below the search bar
 * Example #2: And the page fade should start below the search bar
 * Example #3: Then I see the page fade should start below the search bar
 * Example #4: And we see the page fade should start below the search bar
 * Example #5: Then the page fade should start below the search bar
 */
Then(
  /^(?:(?:I |we )*see )?the page fade should start below the search bar$/,
  async function () {
    await smartSettle(this.page, 1500);
    const layout = await readLayout(
      this.page,
      TOOLBAR_SELECTORS,
      PANEL,
      SCRIM,
      HEADER,
    );

    if (!layout.scrim) {
      throw friendly(
        'Could not measure the page fade.',
        'It is only painted while the full-width search bar is open.',
      );
    }
    const gap = layout.scrim.top - layout.panel.bottom;
    assert.ok(
      gap >= -EDGE_TOLERANCE,
      `The page fade starts ${Math.abs(gap).toFixed(1)}px above the bottom of the search bar, so it covers the bar.`,
    );
    assert.ok(
      layout.scrim.bottom >= layout.viewport.height - EDGE_TOLERANCE,
      `The page fade stops at ${layout.scrim.bottom.toFixed(1)}px instead of running to the foot of the ${layout.viewport.height}px viewport.`,
    );
  },
);

/**
 * Assert the admin toolbar is not covered by the bar or the fade.
 *
 * Example #1: Then the admin toolbar should stay above the search bar and the page fade
 * Example #2: And the admin toolbar should stay above the search bar and the page fade
 * Example #3: Then I see the admin toolbar should stay above the search bar and the page fade
 * Example #4: And we see the admin toolbar should stay above the search bar and the page fade
 * Example #5: Then the admin toolbar should stay above the search bar and the page fade
 */
Then(
  /^(?:(?:I |we )*see )?the admin toolbar should stay above the search bar and the page fade$/,
  async function () {
    await smartSettle(this.page, 1500);
    const layout = await readLayout(
      this.page,
      TOOLBAR_SELECTORS,
      PANEL,
      SCRIM,
      HEADER,
    );

    if (!layout.toolbars.length) {
      throw friendly(
        'No admin toolbar is on this page.',
        'Use this step only in a scenario logged in as a user who gets the toolbar.',
      );
    }
    assert.ok(
      layout.panel,
      'The search bar is not open, so there is nothing to compare the toolbar with.',
    );

    const topBars = layout.toolbars.filter(
      (t) =>
        t.box.top <= EDGE_TOLERANCE &&
        t.box.right - t.box.left >= layout.viewport.width / 2,
    );
    topBars.forEach((bar) => {
      assert.ok(
        layout.panel.top >= bar.box.bottom - EDGE_TOLERANCE,
        `The search bar starts at ${layout.panel.top.toFixed(1)}px, over the "${bar.selector}" toolbar that runs to ${bar.box.bottom.toFixed(1)}px.`,
      );
    });

    if (layout.topmostAt) {
      assert.ok(
        layout.topmostAt.inToolbar &&
          !layout.topmostAt.inPanel &&
          !layout.topmostAt.inScrim,
        `At ${layout.topmostAt.x},${layout.topmostAt.y}, inside the admin toolbar beside the open search bar, ` +
          `the visitor sees ${layout.topmostAt.inPanel ? 'the search bar' : layout.topmostAt.inScrim ? 'the page fade' : `a <${layout.topmostAt.tag}>`} instead of the toolbar.`,
      );
    }
  },
);

/**
 * Assert which of the two swapped icons the toggle is showing.
 *
 * The component cross-fades the search and close icons in one well, so both
 * stay in the DOM and both stay "visible" to a visibility check: opacity is
 * what tells them apart.
 *
 * Example #1: Then the search toggle should show the "close" icon
 * Example #2: Then the search toggle should show the "search" icon
 * Example #3: And the search toggle should show the "close" icon
 * Example #4: And the search toggle should show the "search" icon
 * Example #5: Then I see the search toggle should show the "close" icon
 */
Then(
  /^(?:(?:I |we )*see )?the search toggle should show the "(search|close)" icon$/,
  async function (which) {
    await smartSettle(this.page, 1500);
    const opacity = await this.page.evaluate(() => {
      const root = document.querySelector('.icon-toggle--panel-full');
      if (!root) return null;
      const read = (sel) => {
        const el = root.querySelector(sel);
        return el ? Number(getComputedStyle(el).opacity) : null;
      };
      return {
        closed: read('.icon-toggle__icon--closed'),
        open: read('.icon-toggle__icon--open'),
      };
    });

    if (!opacity) {
      throw friendly(
        'Could not find the header search toggle.',
        'No .icon-toggle--panel-full on this page.',
      );
    }

    const shown = which === 'close' ? opacity.open : opacity.closed;
    const hidden = which === 'close' ? opacity.closed : opacity.open;
    assert.ok(
      shown === 1 && hidden === 0,
      `Expected the "${which}" icon alone. Search icon opacity ${opacity.closed}, close icon opacity ${opacity.open}.`,
    );
  },
);
