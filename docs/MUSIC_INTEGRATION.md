# Music integration

## Source and import

The complete YouTube research register remains authoritative at:

```text
../Music/Research/corpus/media_research/youtube_audio_register.csv
```

Run `npm run music:import` after an editorial update. The importer normalises
the source into `src/data/corpus/youtube_audio_register.json`; application code
then validates all 88 records with Zod before rendering them.

The Listen route exposes every record. The register's `embed_or_link` and
`readiness_state` fields determine playback. Blocked and reference-only rows
remain searchable for editorial transparency but never create a player.

## YouTube playback

- A privacy-enhanced `youtube-nocookie.com` iframe is created only after the
  listener presses **Play here**.
- Only one player is active at a time, reducing network and memory use.
- The responsive player maintains a 16:9 ratio and a 200px minimum height.
- The iframe sandbox permits media presentation but not pop-ups or top-level
  navigation, keeping the experience inside LumenNous.
- YouTube selects the adaptive stream quality. The app does not transcode,
  alter pitch, or claim lossless reproduction of a YouTube source.

## Tonal exploration

The pitch map extracts explicit Hz labels from the register and presents them
on a logarithmic axis. Selecting a label filters the full catalogue. These are
editorial labels from source titles and descriptions, not measurements of the
stream and not evidence of a health effect.

Binaural entries carry a headphone note because the intended beat depends on
different left and right channel signals. Listening levels should remain
comfortable.

## High-fidelity path

For licensed first-party audio, store a lossless WAV or FLAC master outside the
web bundle and derive at least AAC and Opus delivery files. Preserve the source
sample rate, channel layout, and embedded loudness metadata; avoid destructive
normalisation or unrequested pitch/time processing.

A first-party player can use the HTML Media Session API for lock-screen
controls and a Web Audio `AnalyserNode` for a truthful live spectrum. Serve
audio from object storage/CDN with byte-range support, immutable versioned
URLs, and a signed rights record. Keep the YouTube catalogue as an embedded
discovery layer rather than treating it as the archival master.
