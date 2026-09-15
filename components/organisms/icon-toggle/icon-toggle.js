/**
 * @file
 * Icon Toggle behavior.
 *
 * Owns only the open/close state and focus management — sibling elements
 * (e.g. the main menu) are left untouched and stay visible the whole time;
 * the panel overlays them instead of displacing them.
 *
 * The panel's configured side (`placement` prop → `--end`/`--start`
 * modifier) is a default, not a guarantee: a button placed near the
 * viewport's start edge in a content area (rather than the end of a
 * header/navbar) can still overflow off-screen on that side. On every
 * open, `positionPanel()` measures the panel against the viewport and adds
 * `icon-toggle--flip` (see icon-toggle.scss) to swap to the other logical
 * side when the default one would overflow.
 *
 * Inside the Drupal Canvas editor preview iframe the panel starts open (and
 * stays open) instead of waiting for a click: the panel is the only way to
 * see the "content" slot and drop content into it, so it can't stay hidden
 * behind a click a builder has no reason to make. Same `is-canvas-preview`
 * detection as sticky-header.js. Opt out per-instance once content is placed
 * via the `expand_in_editor` prop (→ `icon-toggle--collapsed-in-editor`
 * modifier) if the always-open panel clutters the editor view — the
 * front-end click/close behavior is unaffected either way.
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

  Drupal.behaviors.varthemeBs5IconToggle = {
    attach(context) {
      once('vartheme-bs5-icon-toggle', '.icon-toggle', context).forEach(
        (root) => {
          const button = root.querySelector('.icon-toggle__button');
          const panel = root.querySelector('.icon-toggle__panel');

          if (!button || !panel) {
            return;
          }

          // The icon swap is CSS, not JS: both icons are in the markup and
          // `icon-toggle--open` cross-fades and slides between them, per the
          // design's interaction guideline. Toggling classes here too would
          // fight that transition.

          const closedLabel = button.getAttribute('aria-label');
          const openLabel = button.dataset.iconToggleOpenLabel || closedLabel;

          const isOpen = () => root.classList.contains('icon-toggle--open');

          // Clicking the dimmed page closes the search, which is what a fade
          // over the page leads a visitor to expect.
          const scrimEl = root.querySelector('.icon-toggle__scrim');
          if (scrimEl) {
            scrimEl.addEventListener('click', () => {
              if (isOpen()) {
                close();
                button.focus();
              }
            });
          }

          // Measures the panel against the viewport and flips it to the
          // other logical side if the configured side overflows. Runs
          // synchronously right after the panel becomes visible (still
          // within the same task as the `hidden` removal), so the browser
          // paints the corrected position on the first frame — no flicker.
          // The full-width bar is fixed to the viewport, so it needs the
          // header's bottom edge as its offset. Measured on open rather than
          // assumed, because the header's height changes with the sticky
          // state and the breakpoint.
          const positionFullBar = () => {
            if (!root.classList.contains('icon-toggle--panel-full')) {
              return;
            }
            const header =
              root.closest('header') ||
              root.closest('[class*="page-region"]') ||
              root.closest('.navbar');
            const bottom = header
              ? header.getBoundingClientRect().bottom
              : button.getBoundingClientRect().bottom;
            panel.style.setProperty(
              '--icon-toggle-panel-offset',
              `${Math.round(bottom)}px`,
            );
            // The fade starts below the bar, so it needs the bar's own height
            // added. Read after the panel is visible, so it is the real one.
            const scrim = root.querySelector('.icon-toggle__scrim');
            if (scrim) {
              scrim.style.setProperty(
                '--icon-toggle-scrim-offset',
                `${Math.round(bottom + panel.getBoundingClientRect().height)}px`,
              );
            }
          };

          const positionPanel = () => {
            root.classList.remove('icon-toggle--flip');
            const rect = panel.getBoundingClientRect();
            const viewportWidth = document.documentElement.clientWidth;
            if (rect.left < 0 || rect.right > viewportWidth) {
              root.classList.add('icon-toggle--flip');
            }
          };

          const close = () => {
            root.classList.remove('icon-toggle--open');
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-label', closedLabel);
            panel.setAttribute('hidden', '');
          };

          const open = ({ focusInput = true } = {}) => {
            root.classList.add('icon-toggle--open');
            button.setAttribute('aria-expanded', 'true');
            button.setAttribute('aria-label', openLabel);
            panel.removeAttribute('hidden');
            positionFullBar();
            positionPanel();
            if (focusInput) {
              const input = panel.querySelector(
                'input[type="search"], input[type="text"], input:not([type])',
              );
              if (input) {
                input.focus();
              }
            }
          };

          if (
            inCanvasPreview() &&
            !root.classList.contains('icon-toggle--collapsed-in-editor')
          ) {
            // Stay open regardless of clicks elsewhere in the builder canvas
            // (e.g. selecting other components) — closing would hide the
            // "content" slot a builder needs to drop content into.
            open({ focusInput: false });
            return;
          }

          button.addEventListener('click', () => {
            if (isOpen()) {
              close();
            } else {
              open();
            }
          });

          document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && isOpen()) {
              close();
              button.focus();
            }
          });

          document.addEventListener('click', (event) => {
            if (isOpen() && !root.contains(event.target)) {
              close();
            }
          });
        },
      );
    },
  };
})(Drupal, once);
