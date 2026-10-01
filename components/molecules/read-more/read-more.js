/**
 * @file
 * Read more behavior.
 *
 * Collapses the content to a number of lines and lets the button expand it.
 */
((Drupal, once) => {
  Drupal.behaviors.varthemeBs5ReadMore = {
    attach(context) {
      once('vartheme-bs5-read-more', '.read-more', context).forEach((root) => {
        const content = root.querySelector('.read-more__content');
        const toggle = root.querySelector('.read-more__toggle');
        if (!content || !toggle) {
          return;
        }
        const lines = parseInt(root.dataset.readMoreLines, 10) || 4;
        const sample = content.querySelector('p, li') || content;
        const lineHeight =
          parseFloat(getComputedStyle(sample).lineHeight) || 24;
        const height = Math.round(lines * lineHeight);
        // Short content needs no button.
        if (content.scrollHeight <= height + lineHeight) {
          return;
        }
        root.style.setProperty('--read-more-height', `${height}px`);
        root.classList.add('is-collapsible');
        toggle.hidden = false;

        const setExpanded = (expanded) => {
          root.classList.toggle('is-expanded', expanded);
          toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          toggle.textContent = expanded
            ? toggle.dataset.lessText
            : toggle.dataset.moreText;
        };
        toggle.addEventListener('click', () => {
          setExpanded(!root.classList.contains('is-expanded'));
        });
        // Never leave keyboard focus on a link hidden by the collapse.
        content.addEventListener('focusin', () => setExpanded(true));
      });
    },
  };
})(Drupal, once);
