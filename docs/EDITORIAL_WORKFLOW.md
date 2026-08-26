# Editorial review and publication workflow

LumenNous source-aware content is fail-closed. Browser review work can prepare
evidence, but it cannot alter the shipped library or publish a spiritual claim.
Publication requires an attributable review record and a source-controlled
status change that pass validation together.

## Review workspace

Open `/editorial` in a local build. The route is marked `noindex` and covers
the core source graph plus every source-aware library record:

- contemplative concepts, Create concept frames and guided pathways; and
- source-cited or passage-mapped prayers, affirmations, practices, reflection
  prompts and teachings.

Each packet brings together the subject copy, claim and tradition labels,
safety frame, passage relationships, source citations, edition rights and OCR
quality. The checklist adds evidence-specific requirements. Grumbine-derived
subjects receive an OCR check; subjects joining the ancient Nag Hammadi
`Melchizedek` and Grumbine's 1919 interpretation receive a separate historical-
distinction check.

Older content may cite a work without a structured `sourceUses` passage map.
Its review packet still exposes the citation, but adds a mandatory decision:
either add a verified passage anchor or record that the citation is background
or further reading only. A work-level citation is never silently treated as
passage-level evidence.

## Three required gates

1. **Source review** verifies work and section locators, interpretive relation
   labels, edition quality, rights and originality. Extraction maps must be
   checked against the named edition before an anchor is upgraded from
   `mapped-from-extraction`.
2. **Safety review** verifies agency, reality-testing, consent, stopping
   conditions, grounding and the absence of psychic training, oracular claims,
   cosmic assignment, clerical rank or guaranteed attainment.
3. **Copy review** verifies visible classification, historical specificity,
   accessible language and the absence of uncleared translation wording.

The console marks a stage complete only when every requirement for that subject
is checked. A publication-ready record additionally requires a reviewer and an
ISO review date.

## Local draft and export

Workspace drafts live under `lumennous-editorial-workspace-v1` in browser local
storage. They can include the reviewer name and review notes, are not uploaded,
and can be cleared per subject. Do not place sensitive personal information in
review notes.

Download or copy the generated `EditorialReview` JSON. Export does not publish
the subject. The generated status `published` means the *review record* is
complete enough to accompany a publication change.

Ingest an exported object (or an array of objects) with:

```sh
npm run editorial:ingest -- path/to/rev-subject-id.json
```

The command validates the publication state, all three completed stages,
reviewer, real calendar date, field lengths and identifiers. It refuses review
ID or subject collisions, writes `src/data/editorial-reviews.json` atomically,
and runs the schema and workspace gates. If either gate fails, it restores the
registry before exiting with an error. It never changes a subject's status.

## Controlled promotion

In one reviewed code change:

1. Re-check and, where justified, update passage-anchor verification metadata.
2. Ingest the exported record into `src/data/editorial-reviews.json` with the
   command above.
3. Change the matching subject's `editorialStatus` from `draft` to `published`.
4. Run `npm run check`.
5. Inspect every available public preview before merging.

`validateContent()` rejects published subjects without a matching published
review record. `EditorialReviewSchema` rejects a published record missing any
stage, reviewer or date. A review record does not override rights restrictions,
source uncertainty or a failed safety check.
