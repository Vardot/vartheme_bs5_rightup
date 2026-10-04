/**
 * @file
 * Card Slider behavior: scrolls the track by one card per click and keeps
 * the previous/next controls' disabled state in sync with scroll position.
 * Progressive enhancement only — the track is a native scrollable/swipeable
 * element without JS, the controls simply have no effect.
 */
((Drupal, once) => {
  // In RTL, scrollLeft starts at 0 and goes negative, so compare magnitudes.
  function isRtl(track) {
    return window.getComputedStyle(track).direction === 'rtl';
  }

  function updateControls(track, prevButton, nextButton) {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const position = Math.abs(track.scrollLeft);
    if (prevButton) {
      prevButton.disabled = position <= 1;
    }
    if (nextButton) {
      nextButton.disabled = maxScroll <= 1 || position >= maxScroll - 1;
    }
  }

  function scrollByCard(track, direction) {
    const card = track.querySelector(':scope > *');
    if (!card) {
      return;
    }
    // Rely on the track's own gap rather than duplicating the value here —
    // the card's own width already reflects the visible-items preset.
    const gap =
      parseFloat(window.getComputedStyle(track).columnGap || '0') || 0;
    const amount =
      (card.getBoundingClientRect().width + gap) *
      direction *
      (isRtl(track) ? -1 : 1);
    track.scrollBy({ left: amount, behavior: 'smooth' });
  }

  Drupal.behaviors.cardSlider = {
    attach(context) {
      once('card-slider', '.card-slider', context).forEach((root) => {
        const track = root.querySelector('[data-card-slider-track]');
        if (!track) {
          return;
        }
        const prevButton = root.querySelector('[data-card-slider-prev]');
        const nextButton = root.querySelector('[data-card-slider-next]');

        updateControls(track, prevButton, nextButton);
        track.addEventListener(
          'scroll',
          () => updateControls(track, prevButton, nextButton),
          { passive: true },
        );
        window.addEventListener('resize', () =>
          updateControls(track, prevButton, nextButton),
        );

        if (prevButton) {
          prevButton.addEventListener('click', () => scrollByCard(track, -1));
        }
        if (nextButton) {
          nextButton.addEventListener('click', () => scrollByCard(track, 1));
        }
      });
    },
  };
})(Drupal, once);
