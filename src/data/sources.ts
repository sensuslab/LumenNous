/**
 * Seed sources — REAL, verifiable works only.
 *
 * Editorial policy (per brief):
 * - Never fabricate a scripture, quotation, translation or citation.
 * - `url` is a canonical reference (gnosis.org, publisher, official site) or
 *   "" when we are not confident in a precise deep link.
 * - `lastVerified` records when an editor last checked the link/record.
 *
 * Classification note: the fixed claimClassification value set has no
 * "established-evidence" bucket, so mainstream public-health guidance
 * (NHS, Samaritans, Mind, 988) is labelled "modern-interpretation" — the
 * least misleading available value — and its role is clarified in the
 * citation/copyright notes as safety signposting, not spiritual teaching.
 */

import { SourceSchema, type Source } from "../lib/schemas";

const raw: Source[] = [
  {
    id: "src-nag-hammadi-library",
    title: "The Nag Hammadi Library in English",
    author: "James M. Robinson (general editor)",
    institution: "Harper & Row / Brill",
    year: 1988,
    sourceType: "translation",
    tradition: "Gnostic traditions (Coptic codices, c. 4th century)",
    claimClassification: "historical-teaching",
    url: "http://gnosis.org/naghamm/nhl.html",
    citation:
      "Robinson, James M., ed. The Nag Hammadi Library in English. 3rd ed. San Francisco: Harper & Row, 1988. English translations of the thirteen codices discovered near Nag Hammadi, Egypt, in 1945.",
    copyrightNotes:
      "Translations are copyrighted by their translators and publisher; cite, do not reproduce at length.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-gospel-of-thomas",
    title: "The Gospel of Thomas (Nag Hammadi Codex II)",
    author: "",
    institution: "The Gnostic Society Library",
    year: null,
    sourceType: "ancient-text",
    tradition: "Early Christian / Gnostic sayings tradition",
    claimClassification: "historical-teaching",
    url: "http://gnosis.org/naghamm/gthlamb.html",
    citation:
      "The Gospel of Thomas. Coptic text from Nag Hammadi Codex II; English translation by Thomas O. Lambdin. A collection of 114 sayings attributed to Jesus, preserved without narrative frame.",
    copyrightNotes:
      "Lambdin translation used by the Gnostic Society Library with permission; reference only.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-gospel-of-philip",
    title: "The Gospel of Philip (Nag Hammadi Codex II)",
    author: "",
    institution: "The Gnostic Society Library",
    year: null,
    sourceType: "ancient-text",
    tradition: "Valentinian Gnostic tradition",
    claimClassification: "historical-teaching",
    url: "http://gnosis.org/naghamm/gop.html",
    citation:
      "The Gospel of Philip. Coptic text from Nag Hammadi Codex II; English translation by Wesley W. Isenberg. Sacramental and symbolic reflections from a Valentinian community.",
    copyrightNotes: "Reference only; translation rights retained by translator/publisher.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-apocryphon-of-john",
    title: "The Apocryphon of John (Nag Hammadi Codex II)",
    author: "",
    institution: "The Gnostic Society Library",
    year: null,
    sourceType: "ancient-text",
    tradition: "Sethian Gnostic tradition",
    claimClassification: "historical-teaching",
    url: "http://gnosis.org/naghamm/apocjn.html",
    citation:
      "The Apocryphon of John. Coptic text surviving in four versions (NHC II,1; III,1; IV,1; BG 8502,2). A foundational Sethian revelation dialogue describing the Monad, the Pleroma, Sophia and the demiurge.",
    copyrightNotes: "Reference only.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-pistis-sophia",
    title: "Pistis Sophia",
    author: "G. R. S. Mead (translator)",
    institution: "The Gnostic Society Library",
    year: 1921,
    sourceType: "ancient-text",
    tradition: "Gnostic traditions (Coptic, Askew Codex)",
    claimClassification: "historical-teaching",
    url: "http://gnosis.org/library/pistis-sophia.htm",
    citation:
      "Pistis Sophia. Translated by G. R. S. Mead. London: John M. Watkins, 1921. A late Coptic Gnostic work centred on the fall and restoration of Sophia (Faith-Wisdom).",
    copyrightNotes:
      "Mead translation is in the public domain; still cited rather than reproduced here.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-thunder-perfect-mind",
    title: "The Thunder, Perfect Mind (Nag Hammadi Codex VI)",
    author: "",
    institution: "The Gnostic Society Library",
    year: null,
    sourceType: "ancient-text",
    tradition: "Gnostic / wisdom poetic tradition",
    claimClassification: "historical-teaching",
    url: "http://gnosis.org/naghamm/thunder.html",
    citation:
      "The Thunder, Perfect Mind. Coptic text from Nag Hammadi Codex VI. A paradoxical poetic self-disclosure of a feminine divine figure, echoing earlier Isis aretalogies.",
    copyrightNotes: "Reference only.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-psalms-nrsv",
    title: "The Book of Psalms (NRSV)",
    author: "",
    institution: "BibleGateway / National Council of Churches",
    year: 1989,
    sourceType: "scripture",
    tradition: "Hebrew Bible / Jewish and Christian prayer tradition",
    claimClassification: "historical-teaching",
    url: "https://www.biblegateway.com/",
    citation:
      "The Book of Psalms. New Revised Standard Version. The Psalter is the shared prayer-book of Jewish and Christian traditions: lament, praise, trust and petition across 150 poems.",
    copyrightNotes:
      "NRSV text is copyrighted by the National Council of Churches; Psalms are referenced by number, not reproduced.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-hermetica-copenhaver",
    title: "Hermetica: The Greek Corpus Hermeticum and the Latin Asclepius",
    author: "Brian P. Copenhaver (translator)",
    institution: "Cambridge University Press",
    year: 1992,
    sourceType: "translation",
    tradition: "Hermetic tradition (Graeco-Egyptian, 2nd–3rd century)",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "Copenhaver, Brian P. Hermetica: The Greek Corpus Hermeticum and the Latin Asclepius in a New English Translation. Cambridge: Cambridge University Press, 1992. Philosophical-religious treatises attributed to Hermes Trismegistus.",
    copyrightNotes: "Translation copyrighted by Cambridge University Press; cite, do not reproduce.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-pagels-gnostic-gospels",
    title: "The Gnostic Gospels",
    author: "Elaine Pagels",
    institution: "Random House",
    year: 1979,
    sourceType: "academic-book",
    tradition: "History of early Christianity",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "Pagels, Elaine. The Gnostic Gospels. New York: Random House, 1979. Accessible scholarly account of the Nag Hammadi discoveries and what they reveal about the diversity of early Christianity.",
    copyrightNotes: "Copyrighted scholarly work; cited as further reading.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-king-what-is-gnosticism",
    title: "What Is Gnosticism?",
    author: "Karen L. King",
    institution: "Harvard University Press",
    year: 2003,
    sourceType: "academic-book",
    tradition: "History of religions / early Christianity",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "King, Karen L. What Is Gnosticism? Cambridge, MA: Harvard University Press, 2003. A critical study of how the category 'Gnosticism' was constructed by modern scholarship, arguing for careful, plural description of the ancient texts.",
    copyrightNotes: "Copyrighted scholarly work; cited as further reading.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-jonas-gnostic-religion",
    title: "The Gnostic Religion",
    author: "Hans Jonas",
    institution: "Beacon Press",
    year: 1958,
    sourceType: "academic-book",
    tradition: "History of religions / philosophy",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "Jonas, Hans. The Gnostic Religion: The Message of the Alien God and the Beginnings of Christianity. Boston: Beacon Press, 1958 (2nd ed. 1963). Classic existential-phenomenological synthesis of Gnostic myth and thought.",
    copyrightNotes: "Copyrighted scholarly work; cited as further reading.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-deconick-gnostic-new-age",
    title: "The Gnostic New Age: How a Countercultural Spirituality Revolutionized Religion from Antiquity to Today",
    author: "April D. DeConick",
    institution: "Columbia University Press",
    year: 2016,
    sourceType: "academic-book",
    tradition: "History of religions / contemporary spirituality",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "DeConick, April D. The Gnostic New Age. New York: Columbia University Press, 2016. Traces Gnostic spirituality from ancient movements into modern and contemporary religious currents.",
    copyrightNotes: "Copyrighted scholarly work; cited as further reading.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-gospel-of-mary-king",
    title: "The Gospel of Mary of Magdala: Jesus and the First Woman Apostle",
    author: "Karen L. King",
    institution: "Polebridge Press",
    year: 2003,
    sourceType: "academic-book",
    tradition: "Early Christian literature",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "King, Karen L. The Gospel of Mary of Magdala: Jesus and the First Woman Apostle. Santa Rosa: Polebridge Press, 2003. Translation and study of the fragmentary Gospel of Mary (BG 8502,1).",
    copyrightNotes: "Copyrighted scholarly work; cited as further reading.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-layton-gnostic-scriptures",
    title: "The Gnostic Scriptures: A New Translation with Annotations and Introductions",
    author: "Bentley Layton",
    institution: "Doubleday",
    year: 1987,
    sourceType: "translation",
    tradition: "Gnostic traditions",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "Layton, Bentley. The Gnostic Scriptures: A New Translation with Annotations and Introductions. New York: Doubleday, 1987. Annotated translations of major Gnostic and related patristic texts.",
    copyrightNotes: "Translation copyrighted; cited as further reading.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-cloud-of-unknowing",
    title: "The Cloud of Unknowing",
    author: "",
    institution: "",
    year: null,
    sourceType: "ancient-text",
    tradition: "Christian contemplative (apophatic) tradition, 14th-century England",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "Anonymous. The Cloud of Unknowing. 14th-century Middle English guide to contemplative prayer: approaching God beyond images and concepts, 'by love'. Many modern translations exist (e.g. Penguin Classics).",
    copyrightNotes: "Medieval text in the public domain; modern translations are copyrighted.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-plotinus-enneads",
    title: "The Enneads",
    author: "Plotinus; Lloyd P. Gerson et al. (translators)",
    institution: "Cambridge University Press",
    year: 2018,
    sourceType: "translation",
    tradition: "Neoplatonic philosophy (3rd century)",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "Plotinus. The Enneads. Edited by Lloyd P. Gerson; translated by George Boys-Stones et al. Cambridge: Cambridge University Press, 2018. Foundational Neoplatonic treatises on the One, Intellect and Soul.",
    copyrightNotes: "Translation copyrighted by Cambridge University Press; cited as further reading.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-hildegard-symphonia",
    title: "Symphonia armoniae celestium revelationum",
    author: "Hildegard of Bingen; Barbara Newman (editor/translator)",
    institution: "Cornell University Press",
    year: 1988,
    sourceType: "translation",
    tradition: "Medieval Christian sacred music and visionary theology",
    claimClassification: "historical-teaching",
    url: "",
    citation:
      "Hildegard of Bingen. Symphonia: A Critical Edition of the Symphonia armoniae celestium revelationum. Edited and translated by Barbara Newman. Ithaca: Cornell University Press, 1988. Songs of the 12th-century abbess, composer and visionary.",
    copyrightNotes: "Newman's edition copyrighted; melodies themselves are medieval and public domain.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-nhs-every-mind-matters",
    title: "Every Mind Matters",
    author: "NHS England",
    institution: "NHS",
    year: null,
    sourceType: "health-resource",
    tradition: "Public health guidance (UK)",
    claimClassification: "modern-interpretation",
    url: "https://www.nhs.uk/every-mind-matters/",
    citation:
      "NHS. Every Mind Matters. Mainstream UK public-health guidance for mental wellbeing: sleep, stress, anxiety and low mood. Included for safety signposting; spiritual practice is not a substitute for professional care.",
    copyrightNotes: "Crown copyright; linked as an external public resource.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-nhs-breathing-exercises",
    title: "Breathing exercises for stress",
    author: "NHS",
    institution: "NHS",
    year: null,
    sourceType: "health-resource",
    tradition: "Public health guidance (UK)",
    claimClassification: "modern-interpretation",
    url: "https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/",
    citation:
      "NHS. Breathing exercises for stress. Simple, mainstream guidance on calming breath techniques. Referenced to keep breath practices gentle, accessible and non-medicalising.",
    copyrightNotes: "Crown copyright; linked as an external public resource.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-samaritans",
    title: "Samaritans — 24/7 listening support",
    author: "Samaritans",
    institution: "Samaritans",
    year: null,
    sourceType: "health-resource",
    tradition: "Crisis support (UK & Ireland)",
    claimClassification: "modern-interpretation",
    url: "https://www.samaritans.org/",
    citation:
      "Samaritans. Free, confidential, 24/7 listening service for anyone struggling to cope (UK & Ireland: call 116 123). Referenced in the safety response for crisis-level requests.",
    copyrightNotes: "Linked as an external public resource.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-mind",
    title: "Mind — mental health information and support",
    author: "Mind",
    institution: "Mind (mental health charity)",
    year: null,
    sourceType: "health-resource",
    tradition: "Mental health charity (England & Wales)",
    claimClassification: "modern-interpretation",
    url: "https://www.mind.org.uk/",
    citation:
      "Mind. Mental health information, support lines and local services across England and Wales. Referenced for safety signposting alongside spiritual content.",
    copyrightNotes: "Linked as an external public resource.",
    lastVerified: "2026-07-18",
  },
  {
    id: "src-988-lifeline",
    title: "988 Suicide & Crisis Lifeline",
    author: "988 Suicide & Crisis Lifeline",
    institution: "SAMHSA (US)",
    year: null,
    sourceType: "health-resource",
    tradition: "Crisis support (United States)",
    claimClassification: "modern-interpretation",
    url: "https://988lifeline.org/",
    citation:
      "988 Suicide & Crisis Lifeline. Free, confidential, 24/7 support in the United States by call or text to 988. Referenced in the safety response for crisis-level requests.",
    copyrightNotes: "Linked as an external public resource.",
    lastVerified: "2026-07-18",
  },
];

// Validated at module load — a malformed source record fails the build/tests.
export const sources: Source[] = SourceSchema.array().parse(raw);

export const sourceById = new Map(sources.map((source) => [source.id, source]));
