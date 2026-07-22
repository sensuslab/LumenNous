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
- Complete 88-entry research music register with gated YouTube embeds
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
| `/create` | Compose a tailored prayer, affirmation or meditation on device |
| `/listen` | Search the complete music register, explore pitch labels and play approved embeds |
| `/listen/[slug]` | Playlist detail |
| `/learn` | Browse short teachings and method notes |
| `/learn/[slug]` | Teaching detail |
| `/saved` | Consent-gated local saved items and local-data controls |
| `/about`, `/privacy` | Method, boundaries and privacy commitments |

Legacy `/ask`, `/category/*`, `/playlist/*` and `/favourites` URLs redirect
to their canonical routes.

## The local Engine

`src/lib/engine.ts` performs the complete Create flow synchronously in the
browser:

1. Validate the request.
2. Run the safety classifier before normal composition.
3. Respect an explicit category or classify the need from Corpus profiles.
4. Filter for output type, duration, tone, language and exact avoidances.
5. Draw compatible content IDs from per-context shuffle bags.
6. Assemble and validate a recipe from prayers, affirmations, practices and
   reflection prompts.
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
`../Music/Research/corpus/media_research/youtube_audio_register.csv` with
`npm run music:import`. All records remain searchable; source readiness and
embed decisions control which records can create an in-app player.

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
pitch-map and high-fidelity audio strategy.
