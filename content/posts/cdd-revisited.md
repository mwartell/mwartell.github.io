---
title: "collaborative development docs revisited"
subtitle: "the art of thinking with an agent"
date: 2026-03-11
tags: ["agentic development"]
draft: false
---

In January I wrote about [Collaborative Development Documentation](/posts/collaborative-development-docs/) — a structured way to capture the back-and-forth of human-AI technical work. Since then I've written about twenty CDDs across a real project, and the practice has evolved considerably. The structural ideas from that first post still hold, but the interesting part turned out to be something I barely mentioned: *how you think* when you're writing the prompts.

## what a CDD actually looks like in practice

The bones are the same: a markdown file with YAML frontmatter, organized as numbered Prompt/Response pairs. But the frontmatter has simplified. Here's a typical header:

```yaml
---
date: 2026-02-18
title: fixing field mismatches
current_head: a1b2c3d
agent: Copilot Claude Sonnet 4.5
session_type:
instructions: _cdd-instructions.md
topics: [cip, schema, pydantic]
---
```

The `instructions` field points to a shared file that tells the agent how to format responses — where to put the Response header, how to confirm it read the instructions. This keeps the CDD itself clean. The `current_head` anchors the session to a specific point in the codebase, so you can reconstruct what the agent was looking at.

I also built two VS Code prompt files to reduce friction:

- **cdd-start.prompt.md** scaffolds a new CDD — it creates the file with proper frontmatter, names it by date and topic, and drops in a placeholder for the first prompt. One command to start a new session.
- **cdd.prompt.md** dispatches to a specific prompt number in an existing CDD. When I type `/cdd 3`, the agent reads the instructions file, finds Prompt 3, and executes it. The CDD becomes a script I can run step by step.

This matters because it collapses the ceremony. Starting a collaborative session is as easy as starting a conversation.

## the real subject: how to think in prompts

The structure was always just scaffolding. What I actually learned over twenty sessions is a set of thinking habits for writing effective prompts. These aren't about prompt engineering tricks — they're about the quality of thought you bring to the collaboration.

### give context before asking questions

The single most consistent pattern across every effective CDD prompt: provide the situation *first*, then ask the question. Not "fix this bug" but:

> While creating and testing the backwards ingestion module, we found surprising mismatches between the generated models and the authoritative schema. Here are the mismatches: [table]. Look at the mismatches and determine where in the process the differences were introduced.

The context does three things: it limits the search space, it gives the agent your mental model, and it tells the agent what you already know so it doesn't waste time explaining it back to you.

### anchor on authoritative sources

Early in my CDD practice I would ask things like "is X correct?" and get plausible-sounding answers that were sometimes wrong. The fix was to stop asking for opinions and start asking for evidence:

> The tdata files and the ogma files were created independently by two different engineers working from the same T-MSIS spec. Gather ALL INFORMATION YOU CAN to support or reject that the sign indicator is needed. I need evidence from the T-MSIS spec itself.

This transforms the agent from an answerer into a researcher. When the spec says the field is 13 positions, not 14, that's not an opinion — it's a fact you can build on. The agent found definitive proof that one implementation was wrong, not by reasoning about it but by reading the specification.

Anchor on specs, schemas, and other authoritative artifacts. Make the agent show its work.

### constrain scope explicitly

I documented seven categories of agent failure early on — duplicate work, unnecessary changes, incomplete analysis, introduced bugs, destructive actions. The common thread: the agent did more than was asked.

The defense is explicit constraints:

- "This program should stop if it hits 10 invalid files."
- "Minimize query summaries. Drop the statistical queries entirely."
- "No changes except field names."

Without these, agents optimize for appearing helpful, which often means doing too much. A good prompt is like a good function signature: it specifies what's in scope and what isn't.

### build on prior work explicitly

CDDs are sequential documents, but agents don't automatically carry forward the full context of previous responses. When your next prompt depends on earlier work, say so:

> In the course of working CDD 2026-02-09-datarules-subagent.md and 2026-02-09-fact-sales-daily-float-evaluation.md, you generated a set of query evaluations. Start from that set.

> We now have ingested the sample data from Response 2. The nuna_rules/RULE_1_v001.java looks for agreement between fields...

This creates a traceable chain. Anyone reading the CDD later can follow the thread. And the agent knows exactly what prior state to build from rather than guessing.

### ask the agent to show its work

One of the most productive prompt patterns I discovered was asking the agent *how* it did something, not just *what* it did:

> You seemed to have added Response 2 without problems. Tell me what mechanism you used and if you think the additional guidance helped.

This catches the difference between an agent that understands a solution and one that got lucky. It also produces documentation of the method, which is useful when the same pattern needs to be repeated.

### iterate toward simplicity

My best sessions follow a four-beat pattern: ask for a solution, examine it, ask for simplification, verify. One session went:

1. Generated ~70 lines of technical guidance
2. "The guidance is awfully verbose. Make it fit your needs."
3. Condensed to ~25 lines
4. "The dependence on Tagalog text shouldn't be necessary. Update accordingly."

Each step applies pressure that tests real understanding. An agent that can simplify its own output without losing correctness actually understands the problem. Conciseness is a test of comprehension.

### document the fork points

When a situation has multiple valid interpretations, don't pick one and hope — lay them out:

> Either: (1) The S9 fields should actually be unsigned 9 fields and the schema is wrong, OR (2) The sign indicator is needed and the test data is wrong. Gather evidence.

This prevents the agent from silently choosing an interpretation and building on a possibly wrong assumption. It also documents your thinking for anyone who reads the CDD later.

## what emerged over twenty sessions

Looking across the corpus, I can see a clear arc. Early sessions were exploratory: "evaluate these rules," "what does this data mean?" The prompts were broad and the agents would sometimes wander.

By the middle sessions, prompts became specification-anchored: "validate this schema against the authoritative data elements CSV." Every claim had to be grounded in a concrete artifact.

By the late sessions, the prompts were building *reproducible processes*: "create a detailed prompt for regenerating Pydantic models from the schema, then use your subagent tool to execute it." The human was teaching the agent a methodology, not solving a one-off problem.

The pattern: **discovery → specification → automation**. Each phase's CDDs built explicitly on the previous phase's findings. The documents weren't just records — they were the connective tissue of the project.

## the meta-lesson

The original CDD post focused on the *what*: frontmatter, prompt-response structure, cross-session references. The practice taught me the *how*: think before you prompt. Provide context. Anchor on facts. Constrain scope. Build chains. Ask for evidence, not opinions. Iterate toward clarity.

These are thinking habits, not formatting rules. They work because they force the human side of the collaboration to be precise — which, more than any structural innovation, is what makes the agent side useful.
