---
title: on the virtues of less
date: 2026-04-02
draft: true
---


I was staring at a pull request the other day — forty-seven files changed, a new abstraction layer, a new container where previously there had been none, and all the associated container build and run mechanisms. The commit message said "refactor for extensibility".

This is not a story about that particular pull request, it is about the instinct that produced it, and about a maxim I have come to regard as among the most useful and least heeded in software engineering.

David Wheeler of Cambridge gave us the prescription:

> all problems in computer science can be solved by another level of indirection.

Kevin Henney gave us the corollary, which is the part that actually matters:

> *except for the problem of too many levels of indirection*.

The original clause is sound engineering advice. The corollary is a warning. What Henney understood, and what the forty-seven-file pull request demonstrates, is that indirection is not merely a tool — it is a seduction; and the seduction, once yielded to, compounds.

### the pleasures of adding

The appeal of indirection is not hard to understand. When two systems do not fit each other, you put something between them that translates. When a dependency causes problems, you introduce an interface that hides it. When behavior needs to vary, you add a dispatch layer that selects the right implementation. Each of these is a genuine solution to a genuine problem, and the engineer who reaches for indirection is not being lazy or reckless; quite the opposite, she is applying one of the most productive principles in the discipline's history. Virtual machines, file systems, DNS, HTTP, object-oriented dispatch, dependency injection: all of them are, at root, a layer of indirection that someone inserted between two things that could not otherwise coexist. The pattern has a magnificent track record.

The problem arrives not at the first application but at the fifth, or the fifteenth. Each layer solves the problem that was immediately visible and creates a new set of problems that are not visible until later, when there are now enough layers that no one can remember what the original structure was, and the act of adding the next layer feels — dangerously — just like all the previous acts of adding layers, which worked.

Fred Brooks, in *The Mythical Man-Month*, put it with characteristic precision:

> It is better to have a system omit certain anomalous features and improvements, but to reflect one set of design ideas, than to have one that contains many good but independent and uncoordinated ideas.

Conceptual integrity, he called it. The principle is not parsimony for its own sake — it is the recognition that a system with one coherent design idea can be understood; a system assembled from many individually reasonable ideas, each inserted to solve the problem of the moment, cannot. The ideas do not combine; they accumulate.

### the microservices case

Nowhere is this accumulation more visible, or more instructive, than in the modern enthusiasm for microservices.

The microservices model has genuine virtues. When a system genuinely decomposes into independent domains with well-defined contracts between them, distributing it across services allows each part to be scaled, deployed, and reasoned about in isolation. This is not nothing. The architecture earns its complexity when the decomposition reflects real independence in the problem domain.

What happens in practice, with some frequency, is different. A team encounters a structural problem in their application — a tightly coupled module that is difficult to change, a shared database that has become a bottleneck, a piece of logic that was placed in the wrong layer early in the project's life. The correct response is to address the structural problem directly, which requires understanding it, which is difficult and unglamorous. The available response — the path that *feels* like engineering, that generates a satisfying pull request, that comes with its own ticket and its own sprint — is to introduce a new service that handles the problematic logic in isolation, behind an API.

The API is a level of indirection. It solves the immediate visibility problem: the bad coupling is now hidden behind a service boundary, and the team can resume forward motion. What it does not do is fix the underlying structure; it encapsulates it. The structural debt is still present, now thoroughly wrapped in network calls, serialization contracts, deployment pipelines, health checks, distributed tracing, and the operational overhead of a thing that can fail independently at 3 a.m. You have added Henney's problem on top of Wheeler's solution.

Robert Pirsig, in *Zen and the Art of Motorcycle Maintenance*, identified this as a specific variety of what he called a gumption trap — an obstacle that quietly drains the motivation and attention necessary to do a job properly. "Impatience," he wrote, "is close to boredom but has a 'muscle tension' quality to it. You want to rush through the job faster than it should be done... If you're going to repair a machine, an attitude of impatience will guarantee that the machine won't be repaired properly." The microservices patch is impatience made architectural. The engineer wants to resume forward motion; the new service supplies the sensation of forward motion — a green pipeline, a closed ticket, a sprint velocity that didn't slip — and so the structural problem, still unexamined, graduates from a local difficulty into a distributed one. The additional operational surface area makes the underlying coupling harder, not easier, to see. You have not escaped the stuckness; you have buried it, and paradoxically made yourself more thoroughly stuck.

This compounds. The new service itself has rough edges; in time, another service is introduced to manage the interactions between the first two. The container orchestration layer grows to accommodate the expanding topology. A service mesh is introduced to handle the cross-cutting concerns the services have generated. Each addition is defensible in isolation. The aggregate is a distributed monolith: all the coupling of a single application with all the operational complexity of a distributed system, which is to say all the disadvantages of each and the advantages of neither.

There is an line from the world of aircraft design by Antoine de Saint-Exupéry — a writer and pilot, from his 1939 book *Terre des hommes*:

> It seems that perfection is attained not when there is nothing left to add, but when there is nothing left to take away.

Having crashed his airplane in the Sahara and nearly dying of dehydration gave Saint-Exupéry ample time to contemplate the dire consequences of design on his life.


### the zen of it

Tim Peters, in 1999, distilled the Python design philosophy into nineteen aphorisms in PEP-20 _The Zen of Python_, among them:

> Simple is better than complex.
> Complex is better than complicated.

The structure is doing real work. Simple is *better than* complex — not "simple is ideal" or "complexity is always wrong", but a preference when alternatives exist. Complex is better than *complicated*: if the problem genuinely requires complexity, own it directly rather than hiding it behind a tangle of layers that make the system complicated without reducing its complexity. The distinction, once you have internalized it, is a reliable diagnostic: a service topology that is complex because the business domain is complex is doing necessary work; one that is complicated because it was assembled from successive patches of indirection to avoid confronting the domain structure is not.


### the discipline

The discipline being described here is not one of abstinence from indirection. It is one of honesty about cost. Every level of indirection you add is a tax levied on everyone who subsequently has to understand the system; it is a potential failure point; it is a contract that must be maintained as the pieces on either side of it evolve. The tax is sometimes worth paying. The point is to pay it consciously, having asked whether the problem it solves is actually the problem you have, and whether there is a structural solution that eliminates the need for the layer rather than routing around it.

When you reach for the new service, the new abstraction, the new interface — ask not whether it solves the current problem. It will. Ask whether you are solving a structural problem or deferring it; and ask whether the person who inherits your architecture, three years hence, will thank you for the additional layer or curse you for the unnecessary one. The answer shapes which kind of engineer you are.

Henney's corollary is not a footnote to Wheeler. It is the whole point.
