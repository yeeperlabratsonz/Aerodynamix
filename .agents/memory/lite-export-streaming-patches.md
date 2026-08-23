---
name: Lite export streaming patches
description: How to safely extend the unusually large one-file Lite export.
---

The Lite export is large enough that patches injected at the end of the document appear too late for the Games view. Inject the maintained enhancement script immediately after the game-grid markup and use a compact fallback manifest for the game cards.

**Why:** The original export embeds large thumbnail and game payloads in its scripts. Its lexical variables are not reliably reachable by a separately loaded patch, and delaying the patch until the end leaves the visible library blank while the document parses.

**How to apply:** Keep hosted Lite enhancements in the small companion script, make the script independent of the inline manifest where possible, and render cards from stable title/path data rather than reinserting massive thumbnail data URIs.