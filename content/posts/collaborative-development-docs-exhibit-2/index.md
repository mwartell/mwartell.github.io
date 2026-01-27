---
title: Bedrock Input Error Handling - Take 2
date: 2025-01-26
main_branch_commit: eeefb97
session_type: collaborative_exploration
topics:
  - bedrock
  - error_diagnosis
agent: Copilot Claude Opus 4.5
---

This is a continuation of the exploration in 2025-01-26-bedrock-input-error.md. The fix performed did not work. I have some more data to explore.

# Prompt 1: summarize 2025-01-26-bedrock-input-error.md for context

So you have information you need without re-reading the previous exploration, please summarize the key points from 2025-01-26-bedrock-input-error.md for context. You are the consumer of this summary so make it suitable for your purposes.

# Response 1: summary so far

## Issue and Root Cause

Issue #288 reports Prima-Code failures with Bedrock models. Investigation of Logfire trace `019bfc9786f2a881dcb5e827d56f083e` identified the root cause:

**The message adapter creates empty TextParts when assistant messages have `content=None` with tool calls, and Bedrock's Converse API validation rejects messages with blank text fields.**

Specific error location: `messages.5.content.1` containing `TextPart(content="")`.

## Technical Details

The defect is in [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py#L699):

```python
def _assistant_content_text(content: Any) -> str | None:
    if content is None:
        return ""  # ← Problematic: converts None to empty string
```

This causes the conversion chain:
1. OpenAI format: `{"role": "assistant", "content": None, "tool_calls": [...]}`
2. Adapter creates: `{"role": "assistant", "parts": [ToolCallPart(...), TextPart(content="")]}`
3. Bedrock rejects the blank TextPart; OpenAI tolerates it

Test `test_assistant_parts_accepts_none_content()` in [tests/usage/test_usage_metadata_and_binding.py:238](tests/usage/test_usage_metadata_and_binding.py#L238) explicitly documents and validates this incorrect behavior.

## Proposed Fix

Change `_assistant_content_text()` to return `None` instead of `""` when content is `None`. The downstream `_assistant_content_parts()` logic already handles `None` correctly by returning an empty parts list, which represents "no text content" correctly for all providers.

**Impact:**
- Bedrock: eliminates validation errors
- OpenAI: no behavioral change (tolerates both representations)
- Semantic correctness: `content=None` means "no text", not "empty text"

**Test updates required:**
- Update `test_assistant_parts_accepts_none_content()` to expect empty parts list instead of list with empty TextPart

## Status

**Fix implemented in commit `2d19953`** (on branch `288-prima-code-not-working-with-bedrock`).

The implementation included:
- Modified `_assistant_content_text()` to return `None` instead of `""` for empty content
- Created comprehensive test suite in [tests/unit/test_assistant_empty_content.py](tests/unit/test_assistant_empty_content.py)
- Updated existing test `test_assistant_parts_accepts_none_content()` to expect empty parts list
- Added "Tool Calling and Content Fields" section to [docs/openai-protocol.md](docs/openai-protocol.md)

All tests pass, including new tests that verify the fix resolves the Bedrock validation error.

# Prompt 2: Explore the Aglet traces

I ran Prima-Code (an OpenAI Codex fork) on the single input

> What is an aglet?

There were two traces generated in logfire by this prompt:

1. 019bfcbf71c954390627a606ed5d50b2
2. 019bfcbf837ff964bb4d5328e887de30

Explore these traces and see if it adds any information to help diagnose the Bedrock input error.


# Response 2: exploration of Aglet traces
## Overview

Examined two Logfire traces generated from the same Prima-Code query "What is an aglet?":

1. **Trace 019bfcbf71c954390627a606ed5d50b2**: Initial HTTP request to `/v1/chat/completions` endpoint
2. **Trace 019bfcbf837ff964bb4d5328e887de30**: Backend processing that triggered the Bedrock error

[View trace 019bfcbf837ff964bb4d5328e887de30 in Logfire](https://logfire-us.pydantic.dev/mwartell/aiox?q=trace_id%3D%27019bfcbf837ff964bb4d5328e887de30%27)

## Critical Finding: A Different Issue

The traces reveal a **different problem** from the one fixed in Response 1. This is not about assistant messages with `content=None` and tool calls.

### The Error

Bedrock validation error in trace 019bfcbf837ff964bb4d5328e887de30:

```
status_code: 400
model_name: anthropic.claude-3-5-sonnet-20240620-v1:0
error: "The text field in the ContentBlock object at messages.4.content.0 is blank.
       Add text to the text field, and try again."
Code: ValidationException
```

### Root Cause

The message history sent to Bedrock contains an **empty user message** at index 4:

```python
{"role": "user", "parts": [{"type": "text", "content": ""}]}
```

### Message Sequence

The complete message history shows:

0. **System**: Coding agent system prompt
1. **User**: `<environment_context>...</environment_context>`
2. **User**: `"what is an aglet?"`
3. **Assistant**: Tool call - `shell` command with `["rg", "aglet", "-i", ...]`
4. **User**: Tool result - `"{\"output\":\"tools/general-questions.txt:What is an aglet?\\n\"...}"`
5. **Assistant**: Text response - `"To answer your question about what an aglet is..."`
6. **User**: `""` ← **EMPTY MESSAGE - THIS IS THE PROBLEM**

### Where the Problem Occurs

Looking at the trace events:
1. `Tool-calling flow detected: preserving message order` (timestamp 23:59:28.223250Z)
2. `as_prompt_and_history return` shows the message history with the empty user message
3. RAG context injection is invoked but fails (prima-web connection error)
4. Guardrail processing completes with no violations
5. Request sent to Bedrock with the malformed message history
6. Bedrock rejects with ValidationException

### Analysis

This empty user message appears to be injected by the message processing pipeline, likely in one of these areas:

1. **Tool execution flow**: The code in [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py) function `_prepare_tool_execution()` or `_extract_user_prompt()`
2. **Guardrail processing**: After guardrail analysis, an empty message might be appended
3. **Message history construction**: The `to_model_messages()` or `as_prompt_and_history()` functions may incorrectly append an empty user message

The trace shows this log: `"Tool-calling flow detected: preserving message order"` with `last_user_idx=2` and `total_messages=6`, which suggests the message ordering logic may be creating an empty placeholder message.

## Key Differences from Previous Issue

| Aspect | Previous Issue (Response 1) | Current Issue (Response 2) |
|--------|----------------------------|----------------------------|
| **Message Role** | Assistant | User |
| **Content Value** | `None` with tool_calls | Empty string `""` |
| **Message Position** | After tool calls | After assistant text response |
| **Error Location** | `messages.5.content.1` | `messages.4.content.0` |
| **Root Cause** | `_assistant_content_text()` converting `None` to `""` | Message pipeline adding empty user message |

## Next Steps

Need to investigate:

1. [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py) - `_extract_user_prompt()` function (line 592 in trace)
2. [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py) - `to_model_messages()` function (line 635 in trace)
3. How the message history is constructed when tool calls are present
4. Why an empty user message is being appended after the assistant responds with text

The fix will likely require filtering out or preventing the creation of empty user messages in the conversion pipeline.

# Prompt 3: Next steps

Proceed with your next steps listed in Response 2. Look to find logical errors in the message history handling, not merely patching out this symptom.

Implement tests to show the current failures and then create a fix to resolve the Bedrock input error.

# Response 3: Investigation and Fix Implementation

## Root Cause Analysis

The investigation confirmed the hypothesis from Response 2. The issue is in the `_extract_user_prompt` function in [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py#L555):

```python
if has_tail:
    # Preserve chronological order: keep all messages in history
    return "", messages  # ← BUG: Returns empty string
```

When this empty string `""` is passed to `agent.run(prompt, message_history=...)`, pydantic-ai creates a new `UserPromptPart(content="")` and appends it to the message history. Bedrock then rejects this empty user message with:

```
The text field in the ContentBlock object at messages.N.content.0 is blank.
```

## Key Discovery: pydantic-ai Accepts None for user_prompt

Examining the pydantic-ai Agent.run signature:

```python
user_prompt: str | Sequence[_messages.UserContent] | None = None
```

The `user_prompt` parameter explicitly accepts `None` as a default value. When `user_prompt=None`, pydantic-ai does **not** create a new user message - it simply uses the provided `message_history` as-is.

## The Fix

Changed `_extract_user_prompt` to return `None` instead of `""` for tool-calling flows:

**File:** [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py)

1. Updated return type: `tuple[str, list[ModelMessage]]` → `tuple[str | None, list[ModelMessage]]`
2. Changed return statement: `return "", messages` → `return None, messages`
3. Updated `as_prompt_and_history` method's return type annotation similarly

## Tests Created

Created comprehensive test suite in [tests/unit/test_empty_user_prompt.py](tests/unit/test_empty_user_prompt.py):

| Test | Description |
|------|-------------|
| `test_tool_tail_returns_none_prompt` | Verifies None is returned for tool-calling flows |
| `test_tool_tail_preserves_message_order` | Verifies all messages stay in history with correct order |
| `test_normal_flow_extracts_user_prompt` | Verifies normal chat still extracts prompt as string |
| `test_chat_request_tool_flow_returns_none` | Integration test via ChatRequest API |
| `test_user_parts_with_empty_string_creates_part` | Documents that empty string does create parts |
| `test_none_prompt_does_not_add_user_message` | Verifies the Aglet trace scenario is fixed |

## Existing Tests Updated

Updated two tests in [tests/integration/test_chat_request.py](tests/integration/test_chat_request.py) to expect `None` instead of `""`:

- `test_as_prompt_and_history_preserves_order_with_tool_tail`
- `test_as_prompt_and_history_content_values_with_tool_tail`

## Verification

All 11 tests pass:
```
tests/unit/test_empty_user_prompt.py: 6 passed
tests/integration/test_chat_request.py: 5 passed
```

## Why This Is the Right Fix

| Aspect | Before (Bug) | After (Fix) |
|--------|-------------|-------------|
| **Return value** | `""` (empty string) | `None` |
| **pydantic-ai behavior** | Creates `UserPromptPart(content="")` | Skips user message creation |
| **Bedrock result** | ValidationException | ✓ Valid |
| **OpenAI result** | ✓ Works (tolerates empty) | ✓ Works |
| **Semantic meaning** | "User sent empty text" | "No new user input" |

The fix is semantically correct: when continuing a tool-calling conversation, there truly is no new user input - the user's original question is already in the message history. Returning `None` correctly expresses this, while `""` incorrectly implies the user sent an empty message.

## Files Modified

1. [aiox/src/aiox/adapter.py](aiox/src/aiox/adapter.py) - Core fix
2. [tests/unit/test_empty_user_prompt.py](tests/unit/test_empty_user_prompt.py) - New tests (created)
3. [tests/integration/test_chat_request.py](tests/integration/test_chat_request.py) - Updated assertions
