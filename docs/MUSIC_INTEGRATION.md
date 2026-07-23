# Reviewed listening integration

## Canonical source and audit import

The expanded research register is preserved verbatim at:

```text
Music/Research/corpus/media_research/youtube_audio_register_expanded.csv
```

Run `npm run music:import` after an editorial update. The importer uses strict
RFC-compatible CSV parsing, requires the exact 20-column header, rejects
duplicate record IDs and malformed values, and writes a deterministic,
ID-sorted snapshot to `src/data/corpus/youtube_audio_register.json`.

The current snapshot contains all 153 audit records. Unknown or live durations
and unknown view counts remain `null` rather than becoming misleading zeroes.
Standard watch, short, embed and `/live/` YouTube URLs are supported. The
snapshot also reports two duplicate-URL groups while retaining every distinct
source record.

The 153-row snapshot is an internal audit source, not a consumer catalogue.

## Public review boundary

`src/data/music-selections.ts` contains the explicit eight-item public
allowlist. An item fails closed unless it exists in the imported snapshot and
meets every conservative release check: approved family, embeddable source,
editorial-ready state, low claim risk, acceptable evidence label and acceptable
rights status.

The public set currently contains nature recordings, quiet instrumental music,
one official sacred-chant recording and one singing-bowl timer. Frequency,
binaural, DNA, chakra and other claim-led records are not public selections.
`/listen` receives only this allowlist; its client-side checks provide a second
guard before anything is rendered or played.

The product describes these items as **reviewed listening**, not music therapy.
They are optional sensory or devotional companions and do not promise medical,
psychological or spiritual outcomes.

## Session selection map

The same module maps one or two reviewed options to each supported session
variant:

- `morning-setting`: dawn nature sound or official sacred chant
- `midday-recenter`: a field recording or sparse instrumental texture
- `evening-integration`: rainforest ambience or a short bowl-based timer
- `challenge-reset`: a field recording or sparse instrumental texture
- `before-sleep`: ocean or rainforest ambience

Every mapping includes a short rationale and a practical setup note. The
listener chooses at most one option, keeps prayer or stillness primary, uses a
comfortable volume and can continue in silence at any time.

## YouTube playback

- A privacy-enhanced `youtube-nocookie.com` iframe is created only after the
  listener presses **Load YouTube player**.
- Only one player is active at a time, reducing network and memory use.
- A session can unload its in-page player from the full-screen timer, and it
  unloads automatically when the three-minute session ends. The app does not
  control audio opened in a separate YouTube tab; use YouTube’s or the device’s
  timer for separate or longer listening.
- The responsive player maintains a 16:9 ratio and a 200px minimum height.
- The iframe sandbox permits media presentation but not pop-ups or top-level
  navigation.
- YouTube selects the adaptive stream quality. The app does not transcode,
  alter pitch or claim lossless reproduction of a YouTube source.

Explicit Hz labels remain preserved in the audit snapshot for traceability,
including decimal labels. They do not appear on the public screen unless a
future human-reviewed public selection legitimately contains such metadata,
and they are never presented as evidence of a health effect.

## High-fidelity path

For licensed first-party audio, store a lossless WAV or FLAC master outside the
web bundle and derive at least AAC and Opus delivery files. Preserve the source
sample rate, channel layout and embedded loudness metadata; avoid destructive
normalisation or unrequested pitch/time processing.

A first-party player can use the HTML Media Session API for lock-screen
controls and a Web Audio `AnalyserNode` for a truthful live spectrum. Serve
audio from object storage/CDN with byte-range support, immutable versioned URLs
and a signed rights record. Keep the YouTube catalogue as an embedded discovery
layer rather than treating it as the archival master.
