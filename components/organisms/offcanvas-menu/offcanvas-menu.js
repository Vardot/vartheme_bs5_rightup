/**
 * @file
 * Offcanvas Menu behavior.
 *
 * Bootstrap's own Offcanvas plugin (`data-bs-toggle`/`data-bs-dismiss`,
 * already wired in the markup) drives all front-end open/close behavior —
 * this file only handles the Drupal Canvas editor preview.
 *
 * Inside the Canvas editor preview iframe the panel starts open (and stays
 * open) instead of waiting for a click: the panel is the only way to see the
 * "menu"/"utility"/"search" slots and drop content into them, so it can't
 * stay hidden behind a click a builder has no reason to make. Same
 * `is-canvas-preview` detection as sticky-header.js / icon-toggle.js.
 * Bootstrap's default backdrop and scroll-lock are switched off for this
 * forced-open instance only — left on, the backdrop covers the rest of the
 * builder canvas and makes it un-clickable, defeating the point of
 * previewing the page around the panel. Opt out per-instance once content is
 * placed via the `expand_in_editor` prop (→
 * `offcanvas-menu--collapsed-in-editor` modifier) if the always-open panel
 * clutters the editor view — the front-end click/open/close behavior is
 * unaffected either way.
 *
 * `expand_in_editor` is read fresh on every attach (rather than only ever
 * calling `.show()`) and explicitly `.hide()`s an already-open instance when
 * it's off, so toggling the prop off closes the panel even if Canvas
 * re-renders this input onto the same DOM node instead of a fresh one.
 *
 * Collapsing also force-sets `display: none` on the panel (on top of
 * Bootstrap's own `visibility: hidden`). The panel is `position: fixed` and
 * spans the full viewport height regardless of visibility, and the Canvas
 * editor's own region hit-area for the Header region is computed from the
 * bounding-box union of ALL descendants, invisible ones included — so a
 * merely `visibility: hidden` panel still balloons that hit-area to full
 * viewport height and silently eats clicks meant for other components
 * beneath it. `display: none` removes the element from the box model
 * entirely (an all-zero bounding rect), which is the only way to keep it out
 * of that calculation.
 */
((Drupal, once) => {
  // The preview document runs inside an iframe whose host element carries
  // `data-canvas-preview`; same-origin lets us read it from within the frame.
  const inCanvasPreview = () => {
    try {
      return Boolean(
        window.frameElement && 'canvasPreview' in window.frameElement.dataset,
      );
    } catch (e) {
      return false;
    }
  };

  Drupal.behaviors.varthemeBs5OffcanvasMenu = {
    attach(context) {
      once('vartheme-bs5-offcanvas-menu', '.offcanvas-menu', context).forEach(
        (root) => {
          if (!inCanvasPreview()) {
            return;
          }

          const panel = root.querySelector('.offcanvas-menu__panel');
          if (!panel || !window.Offcanvas) {
            return;
          }

          const instance = window.Offcanvas.getOrCreateInstance(panel, {
            backdrop: false,
            scroll: true,
          });

          if (root.classList.contains('offcanvas-menu--collapsed-in-editor')) {
            instance.hide();
            panel.style.display = 'none';
          } else {
            panel.style.removeProperty('display');
            instance.show();
          }
        },
      );
    },
  };
})(Drupal, once);
