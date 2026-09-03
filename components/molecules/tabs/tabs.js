/**
 * @file
 * Auto-wires each Tabs component's Tab Item / Tab Pane pairs by DOM order.
 *
 * Tab Item and Tab Pane are separate SDC components, each authored
 * independently in Drupal Canvas (see tabs/README.md — "Items (and panes)
 * are composed via slots" — so each tab is its own editable component).
 * Nothing server-side keeps them in sync, so a content editor previously had
 * to: (1) give the Tab Item a Pane ID just to opt it into JS-tab mode at
 * all, (2) type that same Pane ID into the paired Tab Pane, and (3) keep
 * both components' Active flag in agreement — three manual, error-prone
 * steps for what is really one authoring decision ("these N items go with
 * these N panes, in order").
 *
 * This behavior removes all three: whenever a Tabs instance has any Tab
 * Panes at all, every plain nav-link is promoted into a real Bootstrap JS
 * tab and paired with the pane at the same position — regardless of
 * whether a Pane ID was ever typed into either component — and each pane's
 * visible/active state is synced to whichever paired tab link is marked
 * active, regardless of the pane's own Active flag. Tab links beyond the
 * pane count (more items than panes) are left untouched as plain
 * navigation links, so a trailing plain filter link can still be mixed in.
 * Bootstrap's tab plugin resolves data-bs-target via event delegation at
 * click time (not at load time), so rewriting these attributes on attach,
 * before any click happens, is safe.
 */
((Drupal, once) => {
  Drupal.behaviors.varthemeBs5TabsAutoPaneId = {
    attach(context) {
      once(
        'varthemeBs5TabsAutoPaneId',
        '.tabs[role="tablist"]',
        context,
      ).forEach((tabsEl) => {
        const links = Array.from(tabsEl.querySelectorAll('a.nav-link'));
        if (!links.length) {
          return;
        }

        // tabs.twig always renders the tab-content wrapper right after
        // this list — walk forward to find it rather than assuming a
        // fixed DOM depth, in case Canvas wraps the Tabs instance for
        // editing.
        let paneWrap = tabsEl.nextElementSibling;
        while (paneWrap && !paneWrap.classList.contains('tab-content')) {
          paneWrap = paneWrap.nextElementSibling;
        }
        if (!paneWrap) {
          return;
        }

        const panes = Array.from(paneWrap.querySelectorAll('.tab-pane'));
        if (!panes.length) {
          return;
        }

        const pairCount = Math.min(links.length, panes.length);
        if (links.length !== panes.length) {
          console.warn(
            `Tabs "#${tabsEl.id}": ${links.length} Tab Item(s) but ` +
              `${panes.length} Tab Pane(s) — only pairing the first ` +
              `${pairCount}.`,
          );
        }

        for (let i = 0; i < pairCount; i += 1) {
          const link = links[i];
          const pane = panes[i];
          const paneId = `${tabsEl.id}-pane-${i}`;
          const tabId = `${paneId}-tab`;
          const isActive = link.classList.contains('active');

          link.id = tabId;
          link.setAttribute('href', `#${paneId}`);
          link.setAttribute('data-bs-toggle', 'tab');
          link.setAttribute('data-bs-target', `#${paneId}`);
          link.setAttribute('role', 'tab');
          link.setAttribute('aria-controls', paneId);
          link.setAttribute('aria-selected', isActive ? 'true' : 'false');

          pane.id = paneId;
          pane.setAttribute('role', 'tabpanel');
          pane.setAttribute('aria-labelledby', tabId);
          pane.setAttribute('tabindex', '0');
          pane.classList.toggle('active', isActive);
          pane.classList.toggle('show', isActive);
        }
      });
    },
  };
})(Drupal, once);
