/**
 * Seed prayers — at least three per category.
 *
 * All prayers are ORIGINAL editorial writing for the LumenNous: they
 * draw on Gnostic/cosmic imagery (Creator, Source, light, aeons, Sophia)
 * and on the shared prayer instincts of the Psalms (lament, trust,
 * petition), without reproducing any copyrighted or scriptural text and
 * without presenting one interpretation as authoritative.
 *
 * Editorial rules honoured throughout (brief: safety and Engine instructions):
 * - no guaranteed healing, wealth, protection, manifestation or transformation
 * - suffering is never framed as the result of insufficient belief
 * - no diagnosis of spiritual attack, possession or energetic contamination
 * - prayer is companionship, never a replacement for professional care
 *
 * `content` is assembled from opening + body + closing at build time so the
 * full text can never drift out of sync with its parts.
 */

import {
  PrayerSchema,
  type Prayer,
  type SourceRelation,
  type TimeOfDay,
  type TraditionLabel,
} from "../lib/schemas";
import {
  corpusSeedPrayers,
  expandCorpusCategoryIds,
} from "./corpus";

interface PrayerDef {
  title: string;
  opening: string;
  body: string;
  closing: string;
  affirmation: string;
  practiceDuration: number;
  practiceSteps: string[];
  traditionLabels: TraditionLabel[];
  sourceIds: string[];
  sourceUses?: Array<{ anchorId: string; relation: SourceRelation }>;
  tags: string[];
  timeOfDay: TimeOfDay;
  seasonalMonths?: number[];
  safetyNotes?: string;
}

const DEFS: Record<string, PrayerDef[]> = {
  "grounding-and-stillness": [
    {
      title: "The Ground Beneath",
      opening: "Source of all that is steady, I come to you as I am — hurried, scattered, human.",
      body:
        "Before I ask for anything, let me arrive. Let my weight be honest on the ground that holds me. " +
        "Let my breath find its own depth without being forced. In the quiet beneath my thoughts, teach me " +
        "that I am already held — not because I have earned it, but because being held is the nature of things. " +
        "Still my inner weather, not by silencing it, but by giving it sky enough to move through.",
      closing: "I rest in what is real. I am here. That is enough for now. Amen.",
      affirmation: "I am held by what is beneath me; I do not have to hold everything myself.",
      practiceDuration: 4,
      practiceSteps: [
        "Stand or sit with both feet on the floor; feel the points of contact for three slow breaths.",
        "Let your shoulders drop and unclench your jaw; notice where tension was hiding.",
        "Breathe in for a count of four, out for a count of six, five times through.",
        "Read the prayer slowly, pausing where a word catches you.",
        "Sit in silence for one minute before returning to the day.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-cloud-of-unknowing"],
      tags: ["grounding", "stillness", "breath"],
      timeOfDay: "any",
    },
    {
      title: "A Quiet House",
      opening: "Creator, who made the spaces between things as surely as the things themselves,",
      body:
        "my mind has been a crowded room today. I do not ask you to empty it by force; I ask you to open a window. " +
        "Let one clear thought be enough. Let one honest breath widen into calm. You are not in the noise I make " +
        "about you; you are in the stillness that was here first, waiting beneath everything I piled on top of it. " +
        "Give me the humility to stop rearranging the furniture and simply sit down in your presence.",
      closing: "In the quiet house of this moment, may I be a peaceable guest. Amen.",
      affirmation: "Stillness is not empty; it is where I can finally hear.",
      practiceDuration: 5,
      practiceSteps: [
        "Silence notifications and place the phone face down.",
        "Take three unhurried breaths, letting each out-breath be longer than the in-breath.",
        "Read the prayer once silently, once aloud if you can.",
        "Rest attention on the quietest sound in the room for one minute.",
      ],
      traditionLabels: ["original-composition", "symbolic-language"],
      sourceIds: ["src-cloud-of-unknowing"],
      tags: ["quiet", "presence", "simplicity"],
      timeOfDay: "evening",
    },
    {
      title: "One Thing at a Time",
      opening: "Ground of being, in whom nothing is rushed and nothing is late,",
      body:
        "I have been living five minutes ahead of myself all day. Call me back. Teach me the dignity of doing one " +
        "thing with my whole attention — this breath, this step, this person in front of me. The world asks me to " +
        "fracture; you invite me to gather. In the ordering of the aeons there is no panic, only unfolding. " +
        "Let a little of that patience enter my small hour, until I am doing what I am doing while I am doing it.",
      closing: "Let this next hour be whole. Let me be whole within it. Amen.",
      affirmation: "I can meet this moment; the next one will introduce itself in time.",
      practiceDuration: 3,
      practiceSteps: [
        "Name the single next thing you will do after this prayer.",
        "Take five slow breaths, counting each out-breath.",
        "Read the prayer with your hands open and still.",
        "Do that one named thing with full attention before anything else.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["attention", "presence", "simplicity"],
      timeOfDay: "any",
    },
  ],
  "connection-to-source": [
    {
      title: "Turning Toward",
      opening: "Source of all light, from whom every spark in me descended,",
      body:
        "I turn toward you the way a plant turns without deciding to. I do not bring a map of you, only a longing " +
        "for you. The old texts say you are fullness — Pleroma — nothing lacking, nothing excluded. If even a " +
        "fraction of that fullness leans toward the world, then my small life is not an accident of the dark. " +
        "Meet me in this turning. Not with signs I could mistake for my own wanting, but with the quiet certainty " +
        "that I am known, and was known, before I thought to ask.",
      closing: "From you I came; toward you I lean; in you I rest. Amen.",
      affirmation: "I belong to something deeper than my loneliness.",
      practiceDuration: 5,
      practiceSteps: [
        "Sit upright but unforced; let your hands rest open, palms up.",
        "Breathe slowly and picture a warm light above and behind you.",
        "Read the prayer as an address, not a performance.",
        "Remain in silence for two minutes, expecting nothing, refusing nothing.",
        "Close by naming one thing you are grateful to exist.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation", "historical-teaching"],
      sourceIds: [
        "src-apocryphon-of-john",
        "src-gospel-of-truth",
        "src-nag-hammadi-library",
      ],
      sourceUses: [
        { anchorId: "anc-truth-belonging-rest", relation: "inspired-by" },
      ],
      tags: ["source", "presence", "longing"],
      timeOfDay: "any",
    },
    {
      title: "The Unnameable",
      opening: "You who are beyond every name I have inherited,",
      body:
        "forgive the smallness of my vocabulary. I have called you many things — Creator, Source, Father, Mother, " +
        "Light — and each word has been a cup dipped in the ocean. Today I set the cup down. I approach you the " +
        "way the old contemplatives taught: not by saying more, but by loving past the edge of language. " +
        "Let my silence be fluent. Let my not-knowing be a form of worship rather than a failure of it.",
      closing: "Beyond words, I am still speaking to you. Beyond thought, you are still near. Amen.",
      affirmation: "I can honour the Divine without needing to define it.",
      practiceDuration: 6,
      practiceSteps: [
        "Settle into a comfortable seat and slow your breathing for one minute.",
        "Read the prayer once, noticing which line resists you.",
        "Sit in wordless quiet for three minutes; when thoughts come, let them pass without chase.",
        "End with a single word of your own — or none.",
      ],
      traditionLabels: ["original-composition", "historical-teaching", "symbolic-language"],
      sourceIds: ["src-cloud-of-unknowing"],
      tags: ["apophatic", "silence", "mystery"],
      timeOfDay: "evening",
    },
    {
      title: "First Light",
      opening: "Creator of the morning, before I become useful, let me become aware:",
      body:
        "this day is not mine by right but by gift. The light returning over the rooftops is older than every plan " +
        "I will make. You are the deep from which that light is drawn, and I — improbably — am one of the places " +
        "it landed. Let me carry it carefully. Let me spend it generously. And when the day pulls me in a hundred " +
        "directions, let me remember this first direction, the one that was only ever toward you.",
      closing: "As the light rises, I rise with it — yours, before I am anyone else's. Amen.",
      affirmation: "I begin this day in relationship, not in scarcity.",
      practiceDuration: 3,
      practiceSteps: [
        "Before checking any screen, stand where you can see the sky or a window.",
        "Take three full breaths and feel your feet on the floor.",
        "Read the prayer aloud in a low voice.",
        "Set one gentle intention for the day in a single sentence.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["morning", "gratitude", "light"],
      timeOfDay: "morning",
      seasonalMonths: [3, 4, 5],
    },
  ],
  "gnosis-and-inner-knowing": [
    {
      title: "The Spark Remembered",
      opening: "Source of all knowing, in whom nothing true is forgotten,",
      body:
        "the old Gnostic texts say there is a spark in us that remembers where it came from. I do not know if that " +
        "is doctrine or poetry; I only know that something in me leans homeward. Today I ask not for new " +
        "information but for deeper recognition. Let what is true in me recognise what is true around me. " +
        "Quiet the opinions I borrowed, the fears I mistook for wisdom, until the knowing that remains is simple, " +
        "kind and my own.",
      closing: "What is deepest in me, I entrust to what is deepest in all things. Amen.",
      affirmation: "Beneath the noise, something in me already knows the way home.",
      practiceDuration: 6,
      practiceSteps: [
        "Sit quietly and ask inwardly: what do I already know about this day?",
        "Notice whatever appears without treating it as instruction or final truth.",
        "Read the prayer slowly, twice.",
        "Test any insight against facts, care, and the perspective of someone trustworthy.",
        "Return to the question once more before sleep; an unanswered question is complete.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation", "historical-teaching"],
      sourceIds: ["src-gospel-of-thomas", "src-pagels-gnostic-gospels"],
      sourceUses: [
        { anchorId: "anc-thomas-inner-outer", relation: "inspired-by" },
      ],
      tags: ["gnosis", "inner-knowing", "spark"],
      timeOfDay: "any",
    },
    {
      title: "Underneath the Opinions",
      opening: "Quiet One, who speaks beneath argument and underneath certainty,",
      body:
        "I have filled my head with other people's answers. Today I ask for my own question back. Not a louder " +
        "certainty — a cleaner one. The teachers of the sayings tradition preserved a simple invitation: seek, " +
        "and do not stop seeking, though seeking unsettles before it illumines. Give me the patience to stay " +
        "with the unsettling. Let my understanding be ripened rather than rushed, and let me hold it lightly " +
        "enough that truth can still correct me.",
      closing: "May I seek honestly, find humbly, and keep seeking. Amen.",
      affirmation: "I can live my questions instead of borrowing my answers.",
      practiceDuration: 5,
      practiceSteps: [
        "Name one question that has been following you lately.",
        "Breathe slowly and resist answering it for one full minute.",
        "Read the prayer, letting the question stay open.",
        "Carry the open question into one ordinary task.",
      ],
      traditionLabels: ["original-composition", "historical-teaching"],
      sourceIds: ["src-gospel-of-thomas"],
      sourceUses: [
        { anchorId: "anc-thomas-inner-outer", relation: "paraphrase" },
      ],
      tags: ["seeking", "questions", "humility"],
      timeOfDay: "any",
    },
    {
      title: "A Lamp in the Interior",
      opening: "Light of the interior world, kindler of every small awakening,",
      body:
        "I have searched for you in commotion and missed you in the quiet room of myself. The mystics of many " +
        "roads agree on this much: what we seek is not absent, only overlooked. So I stop looking outward for a " +
        "moment and look inward without flinching. There is fear in there, and clutter, and also a lamp that " +
        "never fully went out. Tend it in me. Let it grow by attention the way all hidden things grow — slowly, " +
        "faithfully, and without spectacle.",
      closing: "Keep the lamp lit when I forget to watch it. Keep me watchful when I remember. Amen.",
      affirmation: "There is a light in me that survives my distraction.",
      practiceDuration: 7,
      practiceSteps: [
        "Close your eyes and imagine a small steady flame at your centre.",
        "With each breath, let attention rest on that image without strain.",
        "Read the prayer once with your eyes closed, from memory if possible, from the screen if not.",
        "Sit for three minutes in the imagined warmth.",
        "Open your eyes gently and keep the pace slow for a few minutes more.",
      ],
      traditionLabels: ["original-composition", "symbolic-language", "modern-interpretation"],
      sourceIds: ["src-gospel-of-thomas", "src-cloud-of-unknowing"],
      sourceUses: [
        { anchorId: "anc-thomas-inner-light", relation: "inspired-by" },
      ],
      tags: ["inner-light", "attention", "meditation"],
      timeOfDay: "evening",
    },
  ],
  "clarity-and-discernment": [
    {
      title: "Clear Water",
      opening: "Source of truth, who is never confused by my confusion,",
      body:
        "I bring you the muddied water of my thinking. I do not ask you to choose for me; I ask you to help me see. " +
        "Let the sediment settle — the fear, the flattery, the wish to be thought well of — until what remains is " +
        "clear enough to read. Give me honesty about my own motives, patience with unfinished answers, and the " +
        "courage to act on the little I do know rather than waiting for a certainty that may never come.",
      closing: "When the water clears, give me the will to follow what it shows. Amen.",
      affirmation: "I can see truly when I stop stirring the water.",
      practiceDuration: 5,
      practiceSteps: [
        "Write or hold in mind the decision in one plain sentence.",
        "Take five slow breaths and set the sentence down.",
        "Read the prayer without rehearsing arguments.",
        "Notice which option feels quieter — not easier, quieter.",
        "Decide only the next small step, not the whole road.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-gospel-of-thomas"],
      tags: ["decisions", "honesty", "discernment"],
      timeOfDay: "any",
    },
    {
      title: "The Next Right Step",
      opening: "Faithful Guide, who rarely shows the whole staircase,",
      body:
        "I confess I have been demanding the map before I will move. Today I ask for something smaller and more " +
        "honest: light for the next step only. If the step is wrong, give me the humility to notice quickly and " +
        "the grace to correct without self-punishment. If it is right, give me the steadiness to take the one " +
        "after it. Keep me from both paralysis and presumption — from doing nothing out of fear, and from doing " +
        "everything out of pride.",
      closing: "One step, taken honestly, is enough to offer you today. Amen.",
      affirmation: "I do not need the whole map to take one honest step.",
      practiceDuration: 4,
      practiceSteps: [
        "Stand still and feel both feet on the ground.",
        "Name aloud or silently the single next step you believe is right.",
        "Read the prayer, then breathe for one minute without re-arguing the decision.",
        "Take that step within the hour, however small it is.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: [],
      tags: ["guidance", "steps", "trust"],
      timeOfDay: "morning",
    },
    {
      title: "Two Voices",
      opening: "Discerning Spirit, meet me in honest attention,",
      body:
        "two counsels argue in me and both claim to be wisdom. One flatters my fear and calls it caution; one " +
        "flatters my pride and calls it purpose. Quiet may help me hear them clearly, but quiet alone does not " +
        "make a thought true. Teach me to test each counsel by honesty, care, evidence and the freedom it leaves " +
        "for other people. Until the next step is clear enough to examine, keep me from signing anything in a " +
        "hurry — with my hand or with my heart.",
      closing: "Let what is true in me answer what is true in you. Amen.",
      affirmation: "Quiet makes room for clarity; evidence, care and conversation help me recognise it.",
      practiceDuration: 6,
      practiceSteps: [
        "Sit with the two options and give each a plain, fair description.",
        "Notice how each feels in the body: contracted or settled.",
        "Read the prayer slowly.",
        "Wait one full day before acting, if the matter allows it.",
        "Seek the view of one trusted, disinterested person.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-gospel-of-philip"],
      tags: ["discernment", "counsel", "patience"],
      timeOfDay: "any",
    },
  ],
  "protection-and-boundaries": [
    {
      title: "A Shelter Not a Fortress",
      opening: "Sheltering One, in whom the vulnerable have always taken refuge,",
      body:
        "I ask for safety — not the illusion that nothing can touch me, but the reality of being accompanied in " +
        "whatever can. Teach me the difference between walls and boundaries: walls close me off from love; " +
        "boundaries let love in and keep harm out. Give me clarity about what is mine to carry and what was " +
        "never mine. And if I am in real danger — from another person, from my own despair — give me the courage " +
        "to reach for human help today, trusting that you often answer through other people.",
      closing: "Be my shelter in the storm, and my honesty about the weather. Amen.",
      affirmation: "I am allowed to protect my peace; asking for help is strength.",
      practiceDuration: 4,
      practiceSteps: [
        "Name one thing that has been draining your sense of safety.",
        "Breathe slowly and picture a clear, kind boundary around your attention.",
        "Read the prayer; notice the line about help without skipping it.",
        "If anything in your life is unsafe, message or call one trusted person or a support line today.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv", "src-mind"],
      tags: ["safety", "boundaries", "help"],
      timeOfDay: "any",
      safetyNotes:
        "This prayer explicitly encourages reaching out to trusted people and professional support; it never frames danger as spiritual attack.",
    },
    {
      title: "What Is Mine",
      opening: "Creator, who gave each creature its own shape and edge,",
      body:
        "I have let my edges blur. I absorb other people's storms and call it love; I carry other people's choices " +
        "and call it duty. Return to me what is mine: my time, my energy, my conscience, my no. And return to " +
        "others what is theirs: their feelings, their journeys, their consequences. Let my boundaries be clear " +
        "without being cruel, firm without being cold — a shoreline, not a weapon. Guard the good in me that " +
        "wants to help, and teach it to help without disappearing.",
      closing: "What is mine, I will tend. What is not, I release with blessing. Amen.",
      affirmation: "My 'no' can be as sacred as my 'yes'.",
      practiceDuration: 5,
      practiceSteps: [
        "Write or name one commitment that is not truly yours.",
        "Take five slow breaths, releasing the shoulders on each out-breath.",
        "Read the prayer, pausing at the sentence about your 'no'.",
        "Choose one small act of honest boundary-setting for today.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["boundaries", "energy", "honesty"],
      timeOfDay: "any",
    },
    {
      title: "Watchfire",
      opening: "Keeper of the night watch, who neither sleeps nor abandons,",
      body:
        "as this day ends I ask for watchfulness over my rest — not because the dark is full of enemies, but " +
        "because my mind sometimes invents them when the lights go out. Calm the sentries that over-report. " +
        "Quiet the alarms that fire at shadows. Let my home be ordinary and safe, my sleep be deep and " +
        "undefended, and my waking be free of the fears that feed on exhaustion. Where real concerns exist, " +
        "give me clear eyes and practical wisdom in the morning.",
      closing: "I entrust the night to you, and my fears with it. Amen.",
      affirmation: "The night is not my enemy; I can stand down.",
      practiceDuration: 4,
      practiceSteps: [
        "Dim the lights and put the day\'s screens away.",
        "Name one real concern and one imagined fear; tell them apart kindly.",
        "Read the prayer slowly in a low voice.",
        "Lie down and let each out-breath be a small act of standing down.",
      ],
      traditionLabels: ["original-composition", "symbolic-language"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["night", "safety", "rest"],
      timeOfDay: "evening",
      safetyNotes:
        "Deliberately avoids imagery of hostile forces; frames night fears as ordinary anxiety to be soothed, not enemies to be fought.",
    },
  ],
  "cleansing-and-release": [
    {
      title: "Open Hands",
      opening: "Source of mercy, who receives whatever we finally let go of,",
      body:
        "I have been holding this — this hurt, this failure, this version of events I keep re-arguing — as if " +
        "gripping it tighter could change it. It cannot. Today I practise the slow miracle of unclenching. " +
        "I do not pretend it did not matter; I simply stop letting it steer. Take from my hands what my hands " +
        "were never built to hold permanently. Rinse from my thinking what has already taught me everything " +
        "it had to teach. Let what remains be lighter, truer, and free to be used for good.",
      closing: "With open hands I receive this hour; with open hands I let the last one go. Amen.",
      affirmation: "I can honour what happened without carrying it forever.",
      practiceDuration: 5,
      practiceSteps: [
        "Hold your hands loosely closed; name what you are gripping.",
        "Read the prayer while slowly opening your hands.",
        "Take six long out-breaths, imagining the grip loosening with each.",
        "Leave your hands open on your lap for one quiet minute.",
      ],
      traditionLabels: ["original-composition", "symbolic-language"],
      sourceIds: [],
      tags: ["release", "letting-go", "hands"],
      timeOfDay: "any",
    },
    {
      title: "Rinse the Day",
      opening: "Cleansing One, in whom endings are made gentle,",
      body:
        "I bring you the residue of this day: the sharp word I regret, the task left undone, the worry that " +
        "followed me home like weather. Wash what can be washed. Let what must be addressed wait honestly on " +
        "tomorrow's list instead of pacing tonight's floor. I do not ask to forget — only to stop marinating. " +
        "Return my attention to this clean moment: water, breath, roof, the ordinary mercies I walked past " +
        "while rehearsing the hard parts.",
      closing: "The day is released; the night is received. Let me be clean of what is finished. Amen.",
      affirmation: "Today is complete; I am allowed to set it down.",
      practiceDuration: 4,
      practiceSteps: [
        "Name three things from today you are ready to set down.",
        "Wash your hands or face slowly, as a small ritual of release.",
        "Read the prayer without re-arguing any of the three things.",
        "Write tomorrow's first task on paper so it stops pacing.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["evening", "release", "ritual"],
      timeOfDay: "evening",
    },
    {
      title: "Uncluttered",
      opening: "Spirit of simplicity, who makes room where we had given up on space,",
      body:
        "my inner rooms are full: unfinished conversations, hoarded grievances, plans stacked against the walls. " +
        "I do not ask for a new house; I ask for one cleared corner. Help me sort honestly — what to keep, what " +
        "to mend, what to give away, what to mourn and discard. Teach me that release is not betrayal: I can " +
        "honour what a thing meant without keeping it forever. One clear corner, Creator. From there, we will " +
        "tidy the rest together, in our own time.",
      closing: "Make in me one clear, quiet space, and let it grow. Amen.",
      affirmation: "I can make room; I do not have to clear everything at once.",
      practiceDuration: 6,
      practiceSteps: [
        "Choose one small physical or mental clutter-point.",
        "Read the prayer, then spend five minutes clearing only that.",
        "Notice how the cleared corner feels; do not expand the task.",
        "Thank yourself for the one corner, out loud if you can.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["simplicity", "clutter", "gentleness"],
      timeOfDay: "any",
    },
  ],
  "root-work-and-restoration": [
    {
      title: "Back to the Roots",
      opening: "Patient Creator, who grows oaks at the speed of oaks,",
      body:
        "I have been demanding flowers from a season meant for roots. Forgive my impatience with the underground " +
        "work: the sleeping, the eating, the slow mending no one applauds. Teach me that restoration is not " +
        "regression. The tree does not apologise for winter. Give me the humility to do small sustaining things " +
        "without despising them — drink the water, take the walk, keep the appointment, answer the friend. " +
        "Let my strength return at its own honest pace, rooted deeper than before.",
      closing: "Grow me slowly and well. I will not rush the roots. Amen.",
      affirmation: "Slow repair is still repair; I honour the pace of healing.",
      practiceDuration: 5,
      practiceSteps: [
        "Name one basic need you have been postponing.",
        "Read the prayer, then meet that need within the next hour if you can.",
        "Take five breaths and release any shame about moving slowly.",
        "Choose one small sustaining ritual to repeat tomorrow.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-nhs-every-mind-matters"],
      tags: ["restoration", "patience", "basics"],
      timeOfDay: "any",
      safetyNotes: "Pairs spiritual patience with practical self-care; no health promises.",
    },
    {
      title: "The Floor Is Faithful",
      opening: "Ground of all being, underneath every collapse I have feared,",
      body:
        "when I am too tired to reach upward, let me discover you underneath. The floor that catches me, the " +
        "chair that holds me, the friend who does not need me to sparkle — these are not lesser graces. " +
        "They are the root-level kindness of things. Let me receive them without the performance of coping. " +
        "Let me be a person who is resting, not a person who is failing. Restore me in the low places, " +
        "where nothing is impressive and everything is true.",
      closing: "Underneath are the everlasting arms — I rest, and I am not ashamed to rest. Amen.",
      affirmation: "Resting is not failing; the ground is allowed to hold me.",
      practiceDuration: 6,
      practiceSteps: [
        "Sit or lie somewhere that fully supports your weight.",
        "Let your body be heavy on purpose for ten slow breaths.",
        "Read the prayer without sitting up straighter.",
        "Stay five more minutes, doing nothing to earn the rest.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["rest", "support", "exhaustion"],
      timeOfDay: "evening",
    },
    {
      title: "Tending the Small",
      opening: "Maker of roots and mornings, of bread and breath and other quiet miracles,",
      body:
        "bless the unremarkable maintenance of a life: the washed cup, the made bed, the medicine taken on time, " +
        "the apology finally sent. I have overlooked these because they do not glitter. But a life is restored " +
        "exactly here — in the faithfulness of small repetitions. Give me tenderness toward my own upkeep, " +
        "the way I would tend a garden I loved. And let the garden grow at garden speed, unbothered by my " +
        "deadlines for it.",
      closing: "In small faithful things, restore me. In slow seasons, keep me. Amen.",
      affirmation: "Small faithful care of myself is sacred work.",
      practiceDuration: 4,
      practiceSteps: [
        "Pick one tiny act of self-maintenance you have been skipping.",
        "Read the prayer, dedicating that act as part of your restoration.",
        "Do the act slowly, without multitasking.",
        "Notice the difference between upkeep and punishment.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-nhs-every-mind-matters"],
      tags: ["self-care", "ritual", "small-things"],
      timeOfDay: "morning",
    },
  ],
  "courage-and-resilience": [
    {
      title: "Steady in the Doorway",
      opening: "Source of strength, who has steadied frightened people since the first morning,",
      body:
        "there is a thing in front of me I would rather walk around. I am not asking you to remove it; I am " +
        "asking you to accompany me through it. Give me a spine for the next hour, a voice that does not " +
        "disappear when I need it, and breath deep enough to carry me across the doorway. Let me remember " +
        "that fear and courage are not opposites — courage is simply fear that has decided to come along. " +
        "Whatever the outcome, let me respect the person who walked in.",
      closing: "I go accompanied. That is the whole of my bravery, and it is enough. Amen.",
      affirmation: "Courage is fear that comes along; I can go accompanied.",
      practiceDuration: 3,
      practiceSteps: [
        "Name the hard thing plainly in one sentence.",
        "Breathe in for four counts, out for six, five times.",
        "Read the prayer standing if you can.",
        "Take the first small action within the hour.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["courage", "fear", "action"],
      timeOfDay: "morning",
    },
    {
      title: "The Long Middle",
      opening: "Enduring One, who is present not only at beginnings and victories,",
      body:
        "bless the long middle of hard things — the ward visits, the forms, the slow legal weeks, the grief " +
        "that outlasts the casseroles. Anyone can be brave for a moment; I am being asked to be faithful for " +
        "a season. Renew me in ways I will actually notice: a good night's sleep, one laugh that surprises me, " +
        "the stranger who is kind for no reason. Keep my heart from going hard while my resolve stays strong. " +
        "Let me bend without breaking, and rest without quitting.",
      closing: "For the distance, give me what the distance requires. Amen.",
      affirmation: "I can do long, hard things one honest day at a time.",
      practiceDuration: 5,
      practiceSteps: [
        "Acknowledge aloud: this is the long middle, and middles are hard.",
        "Name one thing that has renewed you recently, however small.",
        "Read the prayer slowly.",
        "Plan one small renewal for the next twenty-four hours.",
        "Tell one person honestly how you are doing.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["endurance", "resilience", "seasons"],
      timeOfDay: "any",
    },
    {
      title: "Unbroken Is Not the Goal",
      opening: "Mender of what life has cracked,",
      body:
        "I release the demand to come through this unmarked. The world breaks everyone, the old writer said, " +
        "and many are strong at the broken places — but even if I am only tender there, tenderness is not " +
        "failure. Give me resilience that looks like returning: to hope, to people, to the work, after being " +
        "knocked down the honest number of times. Let my scars become places of sympathy rather than shame, " +
        "evidence that I was injured and healed, not that I was weak and hid it.",
      closing: "Make me strong where I am mended, and gentle where I am not yet. Amen.",
      affirmation: "Returning after being knocked down is my resilience.",
      practiceDuration: 6,
      practiceSteps: [
        "Place a hand where you carry tension and breathe into it.",
        "Name one thing that knocked you down — and that you returned from.",
        "Read the prayer without minimising either part.",
        "Offer yourself one sentence of respect, aloud.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["resilience", "healing", "self-respect"],
      timeOfDay: "any",
    },
  ],
  "healing-and-renewal": [
    {
      title: "Companion in the Mending",
      opening: "Source of life, who knows this body better than I do,",
      body:
        "I ask for healing, and I ask honestly, knowing you do not deal in guarantees. Be present in the mending: " +
        "in the medicine and the rest, in the skill of those who care for me, in the slow negotiations of a body " +
        "doing its best. Where cure comes, let me receive it with gratitude. Where it does not, let me never be " +
        "told — by anyone, including myself — that I simply believed wrongly. Give me comfort that does not " +
        "depend on outcomes, and hope that does not require pretending.",
      closing: "In body and spirit, be near. That nearness is my first medicine. Amen.",
      affirmation: "I deserve care; my worth is not measured by my health.",
      practiceDuration: 5,
      practiceSteps: [
        "Sit comfortably and scan the body without judging what you find.",
        "Place a hand where there is pain or weariness, if that helps.",
        "Read the prayer slowly; skip nothing that feels difficult.",
        "Name one thing your care team, body or friend did right this week.",
        "Rest for two minutes before moving on.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-nhs-every-mind-matters"],
      tags: ["healing", "illness", "comfort"],
      timeOfDay: "any",
      safetyNotes:
        "Explicitly rejects cure guarantees and belief-blame; affirms professional care as part of healing.",
    },
    {
      title: "Green After Fire",
      opening: "Renewing One, who brings green shoots from scorched ground,",
      body:
        "something in my life has been burned down — plans, health, certainty, trust. I will not call the ashes " +
        "a blessing; they are ashes. But I have seen what seasons do. I have seen the first impossible green " +
        "pushing through blackened earth, not denying the fire but answering it. Let that be my hope: not " +
        "restoration to exactly what was, but renewal into something alive. Tend in me whatever is still " +
        "capable of growing. Water it with patience. I will not dig it up daily to check on it.",
      closing: "What can still grow in me, grow. What must be grieved, I will grieve. Amen.",
      affirmation: "Renewal does not deny the fire; it answers it.",
      practiceDuration: 6,
      practiceSteps: [
        "Name what burned, plainly and without decorating it.",
        "Name one small green thing — a capacity, a relationship, a morning — that persists.",
        "Read the prayer, holding both names at once.",
        "Do one small thing that waters the green thing today.",
      ],
      traditionLabels: ["original-composition", "symbolic-language"],
      sourceIds: [],
      tags: ["renewal", "hope", "seasons"],
      timeOfDay: "morning",
      seasonalMonths: [3, 4, 5],
    },
    {
      title: "Kindness Toward the Body",
      opening: "Creator, who made this body and called the making good,",
      body:
        "I have spoken to my body in ways I would never speak to a friend. Today I call a truce. This body has " +
        "carried me through everything so far — fevers, grief, long drives, long years. It is not my enemy or " +
        "my ornament; it is my first home. Teach me to feed it, rest it, move it and clothe it with something " +
        "like gratitude. Where it struggles, let me respond with care rather than contempt, and seek good " +
        "help without shame.",
      closing: "Let me live peaceably in the one body I was given. Amen.",
      affirmation: "My body is my first home, and I can treat it kindly.",
      practiceDuration: 4,
      practiceSteps: [
        "Take five breaths, feeling the body doing its quiet work.",
        "Name one thing your body did well today.",
        "Read the prayer as an apology and a thank-you at once.",
        "Choose one kind act for your body today: water, stretch, rest or a real meal.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-nhs-every-mind-matters"],
      tags: ["body", "kindness", "acceptance"],
      timeOfDay: "any",
    },
  ],
  "grief-and-lament": [
    {
      title: "Permission to Mourn",
      opening: "God of the brokenhearted, who keeps count of every tear,",
      body:
        "I bring you the grief I keep being told to be over. It is not over. Love does not evaporate on " +
        "schedule, and neither does sorrow. I do not ask you to explain this loss — explanations are for " +
        "later, or for never. I ask you to sit with me in it, the way the old psalm-singers demanded your " +
        "company in the pit rather than pretending they were not in one. Let my tears be prayers when words " +
        "run out. Let my anger be heard without being corrected. Hold what I cannot hold: the one who is gone, " +
        "and the part of me that went with them.",
      closing: "I am not alone in the pit. Even here, especially here, I am accompanied. Amen.",
      affirmation: "My grief is love with nowhere to go; I am allowed to feel it.",
      practiceDuration: 6,
      practiceSteps: [
        "Find a private place where tears would be safe.",
        "Name the one you are grieving, aloud if you can.",
        "Read the prayer without rushing the angry lines.",
        "Sit quietly for two minutes; let whatever comes, come.",
        "Do one small kind thing for yourself afterward.",
      ],
      traditionLabels: ["original-composition", "historical-teaching", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv", "src-mind"],
      tags: ["grief", "lament", "loss"],
      timeOfDay: "any",
      safetyNotes:
        "Lament without consolation-forcing; encourages accompaniment and self-kindness, and signposts support.",
    },
    {
      title: "The Empty Chair",
      opening: "Faithful One, who receives the ones we can no longer see,",
      body:
        "there is an empty chair at my table and no prayer fills it. I do not ask it to. I ask only that love " +
        "continue where presence cannot — that what was good between us remain good in me, that what was " +
        "unfinished be forgiven in both directions, that what was promised be honoured in how I live. Keep " +
        "their memory from becoming only ache; let it become also gratitude, also story, also the quiet " +
        "strength of having been loved like that at all.",
      closing: "Into your keeping I commend them again today, and my heart with them. Amen.",
      affirmation: "Love outlasts presence; I can carry both the ache and the gift.",
      practiceDuration: 5,
      practiceSteps: [
        "Look at or imagine the place where their absence lives.",
        "Speak their name and one sentence you would want them to hear.",
        "Read the prayer slowly.",
        "Choose one way their memory becomes gratitude this week.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["bereavement", "memory", "love"],
      timeOfDay: "evening",
    },
    {
      title: "How Long",
      opening: "Hearer of the oldest question — how long, O Source, how long —",
      body:
        "the psalm-singers asked it without embarrassment, so I will too. How long will this heaviness sit on " +
        "my chest? How long until mornings stop arriving like verdicts? I do not need the question answered; " +
        "I need it allowed. You are not threatened by my protest, and my protest is not the end of my faith — " +
        "it is one of its oldest forms. So hear me: this hurts, and I am tired, and I am still here. " +
        "Let those three truths keep each other company until something in the season turns.",
      closing: "How long — I do not know. With whom — I do. That must be enough tonight. Amen.",
      affirmation: "Protest is also prayer; I can be honest about how long this takes.",
      practiceDuration: 4,
      practiceSteps: [
        "Name aloud the thing you are tired of enduring.",
        "Read the prayer as permission, not as homework.",
        "Breathe slowly for one minute, not to fix anything, just to be accompanied.",
        "If the weight ever turns toward hopelessness, reach out — a friend, a line like Samaritans, anyone.",
      ],
      traditionLabels: ["original-composition", "historical-teaching"],
      sourceIds: ["src-psalms-nrsv", "src-samaritans"],
      tags: ["lament", "protest", "endurance"],
      timeOfDay: "evening",
      safetyNotes: "Honours protest-lament while including a gentle signpost to human support.",
    },
  ],
  "forgiveness": [
    {
      title: "The Slow Unbinding",
      opening: "Merciful One, who forgives without pretending nothing happened,",
      body:
        "I ask for the grace to forgive — not to excuse, not to forget, not to reopen the door to harm, but to " +
        "stop carrying the debt collector's ledger everywhere I go. What was done was wrong; forgiveness does " +
        "not rewrite that. It simply hands the accounting to wiser hands than mine. Work in me at the speed I " +
        "can bear. Some days I will take the resentment back; let me notice, and set it down again, as many " +
        "times as it takes. Freedom, I am learning, is a practice before it is a feeling.",
      closing: "Unbind me by degrees. I am willing to be made willing. Amen.",
      affirmation: "I can set the debt down without denying the wrong.",
      practiceDuration: 6,
      practiceSteps: [
        "Name the person or event, and the specific cost you still carry.",
        "Read the prayer, pausing at the line about the ledger.",
        "Breathe out long six times, setting the ledger down each time in imagination.",
        "Notice: you have not said it was acceptable. Only that you will stop carrying it.",
        "Repeat tomorrow; forgiveness is a practice.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["forgiveness", "release", "practice"],
      timeOfDay: "any",
      safetyNotes: "Keeps forgiveness distinct from reconciliation and from remaining in harm.",
    },
    {
      title: "Forgiving Myself",
      opening: "Source of mercy, who is kinder to me than I am to myself,",
      body:
        "I have sentenced myself for things I would long ago have pardoned in a friend. I replay the failure, " +
        "rehearse the shame, call the cruelty accountability. Today I ask for a fair trial instead of a endless " +
        "one: let me name what I did, make what amends remain possible, learn what the failure came to teach — " +
        "and then let the sentence end. I cannot become a better person by despising the only self I have to " +
        "work with. Show me the difference between remorse, which repairs, and shame, which only corrodes.",
      closing: "I accept the mercy I would offer anyone I loved. Amen.",
      affirmation: "I can learn from my failure without living inside it.",
      practiceDuration: 5,
      practiceSteps: [
        "Name the thing you cannot forgive yourself for.",
        "Ask: what would I say to a friend who did exactly this?",
        "Read the prayer, receiving the friend's answer as your own.",
        "Name one amend you can still make; schedule it or release it.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["self-forgiveness", "shame", "mercy"],
      timeOfDay: "evening",
    },
    {
      title: "Asking Forgiveness",
      opening: "Righteous and gentle One, who honours truth spoken in humility,",
      body:
        "I harmed someone, and I knew better. Give me the courage for a clean apology — no 'if you were hurt', " +
        "no decorating my intentions, no demanding their forgiveness as the price of my peace. Let me name " +
        "what I did, say plainly that it was wrong, ask what repair would look like, and then respect their " +
        "answer, whatever it is. Their forgiveness is theirs to give. My repentance is mine to live. " +
        "Make me honest enough for the first and patient enough for the second.",
      closing: "Let my apology be a door, not a demand. Amen.",
      affirmation: "I can apologise cleanly and let the rest belong to them.",
      practiceDuration: 5,
      practiceSteps: [
        "Name what you did in one plain sentence without 'but'.",
        "Read the prayer and note what a clean apology must leave out.",
        "Draft the apology in three sentences: what, that it was wrong, what repair you offer.",
        "Deliver it when you can do so without demanding absolution.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: [],
      tags: ["apology", "repentance", "repair"],
      timeOfDay: "any",
    },
  ],
  "love-and-relationships": [
    {
      title: "The Ones Who Hold Me",
      opening: "Source of love, from whom every true affection flows,",
      body:
        "I thank you for the people who hold my life together: the ones who answer at midnight, the ones who " +
        "remember how I take my tea, the ones who tell me the truth kindly. Bless them as they have blessed me. " +
        "Where I have taken them for granted, wake my gratitude. Where I have been half-present, gather me " +
        "back. And make me, in turn, that kind of person for someone — a shelter, a straight answer, a " +
        "door that stays open.",
      closing: "For the loves that hold me: thanks. For the loves I hold: strength. Amen.",
      affirmation: "I am held by love, and I can be that holding for another.",
      practiceDuration: 4,
      practiceSteps: [
        "Bring to mind three people who steady your life.",
        "Read the prayer with their faces in mind.",
        "Send one of them a specific thank-you today.",
        "Notice who you could steady this week, and how.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: [],
      tags: ["gratitude", "friendship", "community"],
      timeOfDay: "any",
    },
    {
      title: "Love Without Grasping",
      opening: "Freeing Love, who holds everything and clutches nothing,",
      body:
        "teach me to love with open hands. Not the anxious love that monitors and manages, not the bargain love " +
        "that keeps receipts — the love that wants the other's flourishing even more than its own comfort. " +
        "Where I have confused love with possession, correct me gently. Where I have been possessed and called " +
        "it devotion, give me words and feet to reclaim myself. Let my loving be wide enough for freedom and " +
        "steady enough for faithfulness, both at once.",
      closing: "Let me love as you love: holding everything, grasping nothing. Amen.",
      affirmation: "Real love makes room for freedom — theirs and mine.",
      practiceDuration: 5,
      practiceSteps: [
        "Name one relationship where you hold on too tightly — or are held too tightly.",
        "Read the prayer, honestly locating yourself in it.",
        "Breathe and open your hands physically as you finish.",
        "Choose one act of non-grasping love — or one honest boundary — for today.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-gospel-of-philip"],
      tags: ["love", "freedom", "attachment"],
      timeOfDay: "any",
      safetyNotes: "Names possessive dynamics without blaming; supports self-reclamation.",
    },
    {
      title: "For a Strained Bond",
      opening: "Maker of reconciliation, who mends what we cannot,",
      body:
        "there is a bond in my life gone quiet or sharp, and I do not know which of us should move first. " +
        "Give me honesty about my part — no more, no less. Give me patience with their timing, and with mine. " +
        "If the door can be reopened, show me the handle. If it cannot, at least for now, give me peace that " +
        "does not depend on the outcome and kindness that does not require contact. Where mending is possible, " +
        "let it begin in me. Where it is not, let me release them to your keeping without hatred.",
      closing: "Hold what we cannot mend, and mend what we cannot hold. Amen.",
      affirmation: "I can tend my side of a bond and entrust the other side.",
      practiceDuration: 6,
      practiceSteps: [
        "Name the person and, honestly, your own part in the strain.",
        "Read the prayer once for them, once for yourself.",
        "Decide: reach out, wait, or release — for now, not forever.",
        "Take the step you chose, or rest in the waiting you chose.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["reconciliation", "estrangement", "patience"],
      timeOfDay: "any",
      safetyNotes: "Explicitly allows that some bonds stay unrepaired for a season; no forced contact.",
    },
  ],
  "purpose-and-calling": [
    {
      title: "The Slow Conversation",
      opening: "Calling One, who speaks through gifts and through the world's needs,",
      body:
        "I keep waiting for my purpose to arrive like a letter, addressed and sealed. Perhaps it comes instead " +
        "as a conversation: what am I good at, what breaks my heart, what does my moment actually require? " +
        "Teach me to listen at that crossroads. Free me from purposes chosen to impress, and from the fear " +
        "that my contribution is too small to matter. A life is not made significant by scale but by " +
        "faithfulness. Show me my corner of the work, and give me the steadiness to work it well.",
      closing: "Let my gifts meet a real need. That meeting is my calling. Amen.",
      affirmation: "My purpose grows where my gifts meet the world's need.",
      practiceDuration: 6,
      practiceSteps: [
        "Name one thing you are reliably good at.",
        "Name one need in the world that genuinely moves you.",
        "Read the prayer, holding those two names together.",
        "Write one sentence describing where they might meet.",
        "Take one small step toward that meeting this week.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["vocation", "gifts", "service"],
      timeOfDay: "morning",
    },
    {
      title: "Faithful in Small Things",
      opening: "Creator, who counts faithfulness heavier than fame,",
      body:
        "deliver me from the exhausting audition for a bigger life. Most of what matters happens at the scale " +
        "I already inhabit: the work done carefully when no one checks, the kindness that will never be posted, " +
        "the promise kept at inconvenience. If a larger calling comes, let it find me already faithful here. " +
        "And if this — this ordinary, unphotographed faithfulness — is the whole shape of my purpose, then " +
        "let me live it so well that it shines like the thing it is.",
      closing: "Here is my field. Here is my flock. Here I will be found faithful. Amen.",
      affirmation: "Ordinary faithfulness is a worthy calling.",
      practiceDuration: 4,
      practiceSteps: [
        "Name one small duty you have been despising.",
        "Read the prayer, reframing it as your current calling.",
        "Do that duty today with unusual care.",
        "Notice whether anything in you settles.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: [],
      tags: ["faithfulness", "ordinary", "humility"],
      timeOfDay: "any",
    },
    {
      title: "At the Crossroads",
      opening: "Guiding Light, who illuminates doors rather than pushing us through them,",
      body:
        "two roads, and both ask for my life. I have prayed for a sign and received only silence, which I am " +
        "learning may itself be an answer: you trust me to choose. So give me the tools of choosers — counsel " +
        "from the wise, honesty about my motives, a trial of the path in imagination at its worst, and the " +
        "courage to commit once I have counted the cost. Where I have been calling indecision 'discernment', " +
        "name it kindly and move me. Where the path can be walked back, free me to risk it.",
      closing: "Bless the choosing, and the chosen road, and the chooser. Amen.",
      affirmation: "I am trusted to choose; I can walk a road wholeheartedly.",
      practiceDuration: 7,
      practiceSteps: [
        "Describe each path in one fair sentence.",
        "Imagine each a year from now, on an ordinary bad day.",
        "Read the prayer.",
        "Ask one wise person who has nothing to gain from your choice.",
        "Set a date to decide — and decide on it.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-gospel-of-thomas"],
      tags: ["decisions", "calling", "courage"],
      timeOfDay: "any",
    },
  ],
  "creativity": [
    {
      title: "Before the Blank Page",
      opening: "First Maker, in whose image all our small makings are done,",
      body:
        "I stand before the blank page, the empty canvas, the silent instrument — and every excuse is louder " +
        "than the call. Quiet the critic who demands brilliance before I have made anything at all. Give me " +
        "the beginner's courage: to make something imperfect on purpose, to let the work teach me what it " +
        "wants to be. You did not create the world in a hurry or in fear. Let a little of that free play " +
        "enter my making today.",
      closing: "Let something exist at day's end that did not exist at dawn — even a rough, honest something. Amen.",
      affirmation: "I am allowed to make imperfect things; beginning is the brave part.",
      practiceDuration: 5,
      practiceSteps: [
        "Open the page, canvas or instrument before reading further.",
        "Read the prayer, then set a timer for ten minutes.",
        "Make badly on purpose until the timer ends.",
        "Keep whatever came without editing it today.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["beginning", "courage", "process"],
      timeOfDay: "morning",
    },
    {
      title: "Through the Block",
      opening: "Patient Source, who is in no hurry for my masterpiece,",
      body:
        "the work has stopped and I have started calling myself names: lazy, finished, found out. I know enough " +
        "to distrust all three. Blocks are not verdicts; they are weather, or messages, or simply rest I " +
        "refused to take arriving anyway. Give me curiosity about this stoppage instead of contempt. What is " +
        "it protecting? What is it waiting for? What would I make if the audience went away? Loosen what is " +
        "knotted in me at the pace kindness works — which is slower than fear and faster than despair.",
      closing: "The well refills in the dark. I will wait, and I will work gently meanwhile. Amen.",
      affirmation: "A block is weather, not a verdict; I can wait it out kindly.",
      practiceDuration: 6,
      practiceSteps: [
        "Name the blocked work without insulting yourself.",
        "Ask the block one curious question; listen for one honest answer.",
        "Read the prayer.",
        "Do fifteen minutes of the work at half speed, or take a real walk instead — both count.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["block", "patience", "self-kindness"],
      timeOfDay: "any",
    },
    {
      title: "The Joy of Making",
      opening: "Delighting Creator, who made more beetles and galaxies than strictly necessary,",
      body:
        "remind me that making is allowed to be play. Somewhere I absorbed the idea that creativity must " +
        "justify itself — in income, in audience, in excellence. But the child I was made things for the " +
        "sheer electricity of making them, and that child was not wrong. Return me to the joy: colour for " +
        "colour's sake, a song sung to the washing-up, a sentence written because it sounded like something. " +
        "Let usefulness catch up later, if it wants to. Today, let me make like the lilies — gloriously, " +
        "unnecessarily, for the joy of the making.",
      closing: "For the gift of making anything at all: thanks. Let me enjoy my portion. Amen.",
      affirmation: "My creativity does not have to pay rent to deserve a place in my life.",
      practiceDuration: 4,
      practiceSteps: [
        "Choose a medium you abandoned for not being 'productive'.",
        "Read the prayer, then play in that medium for twenty minutes.",
        "Show no one; sell nothing; explain nothing.",
        "Mark how you feel afterward, without turning it into a system.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: [],
      tags: ["play", "joy", "freedom"],
      timeOfDay: "any",
    },
  ],
  "gratitude-and-provision": [
    {
      title: "The Givenness of Things",
      opening: "Generous Source, from whom every good thing flows unearned,",
      body:
        "before I ask for anything, let me notice what has already arrived: breath I did not manufacture, " +
        "water I did not invent, people who chose to stay, a mind that can register beauty at all. Gratitude " +
        "is not a trick to attract more; it is simply the truth about how I have been living — on gift, on " +
        "gift, on gift. Let thanks loosen my grip on what I clutch and open my eyes to what I overlooked. " +
        "A grateful heart is not a passive one; it is an accurate one.",
      closing: "For all that has carried me here, mostly unnoticed: thank you. Amen.",
      affirmation: "I live on gifts I did not earn; noticing them is my prayer.",
      practiceDuration: 4,
      practiceSteps: [
        "Name three unearned things that sustained you today.",
        "Read the prayer slowly, letting each example land.",
        "Thank one source directly — a person, the rain, your own lungs.",
        "Carry one of the three into tomorrow as a lens.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["gratitude", "awareness", "gift"],
      timeOfDay: "any",
    },
    {
      title: "Asking for Bread",
      opening: "Provider, who taught us to ask for today's bread and mean it,",
      body:
        "I bring you my needs without decorating them: the bill, the rent, the work that is thinning, the " +
        "cupboard that echoes louder than it should. I am not asking for luxury or for a sign of favour; " +
        "I am asking for enough, and for the wisdom to steward what comes. Keep me from shame — need is not " +
        "failure, and asking is not weakness. Keep me also from panic's bad arithmetic. Open my eyes to the " +
        "help already standing near: the friend, the service, the option I dismissed out of pride.",
      closing: "Give us this day what this day requires — and tomorrow, we will ask again, together. Amen.",
      affirmation: "Needing help is not failure; I can ask honestly and receive gratefully.",
      practiceDuration: 5,
      practiceSteps: [
        "Name your most pressing practical need in one sentence.",
        "Read the prayer without apologising for the need.",
        "Write down one source of help you have not yet asked.",
        "Ask it today — a person, an agency, a service.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["provision", "need", "honesty"],
      timeOfDay: "morning",
      safetyNotes:
        "No prosperity promises; normalises practical help-seeking alongside prayer.",
    },
    {
      title: "Harvest Heart",
      opening: "Lord of the harvest, who ripens things we forgot we planted,",
      body:
        "in this season of gathering, teach me to receive. Some of what sustains me now was sown years ago — " +
        "by my own forgotten faithfulness, by parents and teachers and friends who planted without ever " +
        "seeing the crop. Let me taste the harvest with both hands: gratitude backward for the sowers, " +
        "generosity forward for those still in lean seasons. And where my own fields look thin, give me " +
        "the farmer's long sight: seedtime and harvest, and the patience to be in one without envying " +
        "the other.",
      closing: "For seed and rain and ripening: thanks. Make me a sower for someone else's harvest. Amen.",
      affirmation: "I receive with gratitude and sow for those who come after.",
      practiceDuration: 5,
      practiceSteps: [
        "Name one good thing you are harvesting that you did not plant.",
        "Name one person who planted something in you.",
        "Read the prayer, thanking both directions of time.",
        "Sow one small seed for someone else's future today.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["harvest", "gratitude", "generosity"],
      timeOfDay: "seasonal-aware",
      seasonalMonths: [9, 10, 11],
    },
  ],
  "change-and-transition": [
    {
      title: "Honouring the Ending",
      opening: "Faithful One, present at every closing door,",
      body:
        "something in my life is ending — a role, a home, a season, a version of myself — and the world keeps " +
        "handing me beginnings to celebrate. Not yet. First, let me honour what is finished: thank it for " +
        "what it gave, grieve it for what it took, and name honestly what I will not miss. Endings that are " +
        "skipped do not disappear; they travel with us, unprocessed. So I stop here, at the threshold, and " +
        "look back once with clear eyes. What was, was. I bless it, and I let it be complete.",
      closing: "For what was: thanks and tears. For what comes: I will meet you on the other side of this doorway. Amen.",
      affirmation: "I can mark an ending honestly before I race to a beginning.",
      practiceDuration: 6,
      practiceSteps: [
        "Name what is ending, in the past tense, aloud.",
        "Name one gift it gave and one thing it cost.",
        "Read the prayer at a literal doorway if one is near.",
        "Choose one small ritual of closure this week.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["endings", "threshold", "ritual"],
      timeOfDay: "any",
    },
    {
      title: "The In-Between",
      opening: "Companion of the wilderness, who knows the way through unmarked country,",
      body:
        "the old thing has ended and the new thing has not yet arrived, and I am living in the bare corridor " +
        "between them. I hate it here — the not-knowing, the loose identity, the days without a storyline. " +
        "But the old stories say you do some of your deepest work in exactly this terrain, where nothing " +
        "distracts and everything is stripped to essentials. So meet me in the corridor. Teach me what only " +
        "the in-between can teach: patience, attention, trust without a map. I will not rush the crossing " +
        "just to feel located again.",
      closing: "I am between, but I am not lost. You know this country. Lead on. Amen.",
      affirmation: "The in-between is not empty; it is where I travel lightest.",
      practiceDuration: 5,
      practiceSteps: [
        "Name the two shores: what you left, what you hope for.",
        "Admit plainly: I am not on either shore right now.",
        "Read the prayer, letting the corridor be a place, not a failure.",
        "Do one essential thing well today; let the storyline wait.",
      ],
      traditionLabels: ["original-composition", "symbolic-language"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["liminal", "waiting", "trust"],
      timeOfDay: "any",
    },
    {
      title: "Blessing the Beginning",
      opening: "God of new mornings, who makes a way where there was no way,",
      body:
        "I stand at a beginning — chosen or thrust upon me — with hope and dread mixed in equal parts. Bless " +
        "the first steps: let them be small, honest and taken in good company. Keep me from demanding that " +
        "the new thing immediately feel like home; roots take a season. Where I romanticise what I left, " +
        "correct my memory kindly. Where I catastrophise what I am entering, correct my imagination the same " +
        "way. I do not need to see the whole of this road. I need courage for the mile I can see.",
      closing: "Bless this beginning and the beginner. I go forward in hope, one honest mile at a time. Amen.",
      affirmation: "Beginnings are allowed to feel strange; I give this one a season.",
      practiceDuration: 4,
      practiceSteps: [
        "Name the new thing and your truest feeling about it.",
        "Read the prayer, claiming both hope and dread as normal.",
        "Identify one person who can accompany the first steps; tell them.",
        "Take the smallest first step today.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: [],
      tags: ["beginnings", "hope", "courage"],
      timeOfDay: "morning",
    },
  ],
  "justice-and-ethical-action": [
    {
      title: "Eyes That Cannot Unsee",
      opening: "Just and living One, who hears the cry the powerful ignore,",
      body:
        "I have seen something I cannot unsee — a wrong, an exclusion, a cruelty dressed as policy or habit. " +
        "Do not let me manage my discomfort back into blindness. Give me sight that stays open, and then give " +
        "me the next honest thing to do: the word said in the room where it costs something, the refusal made " +
        "quietly and kept, the help offered without announcement. Keep me from the two ditches — despair that " +
        "does nothing, and righteousness that loves being right more than it loves people.",
      closing: "Make me an instrument of what is right, and keep my heart soft enough to play. Amen.",
      affirmation: "I can see clearly, act honestly, and stay kind.",
      practiceDuration: 5,
      practiceSteps: [
        "Name the wrong you have seen, plainly.",
        "Name the next honest action available to you — small is fine.",
        "Read the prayer; note the two ditches without self-congratulation.",
        "Take the named action within three days.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["justice", "courage", "action"],
      timeOfDay: "any",
    },
    {
      title: "My Own Part",
      opening: "Searchlight of truth, who examines before you judge,",
      body:
        "before I march against the wrong out there, search the wrong in here: the comfort I did not earn, " +
        "the silence that served me, the times I mistook my good intentions for innocence. This is not an " +
        "invitation to self-hatred — contempt never repaired anything. It is an asking for accuracy. " +
        "Let me confess precisely, repair concretely, and change measurably. Then let me work for justice " +
        "as one who also needs mercy, which is the only posture that lasts.",
      closing: "Begin in me what I am asking you to do in the world. Amen.",
      affirmation: "Honest self-examination makes my action in the world cleaner.",
      practiceDuration: 6,
      practiceSteps: [
        "Name one way you benefit from arrangements you criticise.",
        "Read the prayer slowly; do not flinch or wallow.",
        "Choose one concrete repair you can actually make.",
        "Make it, without posting about it.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["confession", "integrity", "humility"],
      timeOfDay: "evening",
    },
    {
      title: "For the Long Work",
      opening: "Steadfast One, whose justice rolls on like a river,",
      body:
        "the work of repair is slow and the news is fast, and I am tempted to either burn out or tune out. " +
        "Teach me the long obedience: showing up after the march, staying after the meeting, giving after " +
        "the emergency fades from the headlines. Surround me with companions for the distance — this work " +
        "was never meant for solo heroes. And when I am weary, remind me that rest is part of the work, " +
        "not a betrayal of it. Rivers do not hurry, and they carve stone.",
      closing: "For the distance: companions, courage and rest. Let the river run. Amen.",
      affirmation: "Slow, accompanied faithfulness outlasts heroic burnout.",
      practiceDuration: 4,
      practiceSteps: [
        "Name the cause that keeps finding you.",
        "Name your companions in it — or your lack of them.",
        "Read the prayer; if companions are lacking, seek one group this week.",
        "Schedule one rest you will take without apologising to the cause.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: [],
      tags: ["perseverance", "community", "rest"],
      timeOfDay: "any",
    },
  ],
  "sleep-and-rest": [
    {
      title: "Laying It Down",
      opening: "Keeper of the night, who watches while we cannot,",
      body:
        "I bring you the unfinished: the email not sent, the conversation not resolved, the worry not solved. " +
        "They will keep until morning — and if they will not, they are still not mine to carry through the " +
        "night. Take the watch. Unclench my jaw, lower my shoulders, slow the committee in my head. Let my " +
        "body do what it was made to do in the dark: repair, release, dream, begin again. I do not have to " +
        "deserve rest. It is given, like breath, like morning.",
      closing: "Into your hands I commit the night, and everything in it I cannot fix. Amen.",
      affirmation: "Rest is given, not earned; I can lay the unfinished down.",
      practiceDuration: 5,
      practiceSteps: [
        "Write tomorrow's worries on paper; close the notebook.",
        "Dim the lights and silence the phone.",
        "Read the prayer lying down, slowly.",
        "Breathe out long, six times, letting the body sink.",
        "Let sleep come without grading how quickly.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-nhs-every-mind-matters"],
      tags: ["sleep", "release", "night"],
      timeOfDay: "evening",
      safetyNotes: "No insomnia-treatment claims; gentle framing only.",
    },
    {
      title: "For the Wakeful Hours",
      opening: "Companion of the sleepless, present at three in the morning,",
      body:
        "the house is asleep and I am not, and the darkness makes every worry louder and every hope less " +
        "plausible. Be with me in the wakeful hours — not to scold me toward sleep, but to keep me company " +
        "while it stays away. Let me treat this night gently: low light, slow breath, no bargaining with the " +
        "clock. If sleep comes, receive my thanks. If it does not, receive my weariness, and carry me kindly " +
        "through tomorrow. And if sleepless nights keep coming, give me the sense to seek good help.",
      closing: "The night is long, but I am not alone in it. Watch with me. Amen.",
      affirmation: "Even awake at three, I am accompanied; this night will pass.",
      practiceDuration: 6,
      practiceSteps: [
        "Turn the clock face away; stop counting lost sleep.",
        "Breathe in for four, out for eight, ten times through.",
        "Read the prayer in a whisper or not at all — knowing it is enough.",
        "Rest in the dark without demanding sleep.",
        "If sleeplessness persists for weeks, consider speaking with a professional — that too is care.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-nhs-every-mind-matters"],
      tags: ["insomnia", "night", "companionship"],
      timeOfDay: "evening",
      safetyNotes: "Signposts professional help for persistent sleeplessness; no treatment claims.",
    },
    {
      title: "The Sabbath Hour",
      opening: "Giver of rest, who blessed the seventh day and called it holy,",
      body:
        "I confess I treat rest as a reward for finishing, and I never finish. So today I take rest the way " +
        "it was given: as a gift with no invoice. For this hour, I stop improving, fixing, earning. The world " +
        "will run without my management — it always secretly has. Let me taste the ancient sanity of stopping: " +
        "a meal eaten slowly, a walk without purpose, a nap without guilt. Teach my nervous system what my " +
        "soul already suspects: I am loved at rest exactly as much as I am loved at work.",
      closing: "This hour is holy because it is useless. Let me waste it beautifully. Amen.",
      affirmation: "I am loved at rest as much as at work.",
      practiceDuration: 8,
      practiceSteps: [
        "Choose your rest hour and defend it in advance.",
        "Put the phone in another room.",
        "Read the prayer, then do one useless, pleasant thing.",
        "Notice the guilt when it visits; greet it and let it pass.",
        "Return slowly; do not sprint back into the to-do list.",
      ],
      traditionLabels: ["original-composition", "historical-teaching", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["sabbath", "rest", "worth"],
      timeOfDay: "any",
    },
  ],
  "morning-orientation": [
    {
      title: "First Direction",
      opening: "Creator of the day, before the day begins to create me,",
      body:
        "let me set my compass while the world is still quiet. Not a to-do list — a direction. Today I choose " +
        "to move toward patience, toward honesty, toward the people who will need me and the work that is " +
        "actually mine. I do not know what this day holds; I only choose the bearing I will hold through it. " +
        "When the noise starts — and it will — bring me back to this quiet minute and the direction I set " +
        "in it.",
      closing: "The day is yours before it is mine. I walk into it pointed toward you. Amen.",
      affirmation: "I set my direction before the world sets it for me.",
      practiceDuration: 3,
      practiceSteps: [
        "Before any screen, stand and face a window or the sky.",
        "Take three full breaths, feet grounded.",
        "Read the prayer, then name your one-word bearing for today.",
        "Return to that word once at midday.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: [],
      tags: ["morning", "intention", "direction"],
      timeOfDay: "morning",
    },
    {
      title: "Grace Before the Flood",
      opening: "Steady One, before the flood of messages and meetings,",
      body:
        "I ask for the day in advance: not that it be easy, but that I be present for it. Give me a long view " +
        "for short fuses, humour for the absurd moments, and one clear eye for what actually matters among the " +
        "hundred things that will claim to. Let me be interruptible by people and uninterruptible by trivia. " +
        "And when tonight comes, let me be able to say: I was there for my own day, awake for my own life.",
      closing: "Ahead of the flood: steadiness. Amid the flood: presence. After the flood: gratitude. Amen.",
      affirmation: "I can be present for my own day, one thing at a time.",
      practiceDuration: 3,
      practiceSteps: [
        "Sit with your first drink of the day, phone face down.",
        "Read the prayer as the drink cools.",
        "Name the one thing that actually matters today.",
        "Begin it before opening messages, if you possibly can.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: [],
      tags: ["morning", "presence", "priorities"],
      timeOfDay: "morning",
    },
    {
      title: "Blessed Already",
      opening: "Source of mornings, who gives the day before we have earned it,",
      body:
        "I woke up today — which means, by the oldest arithmetic, I have already been given more than I can " +
        "repay. Let me live the first hour from that gift instead of from my deficit. The list will say I am " +
        "behind; the light says I am blessed. Let the light win the first hour. I will get to the list — " +
        "I always do — but I refuse to begin a gifted day in debt. Thanks for breath, for shelter, for one " +
        "more chance at the ordinary miraculous.",
      closing: "The day is gift. I begin in thanks, and the rest follows. Amen.",
      affirmation: "I begin this day blessed, not behind.",
      practiceDuration: 3,
      practiceSteps: [
        "On waking, before rising, take three conscious breaths.",
        "Name one gift the morning already contains.",
        "Read the prayer, still unhurried.",
        "Rise and do the first task slowly, as gift rather than debt.",
      ],
      traditionLabels: ["original-composition", "shared-tradition"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["morning", "gratitude", "gift"],
      timeOfDay: "morning",
    },
  ],
  "anxiety-and-overwhelm": [
    {
      title: "One Steady Thing",
      opening: "Peace that passes understanding, I am asking for you by name,",
      body:
        "my mind is a stairwell of echoing alarms. I will not argue with every alarm; I will find one steady " +
        "thing and hold it: this breath, this floor, this moment — which, when I actually inspect it, I am " +
        "surviving. The catastrophe is almost always in the future tense; the breath is always now. Walk me " +
        "back from the future one breath at a time. And when the fear is more than weather — when it is " +
        "climate — give me the courage to bring in help: a doctor, a counsellor, a friend who can sit with me.",
      closing: "Here, now, breathing: I am held. The next moment will introduce itself. Amen.",
      affirmation: "This moment I can meet; I am allowed to ask for help with the rest.",
      practiceDuration: 5,
      practiceSteps: [
        "Name five things you can see, four you can touch, three you can hear.",
        "Breathe in for four, out for six, at least five rounds.",
        "Read the prayer slowly; notice the future tense loosening.",
        "Choose the single next small thing and do only that.",
        "If anxiety is frequent or heavy, consider telling your doctor — that is strength, not failure.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-nhs-every-mind-matters", "src-nhs-breathing-exercises"],
      tags: ["anxiety", "grounding", "breath"],
      timeOfDay: "any",
      safetyNotes:
        "Pairs grounding with explicit, shame-free signposting to professional help; no treatment claims.",
    },
    {
      title: "The Too-Much",
      opening: "Bearing One, who never asked me to carry everything at once,",
      body:
        "it is too much — the list, the news, the needs, the noise — and saying so is not weakness, it is data. " +
        "You never asked me to be infinite; that job is taken. So I bring you the whole crushing pile, not to " +
        "solve it, but to sort it with you: what is truly mine today, what belongs to others, what belongs to " +
        "later, what belongs in the bin. Give me permission for the smallness of one day. Let me do the two " +
        "things that matter and let the rest be unfinished without being unforgiven.",
      closing: "Mine today: a little. Yours always: the rest. I can live with that division of labour. Amen.",
      affirmation: "I was never asked to carry everything; two true things are enough for today.",
      practiceDuration: 6,
      practiceSteps: [
        "Write the whole pile down, every item, without ordering it.",
        "Mark each: mine-today, someone-else's, later, bin.",
        "Read the prayer over the shortened 'mine-today' list.",
        "Do the first two items only; let the rest be unfinished.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-nhs-every-mind-matters"],
      tags: ["overwhelm", "priorities", "permission"],
      timeOfDay: "any",
    },
    {
      title: "Calm in the Body",
      opening: "Gentle Source, who made breath to be an anchor,",
      body:
        "my thoughts are racing, but you also gave me a body, and the body can only live now. Let me come down " +
        "out of the tower of worrying into the ground floor of breathing. Slow the out-breath; soften the belly; " +
        "let the shoulders admit how high they had climbed. I do not need to feel calm to become calmer — " +
        "the body leads and the mind, eventually, follows. Meet me in the slowing. Let each breath be a small " +
        "act of trust that this wave, like every wave before it, knows how to pass.",
      closing: "Breath by breath, I come back to the shore of myself. Amen.",
      affirmation: "My body can lead my mind back to calm, one slow breath at a time.",
      practiceDuration: 4,
      practiceSteps: [
        "Put one hand on your chest and one on your belly.",
        "Breathe so the lower hand moves; the upper one barely does.",
        "Make each out-breath twice as long as the in-breath, ten times.",
        "Read the prayer, then breathe three more rounds before moving.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation"],
      sourceIds: ["src-nhs-breathing-exercises"],
      tags: ["breath", "body", "calm"],
      timeOfDay: "any",
      safetyNotes: "Follows mainstream NHS-style breathing guidance; no medical claims.",
    },
  ],
  "chakra-contemplation": [
    {
      title: "Root to Crown",
      opening: "Source of life, flowing through every level of my being,",
      body:
        "I travel inward today by an old symbolic road — root, sacral, solar, heart, throat, brow, crown — " +
        "not as anatomy and not as dogma, but as a map for attention. At the root, let me feel held. At the " +
        "centres of feeling and will, let me be honest. At the heart, let me be open. At the throat, truthful. " +
        "At the brow, clear. At the crown, quiet. Whatever these centres are — and traditions describe them " +
        "differently — the journey through them is real: from survival to spirit, from ground to sky, " +
        "in one whole, inhabited body.",
      closing: "Rooted below, open above, integrated within — I am one life, whole. Amen.",
      affirmation: "I can inhabit my whole self, from ground to sky.",
      practiceDuration: 8,
      practiceSteps: [
        "Sit tall; rest attention at the base of the spine for three breaths.",
        "Move attention slowly upward through belly, chest, heart, throat, brow, crown — three breaths each.",
        "At each resting place, ask: what is true here today?",
        "Read the prayer as a whole-body blessing.",
        "Rest for two minutes, feeling the body as one field.",
      ],
      traditionLabels: ["modern-interpretation", "symbolic-language", "original-composition"],
      sourceIds: [],
      tags: ["chakra", "body", "symbolic"],
      timeOfDay: "any",
      safetyNotes:
        "Framed explicitly as symbolic/modern contemplative practice — no energetic or medical claims.",
    },
    {
      title: "The Heart Centre",
      opening: "Love at the centre of all centres,",
      body:
        "whatever else the old maps mean, every tradition agrees there is a centre in us where love lives or " +
        "hides. I rest my attention there today — in the middle of the chest, where grief sits and joy sparks " +
        "and the ribs do their quiet work. Let this centre soften without breaking, open without emptying. " +
        "If it is armoured, let the armour be honoured for protecting me once, and loosened for costing me now. " +
        "From this centre, send one honest warmth outward: to myself, to one person, to the world that needs it.",
      closing: "At the centre: love. From the centre: love. That is the whole practice. Amen.",
      affirmation: "My heart can soften safely, a little at a time.",
      practiceDuration: 5,
      practiceSteps: [
        "Place a hand over the centre of your chest.",
        "Breathe gently, feeling the hand rise and fall, for ten breaths.",
        "Read the prayer with attention resting under the hand.",
        "Send one silent sentence of goodwill to yourself and one to another.",
      ],
      traditionLabels: ["modern-interpretation", "symbolic-language", "original-composition"],
      sourceIds: [],
      tags: ["heart", "love", "softening"],
      timeOfDay: "any",
    },
    {
      title: "Grounded Before High",
      opening: "Ground of being, before any ascent,",
      body:
        "the symbolic road upward only makes sense from a firm root. So before I reach for the crown, I honour " +
        "the base: my safety, my food, my shelter, my right to be here at all. Spiritual practice that skips " +
        "the root becomes escape; practice that honours it becomes incarnation. Let me be fully here — fed, " +
        "grounded, ordinary — and only then reach upward. The tree agrees: height is just depth, reversed " +
        "and patient.",
      closing: "Deeply rooted, honestly present — from here, any rising is real. Amen.",
      affirmation: "I reach upward only as far as I am rooted downward.",
      practiceDuration: 5,
      practiceSteps: [
        "Stand barefoot if you can; feel the floor for one minute.",
        "Name three basic securities you have today.",
        "Read the prayer, feet still grounded.",
        "Only then look up — and take the day one level at a time.",
      ],
      traditionLabels: ["modern-interpretation", "symbolic-language", "original-composition"],
      sourceIds: [],
      tags: ["root", "grounding", "balance"],
      timeOfDay: "morning",
    },
  ],
  "cosmic-and-planetary-reflection": [
    {
      title: "Under the Stars",
      opening: "Maker of the deep sky, in whose presence the galaxies are young,",
      body:
        "I stand under a sky that does not know my name and somehow does not need to. The ancient teachers " +
        "imagined ordered spheres; the modern ones measure expanding dark — and both leave me in the same " +
        "place: small, brief, and astonished. Let smallness comfort me instead of crushing me. My worries are " +
        "real, but they are not cosmic. My life is brief, but it is genuinely here — a few decades in which " +
        "the universe gets to look at itself through my eyes. Let me look back with love.",
      closing: "To the Source beyond the stars and the spark within me: one prayer, one light. Amen.",
      affirmation: "I am small, brief, and astonished — and that is a form of belonging.",
      practiceDuration: 6,
      practiceSteps: [
        "If it is dark, look at the sky for one minute; if not, imagine it.",
        "Name one worry and watch it shrink to true size.",
        "Read the prayer slowly.",
        "Name one thing you are glad your brief life gets to witness.",
      ],
      traditionLabels: ["original-composition", "symbolic-language", "modern-interpretation"],
      sourceIds: ["src-apocryphon-of-john", "src-jonas-gnostic-religion"],
      tags: ["cosmos", "perspective", "awe"],
      timeOfDay: "evening",
    },
    {
      title: "The Living Earth",
      opening: "Source of all life, breathing through soil and sea and species,",
      body:
        "let me feel, for one unhurried minute, that the ground under me is alive and I am part of its " +
        "breathing. The old cosmologies sang of a living order; the new sciences measure one — atmosphere, " +
        "current, mycorrhizal web. Either way, I am not on the Earth so much as of it. Wake my gratitude " +
        "into responsibility: what I am of, I am for. Show me one faithful thing to do for the living world — " +
        "not despair at its wounds, not denial of them, but my one honest share of the care.",
      closing: "Of the Earth, for the Earth, with all that breathes: I belong, and I am responsible. Amen.",
      affirmation: "I belong to a living world, and my care is part of its healing.",
      practiceDuration: 5,
      practiceSteps: [
        "Touch something living or once-living: soil, leaf, wood, your own pulse.",
        "Read the prayer at walking pace.",
        "Name one wound of the world you refuse to look away from.",
        "Choose one concrete act of care for this week.",
      ],
      traditionLabels: ["original-composition", "modern-interpretation", "symbolic-language"],
      sourceIds: ["src-hermetica-copenhaver"],
      tags: ["earth", "ecology", "responsibility"],
      timeOfDay: "any",
    },
    {
      title: "Winter Stars",
      opening: "Light in the longest dark, whom the winter sky shows most clearly,",
      body:
        "in the cold months the stars come closer, and the dark I feared turns out to be full of them. " +
        "So it is in the winters of a life: when the leaves of busyness fall, the far lights appear — the " +
        "constants, the faithful, the loves that stay. Teach me winter's austere astronomy: to navigate " +
        "by fewer, truer lights; to let the long night do its clarifying work; to trust that the wheel " +
        "still turns, the tilt still leans back toward spring. I will not wish the cold away. I will " +
        "learn its sky.",
      closing: "In the longest dark, the clearest light. I am watching, and I can wait. Amen.",
      affirmation: "Winter clarifies; I can navigate by fewer, truer lights.",
      practiceDuration: 6,
      practiceSteps: [
        "Wrap up warm and step into the cold for one minute, or imagine it.",
        "Name the 'winter' you are in, if you are in one.",
        "Read the prayer; name one far, faithful light.",
        "Come back inside slowly, keeping the sky in mind.",
      ],
      traditionLabels: ["original-composition", "symbolic-language"],
      sourceIds: ["src-psalms-nrsv"],
      tags: ["winter", "seasons", "hope"],
      timeOfDay: "evening",
      seasonalMonths: [11, 12, 1, 2],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Assembly: ids, content, reflection prompt links, validation        */
/* ------------------------------------------------------------------ */

function buildPrayers(): Prayer[] {
  const prayers: Prayer[] = [];
  for (const [categoryId, defs] of Object.entries(DEFS)) {
    defs.forEach((def, index) => {
      const n = index + 1;
      const promptA = `prm-${categoryId}-${String((n - 1) % 4 + 1).padStart(2, "0")}`;
      const promptB = `prm-${categoryId}-${String(n % 4 + 1).padStart(2, "0")}`;
      const record: Record<string, unknown> = {
        id: `pry-${categoryId}-${String(n).padStart(2, "0")}`,
        title: def.title,
        categoryIds: expandCorpusCategoryIds([categoryId]),
        traditionLabels: def.traditionLabels,
        content: [def.opening, def.body, def.closing].join("\n\n"),
        opening: def.opening,
        body: def.body,
        closing: def.closing,
        affirmation: def.affirmation,
        practiceDuration: def.practiceDuration,
        practiceSteps: def.practiceSteps,
        reflectionPromptIds: [promptA, promptB],
        sourceIds: def.sourceIds,
        sourceUses: def.sourceUses,
        audioIds: [],
        tags: def.tags,
        timeOfDay: def.timeOfDay,
        editorialStatus: "draft",
        safetyNotes: def.safetyNotes ?? "",
      };
      if (def.seasonalMonths !== undefined) {
        record.seasonalMonths = def.seasonalMonths;
      }
      prayers.push(PrayerSchema.parse(record));
    });
  }
  return [
    ...prayers,
    ...corpusSeedPrayers.map((prayer) =>
      PrayerSchema.parse({
        ...prayer,
        categoryIds: expandCorpusCategoryIds(prayer.categoryIds),
      }),
    ),
  ];
}

// Validated at module load — a malformed prayer fails the build/tests.
export const prayers: Prayer[] = buildPrayers();

export const prayerById = new Map(prayers.map((prayer) => [prayer.id, prayer]));
