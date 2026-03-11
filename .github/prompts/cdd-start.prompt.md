---
description: 'Start a collaborative development document'
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/readFile', 'edit/createFile', 'edit/editFiles', 'todo']
---

Start a collaborative development document with yaml front matter and simple instructions to guide a new Agent session.

## Document Creation Requirements version 26.02.18

### YAML Front Matter
The new document must include these fields in its yaml header:
- **date**: Today's date in YYYY-MM-DD format
- **title**: Check the ENTIRE user message for a title. Common patterns:
  - Explicitly stated: "Title: xyz" or "title xyz"
  - Last line or phrase after the main request
  - A descriptive phrase that summarizes the work
  - If, for example, the user says "Follow instructions in cdd-start.prompt.md. implementing auth system", the title should be "implementing auth system"
  - If no clear title is found, ask for one
- **current_head**: Current git commit hash (use git commands to get this)
- **agent**: "Copilot Claude Sonnet 4.5" (or your specific model name)
- **session_type**: Leave blank for user to fill
- **instructions**: "_cdd-instructions.md"
- **topics**: Leave as empty array `[]` for user to populate

## Example user request:
"Follow instructions in cdd-start.prompt.md. implementing auth system"

→ Title should be: "implementing auth system"

### Filename Convention
Use format: `YYYY-MM-DD-descriptive-name.md` in the `docs/assistant/` directory

### Document Body Structure
1. **Title as H1 heading** - matches the title from front matter
2. **Ready for first prompt** - End with a section: `## Prompt 1: [await user's description]`

The workflow instructions are referenced via the `instructions:` field in YAML front matter, keeping the document clean and human-readable.

### version agreement

Read the version from this prompt in the `## Document Creation Requirements` section and get the version number from the _cdd-instructions.md file. Report their agreement or mismatch in responding to this prompt.

### Agent Behavior Note
Agents following _cdd-instructions.md will end each response with the marker `నేను సూచనలను చదివాను.` to confirm they've read the instructions.

Example user request:
"Follow instructions in cdd-start.prompt.md.
implementing auth system"

→ Title should be: "implementing auth system"
