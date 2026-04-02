---
title: on the virtues of less
date: 2026-04-02
draft: true
---


I was staring at a pull request the other day — forty-seven files changed, a new abstraction layer, a new container where previously there had been none, and all the associated container build and run mechanisms. The commit message said "refactor for extensibility". I sat with it for a while, and eventually wrote a two-word review: "but why?"

This is not a story about that particular pull request, which was resolved amicably; it is about the instinct that produced it. The instinct is natural, nearly universal among people who write software, and almost always wrong: when something is hard, add more stuff.

There is an line from the world of aircraft design by Antoine de Saint-Exupéry — a writer and pilot, from his 1939 book *Terre des hommes*:

> It seems that perfection is attained not when there is nothing left to add, but when there is nothing left to take away.

Saint-Exupéry was talking about airplanes, which is to say he was talking about machines that kill you if they are poorly designed. Software does not usually kill anyone (though it has, and the instances are instructive), but the principle transfers with uncomfortable precision. The perfect system is not the one with the most features or the cleverest abstractions; it is the one from which you can remove nothing without breaking it.

Contrariwise, there is a maxim from computer science, attributed to David Wheeler of Cambridge, which states:

> All problems in computer science can be solved by another level of indirection.

This is true, in the same way that it is true that all problems of personal finance can be solved by acquiring more money. The statement is technically correct and practically useless because Wheeler himself — or possibly Kevin Henney, the provenance is murky — appended the necessary corollary: "except for the problem of too many levels of indirection." And too many levels of indirection is, in my experience, the single most common disease of software that has been worked on by more than one person for more than one year.

So: two maxims, pointing in opposite directions, both true. This is the tension you will live inside for your entire career.

### the zen of the thing

In 1999, Tim Peters distilled the design philosophy of the Python programming language into nineteen aphorisms (with a twentieth left deliberately blank, which is itself a statement). You can summon them at any Python prompt by typing `import this`, which is a lovely bit of self-reference. Among them:

> Simple is better than complex.
> Complex is better than complicated.
> Flat is better than nested.

Note the structure. Peters does not say "simple is good" — that would be a bumper sticker. He says simple is *better than* complex, which implies that complex is sometimes necessary but that you should prefer the simpler alternative when one exists. And then he immediately concedes that complex is better than complicated, which is to say: if the problem genuinely requires complexity, own it cleanly rather than hiding it behind a tangle of indirections that make the system *complicated* without making it any less *complex*. The distinction matters. A watch is complex; a watch with a third hand that points to a second dial that encodes the time in Roman numerals viewed through a magnifying glass is complicated.

There is also this:

> If the implementation is hard to explain, it's a bad idea.
> If the implementation is easy to explain, it may be a good idea.

Note the asymmetry. Hard to explain is *certainly* bad. Easy to explain is only *possibly* good. Peters is generous to the simple and skeptical of the clever, which is the correct default posture for someone who has to maintain the thing next year.

### the disease and its symptoms

I want to describe the failure mode precisely because I have watched it happen to smart people — indeed it happens *preferentially* to smart people, which is part of what makes it so insidious.

A developer encounters a problem. The problem has some inherent complexity; perhaps it involves coordinating two systems that were designed independently, or handling a data format that is almost-but-not-quite what was expected. The developer, being skilled, recognizes the complexity and — here is where the wheels come off — decides to build an abstraction that will handle not just this problem but all similar problems that might conceivably arise. A factory. An adapter pattern. A plugin architecture. A domain-specific language. The developer is not being lazy; quite the opposite, they are being industrious in exactly the wrong direction.

What they have done is trade a small, concrete problem for a large, abstract one. The original problem was "these two date formats don't match". The new problem is "design and maintain a general-purpose data transformation framework". The first problem can be solved in an afternoon and explained over lunch; the second is a career.

I have a heuristic that I'll offer you with the caveat that heuristics are approximations and not laws: if you are building an abstraction because the *current* code requires it, you are probably doing the right thing; if you are building it because *future* code might require it, you are almost certainly doing the wrong thing. The future is a notoriously unreliable collaborator. It rarely brings the problems you anticipated and invariably brings ones you didn't. The abstraction you built for the imagined future becomes a constraint on the actual one, and three years hence someone will stare at your factory-of-factories and write a two-word code review.

### what removal looks like in practice

So if the discipline is removal rather than addition, what does that look like when you sit down to write code?

It looks like writing the simplest thing that could possibly work and then — this is the part most people skip — *leaving it that way* until demonstrated inadequacy forces a change. It looks like deleting code that isn't being called and not feeling guilty about it. It looks like choosing a flat data structure over a nested one even when the nested one is more "theoretically correct" because flat structures are easier to inspect, easier to debug, and easier to explain to the person who inherits your work.

It also looks like reading your own code a week later and being mildly embarrassed by something you wrote and then asking: is the embarrassment because the code is wrong, or because it is insufficiently clever? If the latter, leave it alone. Insufficient cleverness is not a defect. Excessive cleverness is.

There is a reason that experienced developers delete more code than they write. Software grows by accretion like a coral reef; the living parts are thin and on the surface and the bulk of the mass is dead structure that once served a purpose. Unlike coral, though, dead code has a cost: it must be compiled, navigated, understood (or misunderstood), and maintained. The most productive thing you can do on many days is remove something and watch nothing break.

### a confession

I should tell you that I have built the factory-of-factories. More than once. I have written the abstract base class hierarchy that anticipated seventeen use cases of which two materialized and neither fit the abstraction. I have added the layer of indirection that solved the immediate problem and created three new ones. I know the temptation intimately because I have yielded to it, and I am telling you about it in the same spirit that a man who has touched the hot stove might mention to you that the stove is hot.

Saint-Exupéry vanished over the sea at forty-four, and we found the wreckage of his plane sixty years later. We never found the pilot. Whatever else he was, he was a man who understood that the machine must be stripped to its essentials because your life depends on it. Our stakes are lower but the principle is the same: every unnecessary abstraction is a place where understanding goes to die, and software that cannot be understood cannot be trusted and should not be deployed.

So the next time you reach for a new class, a new layer, a new pattern — ask yourself: is this a thing I am adding, or a thing I could remove? The answer will occasionally be "add". But the question is always worth asking, and the courage is in the removal.
