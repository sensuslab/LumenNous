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
  {
    id: "src-quantum-prayers-coherence",
    title:
      "Quantum Prayers: Coherence, Consciousness & The Art of Aligned Prayer",
    author: "",
    institution: "User-provided source document",
    year: null,
    sourceType: "modern-spiritual",
    tradition: "Contemporary spiritual synthesis / Quantum Prayer methodology",
    claimClassification: "modern-interpretation",
    url: "",
    citation:
      "Quantum Prayers: Coherence, Consciousness & The Art of Aligned Prayer. User-provided 43-page PDF reviewed July 2026. Cited for its five-stage contemplative method, not as scientific authority for quantum-mechanical claims.",
    copyrightNotes:
      "Local source supplied for editorial review; summarised and adapted, not reproduced.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-neuroscience-frequency-music",
    title: "Neuroscience of Frequency Based Music",
    author: "",
    institution: "User-provided research memo",
    year: null,
    sourceType: "reference-work",
    tradition: "Music, auditory neuroscience and wellness research synthesis",
    claimClassification: "modern-interpretation",
    url: "",
    citation:
      "Neuroscience of Frequency Based Music. User-provided research memo reviewed July 2026. Used as a scoping document; individual claims were checked against primary studies and systematic reviews.",
    copyrightNotes:
      "Local research memo. Its reference list and evidence grades are incomplete, so it is not treated as a systematic review.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-youtube-audio-register-expanded",
    title: "Expanded YouTube Audio Register",
    author: "",
    institution: "LumenNous editorial research",
    year: 2026,
    sourceType: "reference-work",
    tradition: "Contemplative-audio editorial catalogue",
    claimClassification: "modern-interpretation",
    url: "",
    citation:
      "youtube_audio_register_expanded.csv. User-provided 153-record editorial audit catalogue reviewed July 2026; preserved verbatim in the project research corpus.",
    copyrightNotes:
      "Metadata audit only. Linked audio remains the property of its creators and platforms.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-slow-breathing-systematic-review",
    title:
      "How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing",
    author:
      "Andrea Zaccaro, Andrea Piarulli, Marco Laurino, Erika Garbella, Danilo Menicucci, Bruno Neri and Angelo Gemignani",
    institution: "Frontiers in Human Neuroscience",
    year: 2018,
    sourceType: "academic-article",
    tradition: "Psychophysiology / slow-breathing research",
    claimClassification: "research-synthesis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6137615/",
    citation:
      "Zaccaro A, Piarulli A, Laurino M, et al. How Breath-Control Can Change Your Life. Front Hum Neurosci. 2018;12:353. doi:10.3389/fnhum.2018.00353. Systematic review of 15 studies in healthy participants.",
    copyrightNotes: "Open-access scholarly article; paraphrased, not reproduced.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-music-listening-anxiety-meta-analysis",
    title:
      "Effects of music therapy on anxiety: A meta-analysis of randomized controlled trials",
    author:
      "Guangli Lu, Ruiying Jia, Dandan Liang, Jingfen Yu, Zhen Wu and Chaoran Chen",
    institution: "Psychiatry Research",
    year: 2021,
    sourceType: "academic-article",
    tradition: "Music-therapy outcomes research",
    claimClassification: "research-synthesis",
    url: "https://pubmed.ncbi.nlm.nih.gov/34365216/",
    citation:
      "Lu G, Jia R, Liang D, et al. Effects of music therapy on anxiety: A meta-analysis of randomized controlled trials. Psychiatry Res. 2021;304:114137. doi:10.1016/j.psychres.2021.114137. Thirty-two studies, 1,924 participants.",
    copyrightNotes:
      "Abstract and citation used under ordinary scholarly reference practice. Results apply to studied interventions, not every track in the catalogue.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-natural-sounds-synthesis",
    title:
      "A synthesis of health benefits of natural sounds and their distribution in national parks",
    author: "Rachel T. Buxton et al.",
    institution: "Proceedings of the National Academy of Sciences",
    year: 2021,
    sourceType: "academic-article",
    tradition: "Soundscape and environmental-health research",
    claimClassification: "research-synthesis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8040792/",
    citation:
      "Buxton RT et al. A synthesis of health benefits of natural sounds and their distribution in national parks. Proc Natl Acad Sci USA. 2021;118(14):e2013097118. Systematic review of 36 articles with 18 in meta-analysis.",
    copyrightNotes:
      "Open-access scholarly article; modality-level findings are not presented as proof for a particular YouTube recording.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-binaural-entrainment-review",
    title:
      "Binaural beats to entrain the brain? A systematic review of effects on brain oscillatory activity",
    author: "",
    institution: "PLOS ONE / PubMed Central",
    year: 2023,
    sourceType: "academic-article",
    tradition: "Auditory neuroscience",
    claimClassification: "research-synthesis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/",
    citation:
      "Binaural beats to entrain the brain? A systematic review of the effects of binaural beat stimulation on brain oscillatory activity, and implications for psychological research and intervention. PLOS ONE. 2023. PMCID: PMC10198548.",
    copyrightNotes:
      "Open-access systematic review; findings were heterogeneous and do not establish reliable state control.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-adhd-coloured-noise-meta-analysis",
    title:
      "Do White Noise and Pink Noise Help With Attention in Attention-Deficit/Hyperactivity Disorder?",
    author:
      "Joel T. Nigg, Alisha Bruton, Michael B. Kozlowski, Jeanette M. Johnstone and Sarah L. Karalunas",
    institution:
      "Journal of the American Academy of Child & Adolescent Psychiatry",
    year: 2024,
    sourceType: "academic-article",
    tradition: "ADHD and attention research",
    claimClassification: "research-synthesis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11283987/",
    citation:
      "Nigg JT, Bruton A, Kozlowski MB, Johnstone JM, Karalunas SL. Systematic Review and Meta-Analysis: Do White Noise and Pink Noise Help With Attention in ADHD? J Am Acad Child Adolesc Psychiatry. 2024;63(8):778–788. doi:10.1016/j.jaac.2023.12.014.",
    copyrightNotes:
      "Open manuscript. The small laboratory-task benefit was limited to ADHD/high-symptom groups; no brown-noise studies were identified.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-singing-bowl-systematic-review",
    title: "Therapeutic effects of singing bowls: A systematic review of clinical studies",
    author: "",
    institution: "PubMed Central",
    year: 2025,
    sourceType: "academic-article",
    tradition: "Sound-based wellness research",
    claimClassification: "research-synthesis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12063014/",
    citation:
      "Therapeutic effects of singing bowls: A systematic review of clinical studies. 2025. PMCID: PMC12063014. Nineteen heterogeneous studies; assessed randomised trials were at high risk of bias.",
    copyrightNotes:
      "Open-access scholarly article; used to justify a preliminary/experiential label, not a therapeutic promise.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-who-safe-listening",
    title: "Deafness and hearing loss: Safe listening",
    author: "World Health Organization",
    institution: "World Health Organization",
    year: 2026,
    sourceType: "health-resource",
    tradition: "Public-health hearing guidance",
    claimClassification: "research-synthesis",
    url: "https://www.who.int/news-room/questions-and-answers/item/deafness-and-hearing-loss-safe-listening",
    citation:
      "World Health Organization. Deafness and hearing loss: Safe listening. Updated 6 March 2026. Guidance emphasises that volume, listening duration and repeated exposure jointly determine risk.",
    copyrightNotes:
      "WHO public-health guidance; linked and paraphrased.",
    lastVerified: "2026-07-23",
  },
  {
    id: "src-quantum-rng-null-study",
    title:
      "A large-scale test of micro-psychokinesis using quantum random number generators",
    author: "",
    institution: "Frontiers in Psychology / PubMed Central",
    year: 2018,
    sourceType: "academic-article",
    tradition: "Consciousness claims / confirmatory experimental research",
    claimClassification: "research-synthesis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5872141/",
    citation:
      "A large-scale test of micro-psychokinesis using quantum random number generators. Front Psychol. 2018. PMCID: PMC5872141. Online study with 12,571 participants; confirmatory analysis supported the null model.",
    copyrightNotes:
      "Open-access scholarly article; cited to prevent claims that intention reliably changes quantum random events.",
    lastVerified: "2026-07-23",
  },
];

// Validated at module load — a malformed source record fails the build/tests.
export const sources: Source[] = SourceSchema.array().parse(raw);

export const sourceById = new Map(sources.map((source) => [source.id, source]));
