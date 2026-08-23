---
name: WebGL preview compatibility
description: Headless preview limitations for browser games that use Three.js or other WebGL renderers.
---

WebGL-based games should detect renderer creation failures and show a clear compatibility message instead of leaving a loading screen running forever.

**Why:** The Replit screenshot/headless preview can lack a usable WebGL context even when the same game works in a normal hardware-accelerated browser.

**How to apply:** Keep the real WebGL path as the production experience, but provide a lightweight fallback screen or renderer error state so preview checks remain understandable and actionable.