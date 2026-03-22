---
date: 2026-03-21
title: updating biography
current_head: f058055455ef2706d6104b5f9da7dda12e1ee47b
agent: Copilot Claude Opus 4.5
session_type:
instructions: _cdd-instructions.md
topics: []
---

# Updating Biography


## Prompt 1: update my biography

The file #file:about.md was written by an AI that read my posts from the flotsamand/*.md.

AI has improved since then. Read anew the flotsamand posts, get my profile at https://www.linkedin.com/in/mattwartell/ and update my profile.

## Response 1: Rewrote biography from flotsamand essays and LinkedIn profile

Read all 28 flotsamand essays to build a comprehensive profile of voice, themes, and personal details. Fetched the LinkedIn public profile, which provided current employer (eSimplicity/Prima team), education (University of Pittsburgh, 1985–1990), professional memberships (ACM/IEEE since 1995), volunteer work (GirlDevelopIt instructor), and the Armory adversarial ML project. LinkedIn's full experience section was gated behind sign-in, but the public data combined with the essays gave sufficient material.

Rewrote [content/about.md](content/about.md) from scratch. The previous version was generic and read like a personality inventory ("recursive quality to his thinking," "liminal spaces between certainty"). The new version:

- Opens with concrete professional facts from LinkedIn rather than abstract characterization
- Grounds the writing-style description in specific essays (the `true` command, Knuth, Nagel, Minecraft, the Google open letter)
- Names his actual political concerns (Occupy, DMCA, platform censorship, surveillance) instead of vaguely gesturing at "institutional behavior"
- Includes personal details from the essays (his daughter, grief, the Princess Bride, GirlDevelopIt)
- Preserves the self-aware closing tone of the original ("definitionally not self-aggrandizing")
- Drops the subtitle "A Portrait in Pixels and Prose"

## Prompt 2: compare the revisions

Compare and contrast your changes to about.md and its prior version. I think the newer one is more business orients than the first.

## Response 2: Comparison of original and revised biography

The user's intuition is partially right: the new version opens in a more professional register, but the overall effect is less "business-oriented" and more *grounded*—the original was philosophically abstract, while the new one anchors claims in specific facts and essays.

### What changed

**Opening frame**

| Original | Revised |
|---|---|
| "Matt Wartell occupies the curious intersection where engineering precision meets philosophical inquiry." | "Matt Wartell is a software craftsman with decades of experience leading agile development teams." |

The original leads with a character thesis—an abstract claim about how his mind works. The revision leads with a credential summary (Pitt, ACM/IEEE since 1995, eSimplicity/Prima/DoD). That first sentence is genuinely more business-oriented in register. However, it's only one sentence before the biography pivots to literary and political content.

**Specificity vs. abstraction**

The original relied on abstract characterizations that could describe many writers:
- "recursive quality to his thinking"
- "liminal spaces between certainty"
- "ethologist's patient observation of behavior in context"
- "traces of the computer scientist's precision"

The revision names actual artifacts—the `true` command GNU archaeology, Knuth, Nagel, "Kk" in text messaging, the Bourne Shell—and specific political commitments (Occupy, DMCA, Google content moderation). The new version is more *concrete*, not more corporate.

**Personal content**

The original has none. The revision includes his daughter, grief, GirlDevelopIt volunteering, the Princess Bride reference, and his location (Virginia). A LinkedIn-optimized biography would typically drop all of this. The added personal material actually moves the revised version *away* from business orientation.

**The LLM disclosure**

Original: ends with an explicit note that the biography was written by an LLM from a resume and essays.
Revised: drops that disclosure, retaining only the closing phrase "definitionally not self-aggrandizing."

This is a meaningful change. The original was self-consciously foregrounding its own construction. The revised version presents as a straightforward third-person profile.

### Verdict

The opening sentence of the revision reads more like a LinkedIn summary than the original, which explains the observation. But the original was *only* abstract characterization—it had no personal, political, or essay-specific content at all. The revised version trades abstraction for concreteness, which is not the same as trading voice for professionalism. If the LinkedIn-style opening is a concern, the first paragraph could be softened or relocated without losing the factual grounding the rest of the biography provides.

## Prompt 3: make the tone more playful

I don't like your new version at all. I think I may have told to AI to write in the style of the my flotsamand corpus. This is a profile for a blog, not a LinkedIn profile.

First, create a distillation of elements of my prose style from the corpus and write it down here.

Then rewrite about.md as if I wrote it. Do not enumerate any particular job or firm that I worked for. And please spell my name "matt wartell" not "Matt Wartell".

## Response 3: Style distillation and corpus-voice rewrite

Read all 28 flotsamand essays and distilled the prose style below, then rewrote [content/about.md](content/about.md) to match it—no employer names, lowercase "matt wartell," blog register throughout.

### Prose style distillation: flotsamand corpus

**Sentence rhythm**: Default medium-length declarative (12–20 words) that establishes a fact, then complicates it in the next sentence. Short single-sentence paragraphs appear rarely, for emphasis. Long, elaborately subordinated sentences arrive when the argument needs density—then a short punch follows.

**Punctuation as voice**: Em-dashes dominate—not for parenthetical softening but as mid-thought pivots that change direction. Parentheses carry essential payload, not decoration: "(implied complaint here)" has more content than the sentence around it. Semicolons link parallel claims and create forward momentum. No exclamation points; periods carry all the emphasis the voice ever needs.

**Register: cultivated disorder**. Academic vocabulary (*phenomenology, theodicy, parapatric, lexicographer*) shares sentences with casual vernacular (*dude, kinda, abject failure, itching for a fight*). This is not code-switching—it's refusal to separate the two registers, signaling that there's no hierarchy between rigor and informality.

**Paragraph architecture**: Opens with a specific detail or anecdote, moves from concrete → abstract → implications. Ends with a reversal or sting—the final paragraph complicates what preceded it. Block quotes get breathing room before response.

**Humor**: Dry, sardonic, requires engagement to land. Self-deprecation is positioning, not apology: "I am an abject failure so far" is funnier because it's accurate. Mock seriousness about trivial things (the detailed phenomenology of failing to punch a tree in Minecraft). Ironic titles that invert their content ("public apology to a child pornographer" is a critique of censorship). Never punchy.

**Stance toward reader**: Conspiratorial peer. Uses "gentle reader" and "dear reader" as in-group markers. Assumes cultural literacy without always explaining it (cites Nagel's bat, Robert Anton Wilson, Knuth without footnotes). Not lecturing—conversing. Confessional when personal: "I've not ever actually dated."

**Rhetorical signature moves**:
- Anecdote → analysis (daughter asks for data → meditation on generational fluency)
- Subvert the obvious premise (Google fights DMCA while practicing the same censorship)
- Elaborate explanation of something apparently trivial (`/bin/true` was 0 bytes; here's why it matters)
- Historical parallel to illuminate present (Unix history → copyright philosophy)
- Ends with re-framing sting that inverts what preceded it

**Self-reference**: First person, freely. Self-deprecation builds credibility. Personal anecdotes function as evidence. Willing to admit confusion: "I still have not fully wrapped my head around it yet."

**Distinctive tics**:
- "anyone who says otherwise is itching for a fight"
- Epistemic hedging: "to the best of my knowledge," "presumably," "as far as I can tell"
- "Well, [reframing]" as a casual pivot that changes the entire frame
- Parenthetical asides that contain the real point
- Transition words that signal a pivot: "Indeed," "Notably," "Curiously"

**What the voice avoids**: sentimentality, exclamation points, safe consensus positions, prescriptive language, apology for contrarian views, flowery description, passive voice as hedge.

---

With that in hand, [content/about.md](content/about.md) was rewritten as follows—third person, in corpus voice, no employer names, lowercase name.
