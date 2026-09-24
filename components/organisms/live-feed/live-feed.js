/**
 * @file
 * Seamless scroll-loop for the Live Feed ticker.
 *
 * Progressive enhancement: the server renders the "items" slot's content
 * exactly once, in order, fully readable without this behavior — the CSS
 * animation itself only activates once this script adds the "is-looping"
 * class (see live-feed.scss), so a no-JS visitor gets a static, non-jumping
 * list rather than an animation that abruptly resets every loop.
 *
 * When this behavior runs (and prefers-reduced-motion is not set), it clones
 * the track's single group of items once and appends the clone, so a CSS
 * `translateX(-50%)` animation can loop seamlessly. The clone is marked
 * aria-hidden (the feed should be announced once, not twice) and inert, so
 * nothing inside it can take focus. aria-hidden alone does not remove an
 * element from the tab order, and a per-link tabindex misses what other
 * behaviors add later, such as the contextual links button.
 *
 * Also skipped inside the Drupal Canvas editor surface: a continuously
 * scrolling ticker there makes it harder to click/select/drag items while
 * editing. Canvas's own live-preview iframe (which mirrors the frontend)
 * and the public frontend itself both still animate normally — only the
 * editor's own canvas is skipped.
 */
((Drupal, once) => {
  // Mirrors lib/currentlyInCanvasEditor.js, duplicated rather than imported:
  // this behavior loads as a classic script (Drupal.behaviors + once), and
  // that helper is only ever used from an ES module (see
  // components/atoms/anchor/anchor.js, which opts into `type: module` via
  // its own libraryOverrides) — module and classic script loading aren't
  // mixed anywhere else in this theme, so this stays a plain script.
  const inCanvasEditor = () =>
    Boolean(
      window.parent &&
      window.parent.drupalSettings &&
      window.parent.drupalSettings.canvas &&
      !window.parent.document.body.querySelector(
        '[class^="_PagePreviewIframe"]',
      ),
    );

  Drupal.behaviors.varthemeBs5RightupLiveFeed = {
    attach(context) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      if (inCanvasEditor()) {
        return;
      }

      once(
        'varthemeBs5RightupLiveFeed',
        '.live-feed__track',
        context,
      ).forEach((track) => {
        const group = track.querySelector('.live-feed__group');
        // No group, or nothing but the empty-slot fallback message (no real
        // items yet) — nothing to loop.
        if (!group || group.querySelector('.live-feed__fallback')) {
          return;
        }

        const clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.inert = true;
        clone
          .querySelectorAll('a, button, [tabindex]')
          .forEach((el) => el.setAttribute('tabindex', '-1'));

        track.appendChild(clone);

        // Duration is derived, not fixed: the animation travels one group's
        // width per cycle, so a fixed duration would make a longer feed scroll
        // faster. Deriving it from the measured width keeps the reading speed
        // constant however many items the view returns.
        const feed = track.closest('.live-feed');
        const speed =
          Number(feed && feed.getAttribute('data-live-feed-speed')) || 60;
        const distance = group.getBoundingClientRect().width;
        if (distance > 0) {
          track.style.setProperty(
            '--live-feed-duration',
            `${(distance / speed).toFixed(2)}s`,
          );
        }

        track.classList.add('is-looping');
      });
    },
  };
})(Drupal, once);
