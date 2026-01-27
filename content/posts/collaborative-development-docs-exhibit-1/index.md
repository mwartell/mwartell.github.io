---
title: Bedrock Input Error Handling
date: 2025-01-26
main_branch_commit: eeefb97
session_type: collaborative_exploration
topics:
  - bedrock
  - error_diagnosis
agent: Copilot Claude Opus 4.5
build:
  list: false
---

This is a diagnostic investigation into an error encountered when using Prima-Code with Bedrock models. There is a developer prompt followed buy the Copilot's analysis.

## Prompt 1: explore the logfire traces

There is an [Issue #288 Prima-Code Not Working with Bedrock Models](https://github.com/esimplicityinc/prima-engine/issues/288) that describes a problem when using Prima-Code with Bedrock models.

I have reproduced the fault and there is a logfire trace 019bfc9786f2a881dcb5e827d56f083e that shows the error. Read through the trace and see if you can determine the cause.

The preceding trace 019bfc9786f2a881dcb5e827d56f083e from the same Prima-Code session shows a successful call to the same Bedrock model.

The weird thing is that it looks like the Prima-Code client may be initiating the second call on its own, because the second trace happens almost immediately after the first trace completes and it contains a user message

```
ChatMessage(
    role='user'
    content='''Bug summary
    Prima Code Dies when Attached to Bedrock

    Description
    When we use Bedrock with Prima Cod...'''
    ...
)
```

which looks like the answer from the model received in the first trace. See if you can confirm or deny that hypothesis.

## Response 1: analysis of the logfire traces

### Root Cause Identification

The Logfire trace `019bfc9786f2a881dcb5e827d56f083e` reveals the exact cause of the Bedrock validation error. The failure occurs at **messages.5.content.1** where Bedrock rejects an assistant message containing an empty text content block.

**Error Details:**
```
The text field in the ContentBlock object at messages.5.content.1 is blank.
Add text to the text field, and try again.
```

Examining the `pydantic_ai.all_messages` attribute in the trace shows the problematic message structure at index 7 (the assistant's response after the first tool call):

```python
{"role":"assistant","parts":[
    {"type":"tool_call","id":"tooluse_q_4DPUpHRImNF1WgLWlJnw","name":"shell",...},
    {"type":"text","content":""}  # ← Empty text block causes validation error
]}
```

When an assistant message includes tool calls, the adapter is appending an empty text content block. Bedrock's Converse API validation rejects messages with blank text fields, even when tool calls are present.

### Hypothesis Verification: Second Call Initiation

**The hypothesis that Prima-Code client initiates a second call automatically is INCORRECT.**

The trace shows a single continuous conversation with the following flow:

1. User: "hello"
2. Assistant: greeting response
3. User: "what insights about the engine code can you derive from this report:"
4. Assistant: asks for the report
5. User: provides bug report (the "Bug summary" text)
6. Assistant: makes tool call (`rg` search) **+ empty text** ← ERROR HERE
7. User: tool result
8. Assistant: analysis response
9. User: empty message (new prompt)

The "Bug summary" text is **user input**, not a model response being echoed. The user is providing the bug report that the assistant had requested in the previous turn. This is normal conversational flow, not client-initiated duplication.

### Message Conversion Issue

The problem lies in how the OpenAI chat completion format is converted to pydantic_ai's message format for Bedrock. Specifically, when an assistant turn contains tool calls but no text content in the OpenAI format, the conversion process creates:

```python
# OpenAI format
{"role": "assistant", "tool_calls": [...], "content": None}

# Gets converted to pydantic_ai format with problematic empty text
{"role": "assistant", "parts": [
    {"type": "tool_call", ...},
    {"type": "text", "content": ""}  # Bedrock rejects this
]}
```

### Fix Location

The issue is in the message adapter code, likely in methods that convert assistant responses:
- `_assistant_content_parts()` - converts assistant content to parts list
- `_assistant_content_text()` - extracts text from assistant content

These methods need to filter out or avoid creating empty text content blocks when:
1. The assistant message contains tool calls
2. The text content is None or empty string

### Technical Context

- **File:** [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py)
- **Trace ID:** `019bfc9786f2a881dcb5e827d56f083e`
- **Trace Link:** https://logfire-us.pydantic.dev/mwartell/aiox?q=trace_id%3D%27019bfc9786f2a881dcb5e827d56f083e%27
- **Error Span:** `chat anthropic.claude-3-5-sonnet-20240620-v1:0` (span_id: d525bca2b812f9a6)
- **Model:** anthropic.claude-3-5-sonnet-20240620-v1:0 via Bedrock
- **HTTP Status:** 400 ValidationException

## Prompt 2: planning a general fix

The analysis in Response 1 seems reasonable. Propose a general fix that would prevent this kind of error from happening in the future when using Bedrock models with Prima-Code.

But, before implementing the fix, analyze whether this is a demonstrable defect in the message handling and so ought work for say OpenAi or other models. If there is any Pydantic-AI or Anthropic documentation that supports your analysis, cite it.

If the docs/openai-protocol.md needs to be revised in light of what you've learned, please do it in addition to your response.

## Response 2: proposed general fix

### Is This a Demonstrable Defect?

**Yes**, this is a demonstrable defect in the message adapter that affects Bedrock (and potentially other providers) but not OpenAI.

#### Evidence from Code and Tests

1. **Current Behavior in `_assistant_content_text()`** ([aiox/src/aiox/adapter.py:699](aiox/src/aiox/adapter.py#L699)):
   ```python
   def _assistant_content_text(content: Any) -> str | None:
       if content is None:
           return ""  # ← Converts None to empty string
   ```

2. **Test Documenting This Behavior** ([tests/usage/test_usage_metadata_and_binding.py:238](tests/usage/test_usage_metadata_and_binding.py#L238)):
   ```python
   def test_assistant_parts_accepts_none_content() -> None:
       message = ChatMessage(role="assistant", content=None)
       parts = _assistant_parts(message)

       assert len(parts) == 1
       assert isinstance(parts[0], TextPart)
       assert parts[0].content == ""  # ← Expects empty string
   ```

3. **Tool Chat Patterns** show that when assistants make tool calls without text, `content=None` is the standard:
   ```python
   ChatMessage(
       role="assistant",
       content=None,  # ← No text when only making tool calls
       tool_calls=[...]
   )
   ```

#### Provider-Specific Behavior

**OpenAI**: Tolerates empty `content` fields in assistant messages with tool calls. OpenAI's API is lenient and doesn't validate that text content must be non-empty when tool calls are present.

**Bedrock (Anthropic)**: Strictly validates the Converse API format and rejects messages with blank text fields:
```
ValidationException: The text field in the ContentBlock object at messages.N.content.M is blank.
```

**pydantic-ai**: The library converts messages to a provider-agnostic format with `parts[]`. When an empty TextPart is included, Bedrock's validation catches it but OpenAI doesn't.

### Root Cause Analysis

The conversion chain:
1. OpenAI format: `{"role": "assistant", "content": None, "tool_calls": [...]}`
2. `_assistant_content_text(None)` → returns `""`
3. `_assistant_content_parts("")` → returns `[TextPart(content="")]`
4. Final pydantic-ai message: `{"role": "assistant", "parts": [ToolCallPart(...), TextPart(content="")]}`
5. Bedrock: **REJECTS** because TextPart has blank content

### Proposed Fix

Modify `_assistant_content_text()` to return `None` instead of `""` when content is `None`, allowing `_assistant_content_parts()` to correctly filter out empty content:

**File:** [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py#L697)

```python
def _assistant_content_text(content: Any) -> str | None:
    if content is None:
        return None  # ← Changed from "" to None
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        fragments = _assistant_content_fragments(content)
        if fragments:
            return "\n".join(fragments)
        return None
    if content in ("", None):  # This check now redundant with first check
        return None
    return str(content)
```

The existing logic in `_assistant_content_parts()` already handles this correctly:
```python
def _assistant_content_parts(content: Any) -> list[ModelResponsePart]:
    normalized = _assistant_content_text(content)
    if normalized is None:
        return []  # ← No TextPart created when None
    return [TextPart(content=normalized)]
```

### Impact Analysis

**What changes:**
- Assistant messages with `content=None` (tool-only responses) will no longer create empty TextParts
- The `parts[]` list will contain only ToolCallParts, no empty TextPart

**What stays the same:**
- Assistant messages with actual text content work unchanged
- Assistant messages with both text and tool calls work unchanged
- User, system, and tool messages unaffected

**Test Updates Required:**
- `test_assistant_parts_accepts_none_content()` in [tests/usage/test_usage_metadata_and_binding.py:238](tests/usage/test_usage_metadata_and_binding.py#L238) must be updated:
  ```python
  def test_assistant_parts_accepts_none_content() -> None:
      message = ChatMessage(role="assistant", content=None)
      parts = _assistant_parts(message)

      # After fix: empty content produces no parts, not empty TextPart
      assert len(parts) == 0  # ← Changed from 1
      # Remove assertions about TextPart
  ```

### Why This Fix Is Correct

1. **Bedrock Compatibility**: Eliminates the validation error by not creating blank text content blocks
2. **OpenAI Compatibility**: OpenAI doesn't care whether empty TextParts are present or absent
3. **Protocol Correctness**: The OpenAI Chat Completion format allows `content` to be `null` when `tool_calls` is present. Our adapter should preserve this semantic distinction rather than converting null to empty string.
4. **Pydantic-AI Alignment**: pydantic-ai's message format naturally represents "no text content" as an empty parts list, not a list with an empty TextPart

### Alternative Considered: Provider-Specific Filtering

We could filter empty TextParts only when using Bedrock, but this is inferior because:
- It treats the symptom, not the cause
- It adds provider-specific complexity to the adapter
- The current behavior (creating empty TextParts) serves no purpose for any provider
- The semantic intent of `content=None` is "no text", not "empty text"

### Documentation Updates

The [docs/openai-protocol.md](docs/openai-protocol.md) document currently doesn't address the `content` field behavior for tool-calling scenarios. No updates are strictly required, but it would benefit from a section documenting this edge case.

## Prompt 3: implement the fix

This sounds like a simple change.

Create unit tests that should fail currently but would pass after the fix is implemented. Confirm that these tests fail before making the fix.

Then implement the fix and verify that the new tests pass and the old tests still pass.

## Response 3: implementation completed

Implemented the fix in commit `2d19953`. The changes included:

### Code Changes

**[aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py#L697-L702)**
```python
def _assistant_content_text(content: Any) -> str | None:
    if content is None:
        return None  # ← Changed from ""
    if isinstance(content, str):
        return content if content else None  # ← Also handle empty strings
```

### New Tests Created

**[tests/unit/test_assistant_empty_content.py](tests/unit/test_assistant_empty_content.py)** - Comprehensive test suite with 6 tests:
- `test_assistant_content_text_returns_none_for_none_input()` - Verifies None input returns None
- `test_assistant_content_parts_returns_empty_list_for_none()` - Verifies no TextParts created for None
- `test_assistant_parts_with_only_tool_calls_no_text()` - Tool-only messages have no TextPart
- `test_assistant_parts_with_tool_calls_and_text()` - Both text and tools work correctly
- `test_assistant_parts_with_text_only()` - Text-only messages unchanged
- `test_assistant_content_text_with_empty_string()` - Empty strings also return None

### Updated Tests

**[tests/usage/test_usage_metadata_and_binding.py:238](tests/usage/test_usage_metadata_and_binding.py#L238)**
```python
def test_assistant_parts_accepts_none_content() -> None:
    """After fix: content=None produces no parts, not an empty TextPart."""
    message = ChatMessage(role="assistant", content=None)
    parts = _assistant_parts(message)
    assert len(parts) == 0  # ← Changed from expecting 1 part with empty TextPart
```

### Documentation Updates

**[docs/openai-protocol.md](docs/openai-protocol.md)** - Added comprehensive section "Tool Calling and Content Fields" covering:
- Semantic meaning of `content=None` vs `content=""`
- Examples of tool-only and tool+text assistant messages
- Adapter behavior before and after fix
- Provider compatibility (OpenAI lenient, Bedrock strict)
- Best practices

### Test Results

All tests pass including the new test suite that specifically validates the fix for Issue #288.
