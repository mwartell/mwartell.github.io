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

# Prompt 3: explaining wheeler

I think I may be misinterpreting "All problems in computer science..." I've viewed it as a caution but you didn't. Please explain it especially in the context of Henney's corollary.

# Response 3: Wheeler is a prescription; Henney supplies the caution

The Wheeler statement is a genuine problem-solving prescription, not a caution. The caution only arrives with Henney's corollary, which turns the whole into a self-referential dialectic. Together they say: indirection is the master key of software design — and the master key is also the lock. Response 2's essay was, in retrospect, too quick to dismiss Wheeler's original clause.

## Wheeler's original claim

> All problems in computer science can be solved by another level of indirection.

Read in isolation, this is *positive* and *prescriptive*. Wheeler was making a substantive engineering claim: whatever is giving you trouble — a mismatch between interfaces, a need to defer binding, a dependency you want to invert — you can get out of it by placing a layer between the two things. This is the insight behind nearly every useful abstraction in computing: virtual machines, file systems, DNS, HTTP, object-oriented dispatch, REST APIs, dependency injection containers. All of them are, at root, a layer of indirection someone inserted between two things that could not otherwise speak to each other.

The statement is not ironic. Wheeler is not winking. He is passing on a tradesman's principle: *when you are stuck, add a layer*.

## Why you heard it as a caution

There are two reasons the quote gets received as cautionary.

First, it is almost always quoted *with* the corollary appended, and the corollary is a caution. The brain conflates the two. When you read the full combined statement, the corollary — which is funny, self-deflating, and memorable — tends to color the entire reading backward, so that the original clause sounds like a setup for the joke rather than independent wisdom.

Second, the statement is so sweeping ("all problems") that it reads as hyperbolic, and hyperbole invites ironic reading. Anyone with engineering experience squints at "all problems" and thinks of the exceptions. But Wheeler's claim is defensible if you take "level of indirection" broadly enough: you can always introduce a translation layer, a protocol, an abstraction, a name. The question is whether you *should*, which is precisely what the corollary addresses.

## The corollary completes the picture

> …except for the problem of too many levels of indirection.

This is where the caution lives, and it is doing a specific thing: it makes the combined statement *self-referential*. The cure creates a new disease. Indirection solves problems — and the proliferation of indirection is itself a problem that cannot be solved by adding more indirection; it can only be solved by removal.

Notice the asymmetry: Wheeler's clause is about solving problems. Henney's corollary is about a category of problem that the solution mechanism *generates*. They are not symmetrical opposites; they are sequential steps in a failure mode. You apply the prescription, it works; you apply it again, it works again; you apply it until the system has accumulated so many layers that no one can reason about it — and now the architecture *is* the problem.

## What this means for the essay

Response 2 called Wheeler's statement "technically correct and practically useless," which undersells it. The original clause is genuinely useful practical wisdom. What is "practically useless" (or rather, what is misleading if followed mechanically) is the prescription *without* the corollary — Wheeler's rule as a license to keep adding layers without limit.

The Saint-Exupéry quote and the combined Wheeler-Henney statement point in the same direction: toward restraint. But they arrive there differently. Saint-Exupéry argues from perfection — strip until nothing remains to strip. Wheeler-Henney argues from pathology — the tool that fixes everything eventually breaks everything. For a junior engineer, the latter is probably the more useful framing: it validates that indirection *works* (so they trust their instinct to reach for it) while naming the failure mode that it creates (so they know when to stop).

# Prompt 4: rewrite with a concentration on Henney

I'm not concerned with the validity of Wheeler's statement. I want the essay to concentrate on the caution of Henney whereby the addition of indirection is a seductive choice but that the complexity it adds is often deleterious to the architecture.

In particular I want to criticize a temptation of excessive microservices where engineers just add another container or functional group to patch over a structural issue which often just makes the problem harder. If you can find another well known quote from systems architecture (Fred Brooks, perhaps) to support a principal of design austerity that would help.

# Response 4: rewritten essay foregrounding Henney and microservices

Rewrote [content/posts/less-is-more.md](content/posts/less-is-more.md) to centre Henney's corollary as the primary thesis and redirect the microservices section to name the specific failure mode: using a new service to patch a structural problem. Added Fred Brooks's remark on conceptual integrity from *The Mythical Man-Month* as the third pillar alongside Saint-Exupéry and Henney. The Saint-Exupéry and PEP 20 material is retained as supporting texture rather than framing.

## Brooks quote used

From *The Mythical Man-Month*, Chapter 4 ("Aristocracy, Democracy, and System Design"):

> It is better to have a system omit certain anomalous features and improvements, but to reflect one set of design ideas, than to have one that contains many good but independent and uncoordinated ideas.

#
