# Source provenance and contemplative editorial workflow

LumenNous treats source material as a lineage for reflection, not as an
authority that speaks commands over a user. The application stores structured
locators and original editorial summaries. Private EPUB files and copyrighted
translation text are not bundled into the product.

## Data model

- `Source` identifies a real work, tractate, edition-level reference, health
  resource or research publication.
- `SourceEdition` records the exact editorial copy, its rights status, OCR
  quality, format, SHA-256, locator strategy and the individual works included
  when the edition is a collection.
- `PassageAnchor` maps a concept to a verifiable work/section locator. It holds
  no copied passage text and carries a structured native or canonical-node
  range alongside its display locator.
- `CanonicalDocument` is a private, format-neutral hierarchy produced from an
  EPUB, HTML, Markdown, plain-text, USFM, OSIS, JSON-tree or supported PDF
  input. It is never bundled into the application.
- `SourceReviewPolicy` adds metadata-driven OCR, rights, historical distinction
  or safety checks without hard-coding a publication into the interface.
- `ContemplativeConcept` translates one or more anchors into a bounded product
  concept with worldview profiles, safety tags and intended applications.
- `sourceUses` connects a prayer, affirmation, practice, prompt or teaching to
  a passage anchor and declares the relationship as `quotation`, `paraphrase`,
  `inspired-by` or `comparative-context`.
- `EditorialReview` gates publication through source, safety and copy stages.

All records are parsed with Zod at module load. `validateContent()` additionally
checks identifiers, cross-record references, collection membership, source-use
alignment and publication review state.

The reusable import and passage-selection commands are documented in
[`SOURCE_INGESTION.md`](./SOURCE_INGESTION.md). Document contents are treated as
inert evidence, never as instructions to the importer or application.

## Publication policy

New source-aware records begin as `draft`. A record may move to `review` while
one or more checks are underway. It may be marked `published` only when a named,
dated `EditorialReview` has completed all three stages:

1. Source review verifies the locator, the relation label and any exact wording.
2. Safety review checks agency, non-oracular framing, reality-testing and
   category-specific care requirements.
3. Copy review checks clarity, accessibility, attribution and rights language.

The validator fails a build if published content lacks this record. The current
source foundation remains draft until those reviews are completed by people.
The operational checklist and controlled-promotion procedure are documented in
[`EDITORIAL_WORKFLOW.md`](./EDITORIAL_WORKFLOW.md).

## Nag Hammadi handling

Every tractate remains source-specific. Terms such as Monad, Pleroma, Sophia,
Epinoia and bridal chamber are not flattened into generic “ancient wisdom.”
Different translations may support comparison, but translation wording is not
copied into generated content without a quotation-level rights and source check.

Inner-light and inner-knowing material is adapted as attention, reflection and
ethical discernment. Quiet impressions are possibilities to examine against
facts, care, ordinary reality and trusted perspectives—not instructions, proof
of special status or messages from an external entity.

## The two Melchizedek sources

The fragmentary Nag Hammadi tractate `Melchizedek` and J. C. F. C. Grumbine's
1919 *Melchizedek; or, The Secret Doctrine of the Bible* are separate sources:

- the former is an ancient, incomplete priestly/revelatory text;
- the latter is a modern esoteric interpretation with variable OCR quality.

They may meet only through an explicitly modern comparative layer. LumenNous
uses that layer to explore purpose as grounded service rather than clerical rank,
hidden lineage, dependency, voices, psychic training or power-seeking.
These requirements are activated through `source-review-policies.json`; the
editorial workspace contains no source-specific Melchizedek condition.

## Engine and interface behaviour

The local Engine carries the `sourceUses` of every selected library component
into its result. “Why these words?” opens the source drawer and shows each mapped
work, section, locator, verification state and editorial note.

AI-assisted compositions are labelled original compositions and deliberately
clear inherited `sourceIds` and `sourceUses`: a model-generated text must not
borrow the local composition's provenance or imply a citation it did not earn.
The selected concept and worldview may remain visible as request context, but
the generated wording is not presented as a paraphrase of the source passages.

`ConceptEngineFrame` is the transparent composition layer behind the optional
Create lens. A frame declares one concept, compatible worldview profiles,
original prayer/affirmation/practice language, source relationships and a
specific safety note. The local Engine includes those relationships in “Why
these words?”. Unknown lenses, incompatible worldview combinations and wording
that conflicts with a requested avoidance fail closed. The fixed coherence
method never accepts a concept overlay.

## Contemplative pathways

`ContemplativePathway` turns the concept graph into a sequenced, source-aware
journey. Each stage declares its concepts, activity type, estimated duration,
instructions, reflection prompt, safety boundary and passage relationships.
Validation requires stage concepts to belong to the parent pathway, companion
practice slugs to exist and displayed timing to equal the sum of activity time.

The initial pathways are:

- **Returning to Fullness** — embodied belonging, within/outside discernment,
  integration, rest and service;
- **Inner Light, Grounded Discernment** — self-possession, symbolic light,
  precise language and reality-testing;
- **Purpose Without Rank** — a comparative Melchizedek journey that keeps the
  ancient fragment and Grumbine's 1919 interpretation separate.

Optional progress stores only completed stage IDs in browser local storage. It
never stores a reflection answer, journal entry, spiritual profile or claimed
level of attainment.

## Concept Atlas

`/concepts` exposes the concept graph as a user-facing atlas rather than hiding
it inside the Engine. A person can filter the 13 editorial concepts by
worldview and application, then open a static detail route that shows:

- the concept classification, tradition labels and compatible worldviews;
- the safety boundaries that travel with every application of the concept;
- always-visible passage strands with work, section, locator, verification and
  editorial notes;
- full source citations, related Learn guides and related pathways; and
- the optional Create frame, including a representative original fragment and
  its care note.

The Create link carries only the public concept slug. The server resolves that
slug against the reviewed content registry and preselects a compatible frame;
unknown slugs are ignored. It does not store a spiritual profile or infer a
belief from browsing behaviour.

## Daily Inner Practice

Today turns the same `ConceptEngineFrame` records into an optional four-part
practice: arrive in body and place, receive original prayer language, embody
one grounded action, then reflect and return to ordinary activity. This reuses
the frame's declared source relationships and safety note rather than creating
an untraceable daily-inspiration layer.

Selection is a deterministic hash of the local calendar date and an explicitly
chosen worldview framing. The interface names it as an editorial library
rotation, never a message, sign or prediction. The framing choice lives only in
component memory and is not stored or treated as a belief. If the user marks a
practice complete, local storage records only the date and concept ID; no
reflection response, journal text or attainment status is collected.
