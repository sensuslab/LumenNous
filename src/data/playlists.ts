/**
 * Seed playlists — the ten listening groupings from the brief's LISTEN
 * SCREEN section. These are CURATED references to external audio (see
 * audio.ts): the app never creates or modifies playlists in a user's own
 * music account. Frequency-labelled groupings name their evidence status
 * in the description so it can be surfaced in the UI.
 */

import { PlaylistSchema, type Playlist } from "../lib/schemas";

const raw: Playlist[] = [
  {
    id: "pll-five-minute-grounding",
    slug: "five-minute-grounding",
    title: "Five-Minute Grounding",
    description:
      "Short, steadying listens for arriving back in the moment: spare sacred minimalism and gentle ambient. Pair with the 'Feet on the Ground' practice or a single slow prayer.",
    intendedUse: "Quick grounding and settling",
    duration: 20,
    itemIds: ["aud-part-spiegel", "aud-marconi-union-weightless"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-morning-orientation",
    slug: "morning-orientation",
    title: "Morning Orientation",
    description:
      "Music for setting a direction before the day begins: ecumenical chant, Gregorian calm and unhurried ambient for the first coffee. Bright without being busy.",
    intendedUse: "Starting the day centred",
    duration: 60,
    itemIds: ["aud-taize-chants", "aud-gregorian-chant-silos", "aud-eno-music-for-airports"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-prayer-and-sacred-recitation",
    slug: "prayer-and-sacred-recitation",
    title: "Prayer and Sacred Recitation",
    description:
      "The sung and chanted prayer of several traditions: Gregorian chant, cathedral psalmody, medieval Hildegard von Bingen, and kirtan call-and-response. All carry traditional / symbolic-use labels; each is a living prayer practice, not background music.",
    intendedUse: "Praying alongside sacred sung traditions",
    duration: 120,
    itemIds: ["aud-gregorian-chant-silos", "aud-psalm-chant", "aud-hildegard-feather", "aud-krishna-das-kirtan"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-connection-to-source",
    slug: "connection-to-source",
    title: "Connection to Source",
    description:
      "Spacious, reverent listening for prayers of turning-toward: Pärt's still minimalism, Taizé repetition and Hildegard's soaring lines. Chosen to leave room for your own words.",
    intendedUse: "Prayer, devotion and quiet presence",
    duration: 90,
    itemIds: ["aud-part-spiegel", "aud-taize-chants", "aud-hildegard-feather"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-protection-and-boundaries",
    slug: "protection-and-boundaries",
    title: "Protection and Boundaries",
    description:
      "Steadying listens for feeling safe and held: sheltering psalm chant, Taizé refrains and the calm drone of singing bowls. Bowls carry an experiential-claim label — traditional use and listener reports, not established clinical findings.",
    intendedUse: "Feeling sheltered; settling after a hard day",
    duration: 75,
    itemIds: ["aud-psalm-chant", "aud-taize-chants", "aud-singing-bowls"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-deep-restoration",
    slug: "deep-restoration",
    title: "Deep Restoration",
    description:
      "Long-form listening for profound rest: Max Richter's eight-hour 'Sleep', Eno's weightless ambient and singing bowls. Built for lying down, switching off and letting the floor do its job.",
    intendedUse: "Extended rest and recovery",
    duration: 180,
    itemIds: ["aud-max-richter-sleep-spotify", "aud-eno-music-for-airports", "aud-singing-bowls"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-grief-and-release",
    slug: "grief-and-release",
    title: "Grief and Release",
    description:
      "Tender companions for sorrow: Pärt's mirror-slow writing, psalm chant that has carried lament for centuries, and unhurried slow radio. Nothing here rushes grief along.",
    intendedUse: "Mourning, remembering, gentle release",
    duration: 90,
    itemIds: ["aud-part-spiegel", "aud-psalm-chant", "aud-bbc-slow-radio"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-chakra-contemplation",
    slug: "chakra-contemplation",
    title: "Symbolic Body-Centre Contemplation",
    description:
      "Listening for symbolic centre-by-centre attention: a reviewed singing-bowl recording, spacious ambient and quiet minimalism. This is a contemplative body map, not a claim that frequencies unblock, cleanse or heal energy centres.",
    intendedUse: "Symbolic body-centre contemplation",
    duration: 90,
    itemIds: ["aud-singing-bowls", "aud-eno-music-for-airports", "aud-part-spiegel"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-sleep-and-stillness",
    slug: "sleep-and-stillness",
    title: "Sleep and Stillness",
    description:
      "For rest preparation: the eight-hour 'Sleep' album, sparse minimalism and slow radio. Use sound at a comfortable level with a timer, or choose silence; this grouping is not a treatment for insomnia.",
    intendedUse: "Rest preparation and quiet listening",
    duration: 240,
    itemIds: ["aud-max-richter-sleep-apple", "aud-part-spiegel", "aud-bbc-slow-radio"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
  {
    id: "pll-cosmic-reflection",
    slug: "cosmic-reflection",
    title: "Cosmic Reflection",
    description:
      "Vast, quiet listening for thinking on a cosmic scale: Eno's generative ambience, Pärt's stillness and slow radio's wide field recordings. Pair with the 'Pale Blue Pause' practice under an open sky.",
    intendedUse: "Wonder, perspective and night-sky contemplation",
    duration: 120,
    itemIds: ["aud-eno-music-for-airports", "aud-part-spiegel", "aud-bbc-slow-radio"],
    externalLinks: [],
    coverImage: "",
    editorialStatus: "draft",
  },
];

// Validated at module load.
export const playlists: Playlist[] = PlaylistSchema.array().parse(raw);

export const playlistById = new Map(playlists.map((playlist) => [playlist.id, playlist]));
export const playlistBySlug = new Map(
  playlists.map((playlist) => [playlist.slug, playlist]),
);
