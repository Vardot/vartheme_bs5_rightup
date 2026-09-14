# Local Audio Player

A custom-controlled audio player — play/pause, skip back/forward, elapsed/total time, and a seek bar — for a locally uploaded audio file.

## Bootstrap reference

> [Bootstrap 5.3 — Range](https://getbootstrap.com/docs/5.3/forms/range/) (the seek bar starts from a native `<input type="range">`, fully re-skinned)

## What it does

Renders a hidden native `<audio>` element plus a fully custom set of controls: a circular play/pause button, optional skip-back/skip-forward buttons, an optional elapsed/duration time readout, a seek bar, and an optional download link. No third-party player library is used — playback state (play/pause icon, elapsed time, seek position) is driven entirely by `audio-player-local.js` listening to the `<audio>` element's own events, so it works with any audio file the browser can play.

`audio_url` is a real file upload field (see Notes) — upload a file directly, no separate Media Library step. See [Remote Audio Player](../audio-player-remote/README.md) for an externally-hosted URL instead; both share identical playback controls and options, each with its own copy of the styling/behavior (there is no shared base component).

## Files

- `audio-player-local.component.yml` — SDC schema (`audio_url`, `title`, `autoplay`, `loop`, `preload`, `show_skip`, `skip_seconds`, `show_time`, `show_download`, `accent_color`, `attributes`).
- `audio-player-local.twig` — template.
- `audio-player-local.scss` — controls, circular button, and re-skinned seek-bar styling.
- `audio-player-local.js` — play/pause, skip, time, and seek behavior (`Drupal.behaviors` + `once`).
- `audio-player-local.stories.twig` / `audio-player-local.stories.json` — Storybook stories.
- `audio-player-local.mdx` — Storybook docs page.

## Props overview

| Property | Type | Description | Default |
|---|---|---|---|
| `audio_url` | string | Upload a local audio file. Leave empty to render nothing | `''` |
| `title` | string | Optional label shown above the controls | `''` |
| `autoplay` | boolean | Start playing automatically once loaded (most browsers block autoplay with sound until the visitor interacts with the page) | `false` |
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
{{ include('vartheme_bs5_rightup:audio-player-local', {
  audio_url: 'public://audio/episode-12.mp3',
  title: 'Episode 12 — Design systems at scale',
  show_download: true
}, with_context: false) }}
```

## Notes

- **Real file upload, not a pasted URL.** `audio_url` uses Drupal Canvas's `json-schema-definitions://canvas.module/stream-wrapper-uri` prop shape, which maps to Drupal core's plain `file` field type + `file_generic` widget — an "Upload" button in Canvas, backed by a real file entity, no Media Library step required. This is a different, simpler code path than a Media Library ("content entity reference") prop, which the [Remote Audio Player](../audio-player-remote/README.md) notes previously found broken on this site's `justinrainbow/json-schema` version — that limitation is specific to entity-reference shape matching and does not affect this plain-file-upload shape (verified directly against this site's `PropShapeRepositoryInterface`).
- **The uploaded value is a stream wrapper URI, not a browser URL.** The `file` field's `uri` property (`public://audio/episode.mp3`) is not directly usable as an `<audio src>` — `audio-player-local.twig` resolves it with Twig's `file_url()` (Drupal core's `file_url_generator`) before using it anywhere, skipped when empty (`file_url('')` would otherwise resolve to `/`, wrongly satisfying the "has a file" check).
- `accent_color`'s background/icon-color pairing is computed at build time with Bootstrap's own `color-contrast()` function against the theme-colors map (the same approach Bootstrap uses for its own button variants), so every accent choice keeps a legible icon regardless of how light or dark that color is.
- **The player takes its colour from the section it sits on.** The transport buttons, the title and the duration are `color: inherit`, and the unplayed part of the seek bar is mixed from `currentColor`, so the same instance reads correctly on a white band and on the dark podcast banner. Only the play/pause button and the elapsed time carry `accent_color`.
- The elapsed time sits before the seek bar and the duration after it, so the readouts bracket the bar rather than crowding the transport buttons.
- The seek bar is a real `<input type="range">` (keyboard-accessible, draggable) re-skinned with `::-webkit-slider-runnable-track` / `::-moz-range-track` / `-thumb` rules; its "played" portion is painted via a `--audio-player-local-progress` custom property kept in sync by `audio-player-local.js`, not a second overlay element.
- Autoplay with sound is blocked by most browsers until the visitor has interacted with the page — the `autoplay` prop still sets the native `autoplay` attribute (some browsers allow it when the tab/page is muted or already engaged), but don't rely on it as the only way to start playback.
- `audio_url` is optional, not required: Drupal Canvas throws an uncaught server error (rather than a normal validation message) when a `required` prop's value is cleared to empty in its edit form. Making it optional with a default of `''`, and rendering nothing when it's empty, avoids that crash entirely. In Canvas's editing canvas specifically, an empty player still shows a dashed placeholder (`.is-canvas-preview .audio-player-local--empty .audio-player-local__placeholder`) so the instance stays visible/selectable instead of disappearing; the placeholder never appears on the live page.
- This component and [Remote Audio Player](../audio-player-remote/README.md) each carry their own copy of the same styling/behavior (there used to be a shared `atoms/audio-player` base component; it was removed so each is fully self-contained) — keep changes to shared behavior in sync across both `.scss`/`.js` files.
