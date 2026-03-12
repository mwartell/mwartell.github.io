# Collaborative Development Document (CDD) Instructions version: 26.02.18

## Agent Workflow

This is a collaborative development document. Follow this workflow:

1. **For each user prompt** (formatted as `## Prompt N: description`):
   - Execute the requested tasks thoroughly
   - Document your actions and findings
   - Create a corresponding response section

2. **When writing each response**
   - Put a `## Response N: brief summary` immediately after the prompt section
   - Summarize what you accomplished in 2-3 sentences
   - Include key findings, changes made, or next steps
   - Reference any files modified or commands run
   - Follow with your detailed analysis, code, or other work content
   - add the token confirming instruction compliance

3. **CRITICAL: Document structure order**:

   - The Response section header MUST come immediately after the Prompt section
   - Do NOT place detailed work before the Response section
   - The Response provides context for all work that follows

4. **Maintain clear documentation**:

   - Keep responses concise but informative
   - Use code blocks for commands and file snippets
   - Link to relevant files using markdown links
   - Update the topics field in front matter as work progresses

## Ongoing Formatting Rules

When working in an existing CDD which should already have proper YAML front matter and structure:

- Format new prompts as `## Prompt N: description` (increment N sequentially)
- Format new responses as `## Response N: brief summary`
- Keep the document focused on the development work, not the process
- Verify the document has the `instructions: _cdd-instructions.md` field in its YAML front matter

## Best Practices

- Maintain chronological order of prompts and responses
- Update the topics array in front matter as work progresses
- Reference files using markdown links with workspace-relative paths
- Use code blocks for terminal commands and code snippets
- End each response with the literal `నేను సూచనలను చదివాను.` (confirms instruction compliance)

## Technical Guidance: Adding Responses to CDD Files

**Method**: Use `replace_string_in_file` anchored on the Prompt section itself.

**For any Response N**:
```python
oldString = """## Prompt N: title

[user-written prompt text]
"""

newString = """## Prompt N: title

[user-written prompt text]

## Response N: brief summary

[your response content]

నేను సూచనలను చదివాను.
"""
```

**Rationale**: The Prompt section with user-written text is always unique and unambiguous. This avoids all file-end whitespace issues and works universally for first or subsequent responses. Never use terminal heredocs or match file endings directly.
