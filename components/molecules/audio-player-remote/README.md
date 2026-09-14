# Remote Audio Player

A custom-controlled audio player — play/pause, skip back/forward, elapsed/total time, and a seek bar — for an external audio URL (e.g. a podcast episode hosted elsewhere).

## Bootstrap reference

> [Bootstrap 5.3 — Range](https://getbootstrap.com/docs/5.3/forms/range/) (the seek bar starts from a native `<input type="range">`, fully re-skinned)

## What it does

Renders a hidden native `<audio>` element plus a fully custom set of controls: a circular play/pause button, optional skip-back/skip-forward buttons, an optional elapsed/duration time readout, a seek bar, and an optional download link. No third-party player library is used — playback state (play/pause icon, elapsed time, seek position) is driven entirely by `audio-player-remote.js` listening to the `<audio>` element's own events, so it works with any playable audio URL.

Enter the URL directly (not a Drupal media item): everything else — title, autoplay, loop, skip buttons, time, seek bar, accent color — plays exactly like [Local Audio Player](../audio-player-local/README.md), which takes an uploaded file instead of an external URL; both share identical playback controls and options, each with its own copy of the styling/behavior (there is no shared base component).

## Files

- `audio-player-remote.component.yml` — SDC schema (`url`, `title`, `autoplay`, `loop`, `preload`, `show_skip`, `skip_seconds`, `show_time`, `show_download`, `accent_color`, `attributes`).
- `audio-player-remote.twig` — template.
- `audio-player-remote.scss` — controls, circular button, and re-skinned seek-bar styling.
- `audio-player-remote.js` — play/pause, skip, time, and seek behavior (`Drupal.behaviors` + `once`).
- `audio-player-remote.stories.twig` / `audio-player-remote.stories.json` — Storybook stories.
- `audio-player-remote.mdx` — Storybook docs page.

## Props overview

| Property | Type | Description | Default |
|---|---|---|---|
| `url` | string | URL of the remote audio file to play. Leave empty to render nothing | `''` |
| `title` | string | Optional label shown above the controls | `''` |
| `autoplay` | boolean | Start playing automatically once loaded | `false` |
| `loop` | boolean | Restart playback automatically at the end | `false` |
| `preload` | string | How much audio to fetch upfront (`metadata`, `auto`, `none`) | `metadata` |
| `show_skip` | boolean | Show the skip-back / skip-forward buttons | `true` |
| `skip_seconds` | string | Seconds the skip buttons jump (`5`, `10`, `15`, `30`) | `15` |
| `show_time` | boolean | Show the elapsed / total time | `true` |
| `show_download` | boolean | Show a download button for the audio file | `false` |
| `accent_color` | string | Bootstrap theme color for the play/pause button and seek bar fill. Leave as Default for the theme's mint accent | `default` |
| `attributes` | object | HTML attributes for the containing element | `{}` |

## Example

```twig
{{ include('vartheme_bs5_rightup:audio-player-remote', {
  url: 'https://example.com/podcast/episode-12.mp3',
  title: 'Episode 12 — Design systems at scale',
  show_download: true
}, with_context: false) }}
```

## Notes

- There is no oEmbed-style remote audio media type in Drupal core or Varbase (unlike `remote_video`) — a direct link to a playable audio file is expected, not a link to a page/embed. `url` stays a plain link field (`format: uri-reference`) for this reason — see [Local Audio Player](../audio-player-local/README.md) for the equivalent uploaded-file field.
- `accent_color`'s background/icon-color pairing is computed at build time with Bootstrap's own `color-contrast()` function against the theme-colors map (the same approach Bootstrap uses for its own button variants), so every accent choice keeps a legible icon regardless of how light or dark that color is.
- **The player takes its colour from the section it sits on.** The transport buttons, the title and the duration are `color: inherit`, and the unplayed part of the seek bar is mixed from `currentColor`, so the same instance reads correctly on a white band and on the dark podcast banner. Only the play/pause button and the elapsed time carry `accent_color`.
- The elapsed time sits before the seek bar and the duration after it, so the readouts bracket the bar rather than crowding the transport buttons.
- The seek bar is a real `<input type="range">` (keyboard-accessible, draggable) re-skinned with `::-webkit-slider-runnable-track` / `::-moz-range-track` / `-thumb` rules; its "played" portion is painted via a `--audio-player-remote-progress` custom property kept in sync by `audio-player-remote.js`, not a second overlay element.
- Autoplay with sound is blocked by most browsers until the visitor has interacted with the page — the `autoplay` prop still sets the native `autoplay` attribute (some browsers allow it when the tab/page is muted or already engaged), but don't rely on it as the only way to start playback.
- `url` is optional, not required: Drupal Canvas throws an uncaught server error (rather than a normal validation message) when a `required` prop's value is cleared to empty in its edit form. Making it optional with a default of `''`, and rendering nothing when it's empty, avoids that crash entirely. In Canvas's editing canvas specifically, an empty player still shows a dashed placeholder (`.is-canvas-preview .audio-player-remote--empty .audio-player-remote__placeholder`) so the instance stays visible/selectable instead of disappearing; the placeholder never appears on the live page.
- This component and [Local Audio Player](../audio-player-local/README.md) each carry their own copy of the same styling/behavior (there used to be a shared `atoms/audio-player` base component; it was removed so each is fully self-contained) — keep changes to shared behavior in sync across both `.scss`/`.js` files.
