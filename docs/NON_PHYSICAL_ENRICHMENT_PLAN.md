# Non-physical enrichment plan

## Scope

This plan translates the supplied Belief Synthesis, enriched-alignment and
deep-research materials into the current LumenNous architecture. It explicitly
excludes body positioning, posture diagrams, movement, mudras, physical setup
instructions and physical recommendations. Those remain a separate review
track and must not be inferred from this work.

The product contract remains: LumenNous offers reviewed language, attention
and structure; it is not an oracle, therapist, church, clinic or authority.
Random selection is variety, not divination. No content promises healing,
protection, manifestation or control of another person.

## Fit with the current codebase

The existing content schemas and `src/lib/content.ts` remain the application
boundary. Daily selection stays deterministic. Create remains a bounded local
composer backed by reviewed records and non-repeating ID bags. New experience
layers compose those primitives rather than adding a second content system.

| Product decision | Application fit | Status |
| --- | --- | --- |
| One primary Today card | Keep `DailyPrayerCard` as the complete daily offering | Implemented |
| Five optional doors | Server-render progressive disclosure; no completion state or streak | Implemented |
| Believable affirmation | Require `backingActHint` on every affirmation | Implemented |
| Distress is not crisis | Compose for distress; retain hard bypass for crisis and escalation | Implemented |
| When lit companionship | Fixed, human-written route and inline signpost | Implemented |
| Sacred composition boundary | Keep Create on device; do not send request text to an AI model | Implemented |
| Consequence rule | Test spiritual interpretation against consent, honesty, harm and care | Implemented |
| Body and posture material | Separate diagram, evidence and safety review | Excluded |

## Delivered phase: foundations and Today v2

1. Affirmations now pair an honest present-tense orientation with one modest,
   observable next act. The act cannot promise an outcome and is shown both in
   Explore and Create results.
2. Today keeps one complete prayer, followed by five optional doors: Word,
   Inner reading, Listening, Close a tap and When lit. The doors are not
   tracked and cannot leave the user with an incomplete state.
3. The Today assembler filters physical guidance from the new doors. Existing
   physical practice routes are untouched and are not promoted by this layer.
4. Distress no longer dead-ends Create. Crisis and metaphysical-escalation
   signals still return fixed support copy rather than a composition.
5. The When lit route uses ordinary facts, reduced decision demand and human
   contact. It contains no posture, breath, movement or body instruction.
6. About now makes the consequence rule explicit: spiritual interpretation
   cannot excuse harm, weaken consent or reward dishonesty.
7. Create request text stays in the browser and is never persisted. Local
   history continues to store only content IDs, shuffle bags, cycle counters
   and recent fingerprints.

## Next phase: editorial spine

- Group Learn into a visible curriculum without expanding the 26-category
  taxonomy.
- Add reviewed working-model cards and a historically explicit Christ
  Consciousness stance: modern interpretation, not a claim of uniform early
  Christian doctrine.
- Keep cross-tradition readings labelled by lineage and never describe a
  selected text as a personalised supernatural message.

## Later phase: agency and weekly practice

- Add a private weekly utility for unbinding, one user-named civic act, a
  steel-man exercise and an unused-gift hour.
- Store only completion flags and content IDs. Never persist political text,
  a person being forgiven, an argument target or private free text.
- Keep civic work user-named and party-neutral; do not ingest live political
  snippets or contested geopolitical claims.
- Treat forgiveness as release, not reconciliation. Suppress reunion prompts
  when abuse or present danger is disclosed.

## Release gates

- `npm run check` passes, including deterministic selection, schema, privacy
  and distress-routing tests.
- Every affirmation has a non-empty backing act.
- New Today and When lit copy contains no physical instruction.
- Crisis and escalation-risk still bypass composition.
- Distress returns a usable local result plus a human-support signpost.
- No request text appears in local history, logs, analytics or outbound model
  calls.
- All new spiritual, historical and research claims receive an explicit claim
  class and human editorial review before publication.

## Evaluation boundary

Early research should measure experience, not efficacy: whether Today feels
like a day rather than a feed; whether the backing act feels believable;
whether When lit reduces decision pressure; and whether users understand the
local-data and non-clinical boundaries. A small usability test cannot establish
health, therapeutic or causal outcomes.
