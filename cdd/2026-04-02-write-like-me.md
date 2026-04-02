---
date: 2026-04-02
title: write like me
current_head: f87c91f
agent: "GitHub Copilot"
session_type:
topics: []
---

# Prompt 1: summarize flotsamand style

Read through the documents in flotsamand/ and create a summary of my prose style in flotsamand/style.md that tells an agent how to replicate my writing for other texts. It should be highly detailed and look at word choice, sentence construction, and connections between ideas and paragraphs.

The resulting style.md should allow AI to emulate my style for new writing.

# Response 1: detailed prose style guide created

Read all 27 essays in `flotsamand/` and analyzed voice, sentence construction, word choice, argument structure, tone, rhetorical devices, and formatting patterns. Created [flotsamand/style.md](../flotsamand/style.md) as a comprehensive style guide organized into actionable sections that an agent can follow to emulate the writing. Next steps: test the guide by using it to draft a new piece and iterate on any gaps.

The guide covers:
- **Voice and persona**: first-person, erudite-but-conversational, self-deprecating, Victorian reader address
- **Sentence construction**: long clause-heavy sentences with heavy semicolon use, periodic structures, short sentences reserved for impact, constant parenthetical asides
- **Word choice**: mixed high/low register (Latinate vocabulary alongside colloquialisms), archaic phrasing ("Contrariwise", "whilst", "gentle reader"), precise technical terms glossed in plain language, favorite connectives ("indeed", "unfortunately")
- **Paragraph and argument structure**: open with concrete particulars, spiral outward to general/philosophical, associative transitions, extended analogies from science/tech/history, end with pointed closing lines
- **Tone**: sardonic irony as delivery mechanism for sincere conviction, anti-authoritarian, self-aware about limitations, Swiftian satire by inhabiting the opposing position
- **Rhetorical devices**: rhetorical questions answered with deflation, understatement-then-escalation, juxtaposition of registers, quotation as argument, postscripts that complicate the main text
- **What to avoid**: flat neutral register, mechanical transitions, explaining jokes, corporate hedging, defaulting to short simple sentences

# Prompt 2: using the style to write

There are two maxims from design that have long guided my thinking about software architecture:

> Perfection is attained not when there is nothing more to add but when there is nothing more to remove

> Every software problem can be solved by adding another layer of indirection

These are paraphrases from memory, please get the original quotes and attribution.

Then write an essay for a junior colleague in my software team to help them understand why simple is better than complex. You should read https://peps.python.org/pep-0020/ which is the source of "simple is better than complex"

# Response 2: original attributions and essay drafted

Identified the two original quotations and their sources. Wrote an essay in the flotsamand voice (guided by [flotsamand/style.md](../flotsamand/style.md)) addressed to a junior colleague on why simplicity is the harder, better discipline. The essay uses PEP 20 as its anchor and the two design maxims as structural pillars.

## Original Quotations

**Quote 1** — Antoine de Saint-Exupéry, *Terre des hommes* (1939), published in English as *Wind, Sand and Stars*:

> Il semble que la perfection soit atteinte non quand il n'y a plus rien à ajouter, mais quand il n'y a plus rien à retrancher.

("It seems that perfection is attained, not when there is nothing more to add, but when there is nothing more to take away.")

**Quote 2** — David Wheeler, widely attributed, often with the corollary appended by Kevin Henney:

> All problems in computer science can be solved by another level of indirection, except for the problem of too many levels of indirection.

Butler Lampson is sometimes credited as the originator; Wheeler is the more commonly cited source and the one who appended the self-referential caveat.

The essay is in [content/posts/less-is-more.md](content/posts/less-is-more.md)
