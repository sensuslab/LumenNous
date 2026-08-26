# Text-agnostic source ingestion

LumenNous processes every publication through the same boundary. Nag Hammadi,
Grumbine, a scripture translation and a future research text differ in their
metadata and structure, not in the application code that imports them.

The ingestion system never treats document contents as instructions. A source
file is inert evidence. Parsing it cannot publish a claim, create a prayer or
approve a contemplative interpretation.

## Separation of responsibilities

The workflow has three deliberately separate layers:

1. **Document ingestion** identifies the exact file, verifies its SHA-256 and
   converts its native structure into canonical nodes.
2. **Passage mapping** selects a stable canonical node or node range and creates
   a draft `PassageAnchor` with source, edition and concept references.
3. **Editorial application** connects a reviewed anchor to a prayer, teaching,
   practice, prompt, pathway or Create frame through an explicit relationship.

No layer infers approval for the next. In particular, importing a text does not
mean its claims are endorsed, and selecting a passage does not mean a product
adaptation faithfully represents it.

## Registries and private files

Source-controlled registries contain metadata only:

- `src/data/ingested-sources.json` contains new intellectual-work records;
- `src/data/source-editions.json` identifies exact translations or files;
- `src/data/ingested-passage-anchors.json` contains canonical-node mappings;
- `src/data/source-review-policies.json` contains reusable review constraints.

Parsed source wording is written under `.source-workbench/`, which is ignored
by Git. The default workbench includes text so an editor can search and inspect
context. Use `--redact-text` when only hashes, hierarchy and locators are
needed. Never copy a private workbench into `public/`, `src/` or a commit.

## Supported structures

Every adapter emits the same node kinds: collection, work, book, chapter,
section, paragraph, verse, page and line.

| Input | Native structure |
| --- | --- |
| EPUB | spine paths, headings, paragraphs and scanned-page files |
| HTML | headings and content blocks |
| Markdown | headings and paragraphs |
| Plain text | paragraphs |
| USFM | book, chapter and verse markers |
| OSIS XML | book, chapter and verse identifiers |
| JSON tree | pre-normalised canonical nodes |
| PDF | page-layout text through the optional `pdftotext` executable |

EPUB collections may add `workMappings` to the manifest. These are data-level
path selectors that assign spine documents to constituent work sources; the
EPUB adapter contains no tractate or publication names.

## Prepare a source

Copy the nearest JSON file in `source-manifests/` and replace every metadata
field. A manifest records:

- the root source and any new source records;
- the exact edition, translation, language and publisher;
- rights and OCR status;
- format, file-name hint and optional expected SHA-256;
- locator strategy; and
- optional collection work mappings.

Run a dry import first:

```sh
npm run sources:ingest -- path/to/manifest.json \
  --source path/to/publication.epub --dry-run
```

The command verifies the fingerprint and writes
`.source-workbench/<manifest-id>/canonical-document.json`. Node identifiers are
derived deterministically from the edition, native locator and ordinal. The
same file and manifest therefore produce the same identifiers.

Review the hierarchy, OCR warnings, collection mappings, citation, rights and
edition record. For a genuinely new source and edition, register them with:

```sh
npm run sources:ingest -- path/to/manifest.json \
  --source path/to/publication.epub --commit
```

Commit mode refuses source or edition collisions, updates both registries and
runs the source/content gates. If any gate fails, both registry files are
restored. Existing editions are intentionally dry-run-only compatibility
fixtures; re-importing them does not create duplicate registrations.

## Create a passage map

After inspecting a canonical document, prepare an anchor request:

```json
{
  "id": "anc-example-inner-stillness",
  "sourceId": "src-example-work",
  "workTitle": "Example Work",
  "sectionTitle": "Inner stillness",
  "startNodeId": "node-0123456789abcdef01234567",
  "endNodeId": "node-89abcdef0123456701234567",
  "conceptIds": ["con-silence-stillness"],
  "verification": "mapped-from-extraction",
  "notes": "Original editorial note describing scope, uncertainty and safe use."
}
```

Create a candidate without changing the application:

```sh
npm run sources:anchor -- path/to/anchor-request.json \
  --document .source-workbench/<manifest-id>/canonical-document.json --dry-run
```

The builder checks node existence, range order and collection-work scope, then
emits a `canonical-node` structured locator. After human source and semantic
review, rerun with `--commit`. Commit mode updates only
`ingested-passage-anchors.json`, runs the content gate and rolls back failure.
It never adds `sourceUses`, changes editorial status or publishes application
copy.

## Review policies

Special handling is registry data rather than source-specific code. A policy
declares its review stage, detail, scoped source/edition IDs and activation:

- `any` activates when any scoped source or edition appears;
- `all` activates only when every scoped source and edition appears.

This supports OCR warnings, fragmentary-text limits, disputed attribution,
translation-specific rights, historical distinctions and safety boundaries.
For example, the ancient and 1919 Melchizedek distinction is an `all` policy;
the editorial workspace does not contain those source IDs.

## Compatibility fixtures

- `nag-hammadi-library.json` exercises EPUB collection/work mapping, duplicate
  translations, restricted wording and variable OCR.
- `grumbine-melchizedek.json` exercises a page-oriented OCR EPUB, uncertain
  rights and a modern esoteric interpretation.
- `scripture-usfm-template.json` exercises book/chapter/verse addressing while
  keeping translation identity and rights edition-specific.

Run the focused gate with `npm run sources:check`. These fixtures are also
validated by the complete `npm test` and `npm run check` workflows.
