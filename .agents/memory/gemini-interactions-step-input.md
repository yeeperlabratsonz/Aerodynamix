---
name: Gemini Interactions step input
description: The current Gemini Interactions API model expects step-based input objects rather than chat turn objects.
---

Use `user_input` and `model_output` step objects in the Interactions API `input` list. Sending ordinary `{role, content}` chat turns produces a turn-list validation error; the accepted step format can still return quota errors when the key is limited.

**Why:** The configured Gemini model rejects the legacy turn-list shape before generation, and the browser needs a reliable local fallback when the hosted request is unavailable.

**How to apply:** Keep the API key server-side, translate client history into step objects, and treat provider failures as a reason to offer WebLLM instead of exposing upstream details.