---
name: Gemini API compatibility
description: Current Gemini API compatibility requirements for the Lite assistant
---

Use the Gemini Interactions API for new server-side integrations. Some newly issued Gemini keys reject legacy `generateContent` model names even when the endpoint is otherwise valid; prefer a currently documented Flash model and send the key through the `x-goog-api-key` header.

**Why:** A test request using a legacy Flash model returned a deprecation/new-user availability error, while the Interactions API succeeded with the current Flash model.

**How to apply:** Keep Gemini credentials server-side, use the current official model/API documentation when upgrading, and never place the key in standalone HTML or client JavaScript.