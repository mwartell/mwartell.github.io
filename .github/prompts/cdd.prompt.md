---
name: cdd
description: begins a cdd request
---
Begin processing a CDD prompt. The user will provide a Prompt section number and the context must include a CDD file containing that Prompt section. You must read the Agent instructions in the `instructions` header of the CDD file and then satisfy the numbered Prompt.

If the user only provides a number for this prompt, please interpret that as a request to "Satisfy Prompt N".
