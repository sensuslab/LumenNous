# LumenNous Product and Implementation Plan

## 1. Foundational purpose

LumenNous should help a person move from an immediate inner need to a brief,
grounded contemplative action. Its role is to offer language, attention and
structure. It must not claim spiritual authority, diagnose a user, promise an
outcome or turn random selection into divination.

The core promise is:

> Name what is present, receive a fitting practice, and keep agency over what
> you use.

### Intended mechanisms of action

1. **Orientation:** naming a need reduces an open-ended emotional task to a
   clear starting point.
2. **Attentional anchoring:** prayer, breath-optional practice and sensory
   prompts bring attention back to the present.
3. **Structured language:** curated words can support reflection when a user
   cannot easily find their own.
4. **Agency:** category choice, tone, language, avoidances and stop controls
   make the practice collaborative rather than prescriptive.
5. **Variety with continuity:** bounded cycling keeps familiar structures
   useful without showing the same item repeatedly.
6. **Reflection into action:** prompts and a small next step connect inward
   practice to daily life.

These are product hypotheses, not clinical claims. Future user research should
test whether people feel calmer, clearer and more able to choose a next step,
using self-report rather than health-outcome language.

## 2. Information architecture

The primary mobile navigation has five stable destinations: Today, Explore,
Create, Listen and Learn. Saved is a utility destination in the header because
it supports every content area without competing with the five primary jobs.

| Route | User job | Functional role |
| --- | --- | --- |
| `/` | Begin without deciding | Time-aware daily prayer, affirmation and one suggested practice |
| `/explore` | Find support for a known need | Search/filter and scan all 26 active Corpus categories |
| `/explore/[slug]` | Stay within one intention | Category overview, prayers, practices and reflection prompts |
| `/practice/[slug]` | Follow a guided exercise | Duration choice, step progression, pause, resume and exit |
| `/create` | Receive a tailored session | Local input classification, options, composition and result |
| `/listen` | Use sound as the entry point | Audio discovery with explicit third-party loading |
| `/listen/[slug]` | Follow a coherent listening set | Playlist sequence, context and related material |
| `/learn` | Understand the language and method | Short, labelled learning cards |
| `/learn/[slug]` | Read one teaching | Source-aware article and related categories |
| `/saved` | Return to chosen material | Local list, export, deletion and Engine-history reset |
| `/about` | Understand scope | Purpose, method and non-authoritative boundaries |
| `/privacy` | Understand data use | Plain-language local-storage and safety details |

Legacy routes remain as redirects, not parallel destinations:
`/ask` to `/create`, `/category/[slug]` to `/explore/[slug]`,
`/playlist/[slug]` to `/listen/[slug]`, and `/favourites` to `/saved`.

### Primary flows

**Low-decision flow**

`Today -> read -> optional practice -> save/share -> return`

**Need-led flow**

`Explore -> category -> prayer or practice -> reflect -> save`

**Creation flow**

`Create -> describe need -> choose controls -> local safety/classification ->
assembled session -> copy/share -> create another`

**Understanding flow**

`Learn -> teaching -> source context -> related category`

**Return flow**

`Saved -> grouped item -> original detail -> remove/export/delete`

## 3. Mobile UI and UX strategy

### Navigation and hierarchy

- Keep the five-item bottom bar fixed, safe-area aware and identical across
  primary routes.
- Show one active destination only. Detail pages inherit their parent
  destination; utility pages show no false active state.
- Keep product identity and Saved in the compact header. Do not add a second
  competing menu for the current route set.
- Use one clear page title, one primary action per section and progressive
  disclosure for optional Create settings.

### Interaction design

- Maintain touch targets of at least 44 by 44 CSS pixels and 48 pixels for
  primary actions.
- Use native controls where their behaviour is familiar: select for category,
  segmented options for output form, chips for short duration choices and
  checkboxes/toggles for binary settings.
- Keep practice controls in stable dimensions so labels and timer changes do
  not shift the layout.
- Preserve user input after a recoverable Create error.
- Use inline status messages for copy, share, save, export and history reset.
- Never auto-load third-party audio or turn content variety into “sign” or
  “message meant for you” language.

### Visual system

- Continue the restrained Nocturne palette, but use pearl, gold, violet and
  muted terracotta by semantic role so the interface does not become one-note.
- Use ambient celestial visuals as background context, not as framed hero
  illustrations or nested cards.
- Keep cards for repeatable content items and framed tools only.
- Reserve display typography for page-level moments; use compact headings
  inside forms, lists and players.

### Accessibility and regulation

- Preserve semantic headings, visible focus and useful accessible names for
  icon-only controls.
- Support reduced motion and the app-wide low-stimulation mode.
- Make breath attention optional in every relevant instruction; offer touch,
  sight or sound as alternatives.
- Do not use colour alone for evidence, editorial, safety or selected states.
- Test at 320px, 390px and tablet widths, landscape, 200% text zoom, keyboard
  navigation and VoiceOver/TalkBack reading order.

## 4. Corpus integration

### Source and deployment model

The canonical research material remains in
`Research/corpus/data/`. The app bundles a reviewed snapshot in
`App/src/data/corpus/` so it can build and work offline without reaching
outside its deployment package.

| Corpus file | Current use | Next integration step |
| --- | --- | --- |
| `app_taxonomy.json` | Maps 26 categories and powers need classification | Add editorial owner and migration checks |
| `reflection_prompts.json` | Normalised into app reflection prompts | Add tone and sensitivity tags |
| `seed_content.json` | Adds prayers, affirmations and practices | Expand coverage after human review |
| `affirmation_forms.json` | Forms and hard blocks are available to the adapter | Use as a local clause/template QA layer |
| `learning_cards.json` | Bundled research snapshot | Map reviewed cards into Learn |
| `integration_manifest.json` | Records intended feature ownership | Turn into sync and coverage assertions |

### Proposed ingestion pipeline

1. Add a `corpus:sync` script that reads only the six allow-listed research
   files.
2. Validate raw files against versioned Zod schemas before copying anything.
3. Normalise Corpus category IDs to stable app IDs and canonical public slugs.
4. Preserve provenance, safety labels, tradition labels, source IDs and
   editorial status on every transformed record.
5. Write deterministic JSON snapshots so diffs are reviewable.
6. Run referential-integrity and per-category coverage tests.
7. Produce a short sync report: version, changed IDs, new drafts, removed IDs
   and unresolved references.
8. Require human editorial approval before a draft becomes published.

The runtime should continue reading through `src/lib/content.ts`; route
components should never parse Corpus files directly.

### Content model additions

For richer local composition, add reviewed clause records with:

- stable ID and Corpus category IDs
- role: invocation, naming, petition, release, gratitude, closing or next step
- compatible tones and language preferences
- duration weight
- sensitivity and hard-block tags
- source/tradition provenance
- editorial status and reviewer

This permits more tailored prayer structure without interpolating private
request text or relying on a generative model.

## 5. Internal Engine specification

### Current algorithm

```text
validate(request)
safety = classifySafety(request.need)
if safety requires bypass:
  return fixedHumanResponse(safety.level)

category = explicitCategory ?? classifyFromCorpusProfiles(request.need)
contextKey = category + outputType + duration + tone + language

for each required slot:
  candidates = library records matching category and slot type
  candidates = remove exact avoidances
  candidates = rank by tone, language and duration compatibility

  bag = history[contextKey + slot]
  if bag is empty:
    bag = shuffle(candidate IDs)
    prevent previous ID from being the first item after refill
    increment cycle

  selected = pop(bag)

assemble(selected records)
validate(result and referenced IDs)
persist only bags, counters and recent result fingerprints
return result
```

### Cycling guarantees

- The shuffle scope is the full context key, so changing category or form does
  not corrupt another sequence.
- A compatible item is not reused until every compatible item in that bag has
  appeared.
- The last item of one cycle cannot be the first item of the next.
- Exact avoidances fail closed: if filtering empties a required pool, the app
  asks for a different option rather than silently ignoring the avoidance.
- Resetting history changes future order but does not delete library content.

### Engine v2 recommendation

Add deterministic recipe selection for clause roles:

1. Select one reviewed structure for the requested output type.
2. Fill its required roles from compatible clause bags.
3. Reject duplicate concepts and blocked combinations.
4. Apply a lightweight grammar joiner for punctuation and optional divine
   address.
5. Validate word count, source links, safety labels and fingerprint.
6. Run a final local repetition check across the last 12 recipes.

Use no free-text interpolation beyond an optional locally displayed title.
This keeps output personal through intent and preference matching without
claiming that an algorithm understands or spiritually interprets the user.

## 6. Safety, privacy and trust

- Safety classification always runs before category composition.
- Crisis, abuse, possible psychosis, medical emergency and metaphysical
  escalation receive fixed, reviewed responses and a route toward human help.
- The app must never validate supernatural persecution or recommend replacing
  professional care.
- Request text remains in component memory only and is discarded on refresh.
- Saved items and Engine history are separate local data stores with separate
  controls.
- No analytics, account or third-party model call is required for core use.
- Sources and tradition labels should describe provenance, not imply proof of
  efficacy.

## 7. Delivery roadmap

### Foundation: complete in this build

- Rename product and shell to LumenNous.
- Establish canonical route hierarchy and legacy redirects.
- Add 26-category Corpus taxonomy and bundled research snapshots.
- Replace the network AI concept with the local Engine.
- Add shuffle-bag cycling, safety bypass and local privacy controls.
- Restore lint, unit-test and production-build checks.

### Phase 1: content authority

- Build `corpus:sync` and deterministic change reporting.
- Map learning cards into Learn.
- Add provenance and reviewer fields to every Corpus-derived item.
- Complete an editorial pass on draft content and evidence labels.
- Add coverage tests for every category/output combination.

### Phase 2: deeper local personalisation

- Introduce reviewed clause-role content and Engine v2 recipes.
- Use affirmation hard blocks as automated editorial constraints.
- Add a preview explaining why a category was selected, with an easy override.
- Allow a completed custom recipe to be saved locally with its exact content
  IDs and settings, never the original request.

### Phase 3: mobile validation

- Add Playwright coverage for Today, Explore, Create, Practice, Listen and
  Saved.
- Test offline reloads of visited detail routes and every primary route.
- Complete VoiceOver/TalkBack, 200% zoom and reduced-motion audits.
- Conduct five-user task testing focused on navigation comprehension, control
  language and trust in local composition.

### Release acceptance criteria

- Create makes no model/API request and functions offline after shell install.
- Safety bypass tests cover every concern class.
- Every active category has compatible content for supported output forms.
- No required slot repeats before its shuffle bag is exhausted.
- Avoidances are never silently discarded.
- Every result validates and every referenced content/source ID exists.
- Primary flows work at 320px width with no overlap or horizontal scrolling.
- A user can inspect, export and delete all persistent local data.
- All published spiritual and evidence claims have human editorial approval.
