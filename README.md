# LumenNous

LumenNous is a mobile-first contemplative app for prayer, affirmation,
meditation, reflective listening and spiritual learning. It helps someone turn
a present need into a small, structured practice without presenting itself as
an oracle, therapist, church or medical tool.

The account-free Create Engine classifies a request on the device and assembles
reviewed library material with a non-repeating shuffle system. An optional,
server-only DeepSeek boundary is included for future approved experiences; it
is disabled by default and is not required by the local Engine.

## Current build

- Next.js 16 App Router, React 19 and strict TypeScript
- Tailwind CSS v4 and the custom Nocturne design system
- Zod validation for content and Engine contracts
- Vitest unit tests
- Installable PWA shell with offline routes
- Versioned three-minute Embodied Coherence Prayer method with five daily variants
- Complete 153-entry music audit register with an eight-item reviewed public allowlist
- No database, account or analytics

## Run locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production check:

```bash
npm run lint
npm test
npm run build
npm start
```

`npm run check` runs linting, tests and the production build together.

## Product routes

| Route | Purpose |
| --- | --- |
| `/` | Today: one focused prayer, affirmation and suggested practice |
| `/explore` | Browse the 26 active needs and intentions |
| `/explore/[slug]` | Category library with prayers, practices and prompts |
| `/practice/[slug]` | Timed, accessible practice player |
| `/create` | Compose a tailored prayer, affirmation, meditation or coherence prayer on device |
| `/sessions` | Review the five-stage method and choose a daily session variant |
| `/sessions/[slug]` | Timed three-minute coherence prayer with optional reviewed listening |
| `/listen` | Browse and play the eight reviewed contemplative-listening selections |
| `/listen/[slug]` | Playlist detail |
| `/learn` | Browse short teachings and method notes |
| `/learn/[slug]` | Teaching detail |
| `/saved` | Consent-gated local saved items and local-data controls |
| `/prayer-engine` | Landing page explaining the purpose and functionality of the PrayerEngine |
| `/about`, `/privacy` | Method, boundaries and privacy commitments |

Legacy `/ask`, `/category/*`, `/playlist/*` and `/favourites` URLs redirect
to their canonical routes.

## The promo landing

`/welcome` is a standalone promotional landing page for campaign links and
marketing domains. It is hand-written static HTML in `public/welcome/`,
deliberately outside the App Router: no React, no service worker and no
application JavaScript, so it paints before any of the app is loaded. A
rewrite in `next.config.ts` maps the extensionless URL, and the fonts it needs
are vendored to `public/fonts/`.

Because it cannot import the design tokens or the content layer, it is the one
place where Nocturne values and library counts are duplicated.
`src/lib/__tests__/welcome-page.test.ts` fails the build if that copy drifts
from `src/app/globals.css` or from the content layer, so update the page rather
than the test.

The app itself is untouched by this: `/` is still Today.

## The local Engine

`src/lib/engine.ts` performs the complete Create flow synchronously in the
browser:

1. Validate the request.
2. Run the safety classifier before normal composition.
3. Respect an explicit category or classify the need from Corpus profiles.
4. Filter for output type, duration, tone, language and exact avoidances.
5. Draw compatible content IDs from per-context shuffle bags.
6. Assemble and validate a recipe from prayers, affirmations, practices and
   reflection prompts. Coherence output keeps the reviewed five-stage order
   and fixed three-minute core instead of scaling an unrelated meditation.
7. Store only IDs, cycle counters and recent fingerprints in local storage.

Every item is used once before its bag refills, and a refill cannot begin with
the item used immediately before it. Request text is never persisted. Crisis,
acute-distress and metaphysical-escalation phrases bypass composition and show
fixed human-written support language.

## Corpus integration

The research source of truth is:

```text
../Research/corpus/data/
```

Deployable, versioned snapshots are bundled in `src/data/corpus/`. The
integration layer in `src/data/corpus/index.ts` maps Corpus IDs to stable app
IDs, normalises seed content into app schemas and merges reflection prompts
into the library. Taxonomy profiles currently power local request
classification.

The music register is imported from
`Music/Research/corpus/media_research/youtube_audio_register_expanded.csv` with
`npm run music:import`. All 153 records remain in the deterministic audit
snapshot; only the explicit, conservative eight-item allowlist in
`src/data/music-selections.ts` reaches the public listening screen.

The Quantum Prayer source methodology is implemented as
`quantum-prayer-v1`. Its practical sequence—breath regulation, body awareness,
gentle emotional evocation, a threefold intention and non-gripping
release—is preserved. The app treats quantum language as contemplative
metaphor, not evidence that thought controls physical events or guarantees
healing, relationships or material outcomes.

`src/data/index.ts` validates content at import time. Duplicate IDs, broken
references, missing category coverage, unsupported evidence labels and invalid
teaching lengths fail tests and production builds.

## Structure

```text
src/
├── app/                 App Router pages and legacy redirects
├── components/          Chrome, content, Create, media and UI components
├── data/
│   ├── corpus/          Versioned research snapshots and adapters
│   └── *.ts             Typed application content
└── lib/
    ├── content.ts       Single read layer for the content library
    ├── engine.ts        Local classification, cycling and assembly
    ├── safety.ts        Conservative safety routing and fixed responses
    ├── daily.ts         Stable daily selection
    └── favourites.ts    Consent-gated browser storage
```

## Privacy and accessibility

Saved items and Engine history remain in the current browser and can be
exported or deleted from `/saved`. Third-party media loads only after an
explicit action. The app targets WCAG 2.2 AA with semantic structure, visible
focus, 44px or larger touch targets, reduced-motion support and an app-wide
low-stimulation mode.

## AI configuration

The optional `/api/ai` route calls DeepSeek's OpenAI-compatible
`/chat/completions` endpoint using `deepseek-v4-pro`. It accepts requests only
when `DEEPSEEK_AI_ENABLED=true`; the API key is read on the server and is never
sent to the browser. Copy `.env.example` to a local ignored environment file
when developing this optional integration.

## Deployment

The project includes `vercel.json` and GitHub Actions CI. Connect the `main`
branch to Vercel for automatic preview and production deployments. Detailed
steps and environment guidance are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

The standalone Docker image remains available:

```bash
docker build -t lumennous .
docker run -p 3000:3000 lumennous
```

## Current boundaries

- Create personalises by classification, filtering and curated assembly; it
  does not invent unrestricted prose from the request.
- General Corpus snapshots are promoted manually; the music register has a
  repeatable import command.
- Generated sessions can be copied or shared but are not yet saved as complete
  custom recipes.
- Draft editorial content still requires final human review before release.

See [docs/LUMENNOUS_PRODUCT_PLAN.md](docs/LUMENNOUS_PRODUCT_PLAN.md) for the
route map, design strategy, Engine specification and staged roadmap.
See [docs/MUSIC_INTEGRATION.md](docs/MUSIC_INTEGRATION.md) for playback,
review policy and high-fidelity audio strategy.
See
[docs/QUANTUM_PRAYER_MUSIC_ALIGNMENT.md](docs/QUANTUM_PRAYER_MUSIC_ALIGNMENT.md)
for the source-method review, scientific boundary, catalogue audit and
session-to-sound decisions.
