/**
 * @file
 * Remote Audio Player behavior.
 *
 * Drives a native <audio> element (hidden — see .audio-player-remote__media
 * in audio-player-remote.scss) with fully custom controls: play/pause
 * toggle, skip back/forward, elapsed/duration time, and a seek bar. The
 * seek bar is a real <input type="range">, re-skinned in CSS with a
 * `--audio-player-remote-progress` custom property kept in sync here so its
 * track paints a "played" vs "remaining" portion (see
 * audio-player-remote.scss).
 *
 * Progressive enhancement: without JS, the plain <audio> element is still
 * present (though visually hidden) and playable via assistive tech/browser
 * defaults; the custom buttons simply do nothing until this attaches.
 */
((Drupal, once) => {
  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return '0:00';
    }
    const whole = Math.floor(seconds);
    const minutes = Math.floor(whole / 60);
    const remainingSeconds = whole % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  Drupal.behaviors.varthemeBs5AudioPlayerRemote = {
    attach(context) {
      once('vartheme-bs5-audio-player-remote', '.audio-player-remote', context).forEach(
        (root) => {
          const media = root.querySelector('.audio-player-remote__media');
          const toggleButton = root.querySelector(
            '.audio-player-remote__button--toggle',
          );
          const playIcon = root.querySelector(
            '.audio-player-remote__icon--play',
          );
          const pauseIcon = root.querySelector(
            '.audio-player-remote__icon--pause',
          );
          const skipBackButton = root.querySelector(
            '.audio-player-remote__button--skip-back',
          );
          const skipForwardButton = root.querySelector(
            '.audio-player-remote__button--skip-forward',
          );
          const seek = root.querySelector('.audio-player-remote__seek');
          const currentTimeEl = root.querySelector(
            '.audio-player-remote__time-current',
          );
          const durationEl = root.querySelector(
            '.audio-player-remote__time-duration',
          );
          const skipSeconds = Number(root.dataset.skipSeconds) || 15;

          if (!media || !toggleButton) {
            return;
          }

          let isSeeking = false;

          const setProgress = (percent) => {
            if (seek) {
              seek.style.setProperty(
                '--audio-player-remote-progress',
                `${percent}%`,
              );
            }
          };

          const updateToggleUi = () => {
            const playing = !media.paused && !media.ended;
            toggleButton.setAttribute(
              'aria-label',
              playing ? Drupal.t('Pause') : Drupal.t('Play'),
            );
            if (playIcon && pauseIcon) {
              playIcon.classList.toggle('d-none', playing);
              pauseIcon.classList.toggle('d-none', !playing);
            }
          };

          const updateTimeUi = () => {
            if (currentTimeEl) {
              currentTimeEl.textContent = formatTime(media.currentTime);
            }
            if (durationEl) {
              durationEl.textContent = formatTime(media.duration);
            }
            if (
              !isSeeking &&
              seek &&
              Number.isFinite(media.duration) &&
              media.duration > 0
            ) {
              const percent = (media.currentTime / media.duration) * 100;
              seek.value = String(percent);
              setProgress(percent);
            }
          };

          toggleButton.addEventListener('click', () => {
            if (media.paused || media.ended) {
              media.play();
            } else {
              media.pause();
            }
          });

          if (skipBackButton) {
            skipBackButton.addEventListener('click', () => {
              media.currentTime = Math.max(0, media.currentTime - skipSeconds);
            });
          }

          if (skipForwardButton) {
            skipForwardButton.addEventListener('click', () => {
              const duration = Number.isFinite(media.duration)
                ? media.duration
                : media.currentTime + skipSeconds;
              media.currentTime = Math.min(
                duration,
                media.currentTime + skipSeconds,
              );
            });
          }

          if (seek) {
            seek.addEventListener('input', () => {
              isSeeking = true;
              setProgress(Number(seek.value));
            });
            seek.addEventListener('change', () => {
              if (Number.isFinite(media.duration) && media.duration > 0) {
                media.currentTime = (Number(seek.value) / 100) * media.duration;
              }
              isSeeking = false;
            });
          }

          media.addEventListener('play', updateToggleUi);
          media.addEventListener('pause', updateToggleUi);
          media.addEventListener('ended', updateToggleUi);
          media.addEventListener('loadedmetadata', updateTimeUi);
          media.addEventListener('timeupdate', updateTimeUi);

          updateToggleUi();
          updateTimeUi();
        },
      );
    },
  };
})(Drupal, once);
