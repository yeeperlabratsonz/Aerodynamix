---
name: Published static-site drift
description: External static hosting can serve older game pages than the current local source.
---

When a lightweight export targets published game URLs, verify the live page itself rather than assuming the local static source has been published. A stale external page can load a different script version and fail even when the local package is fixed.

**Why:** The lightweight export intentionally avoids bundling game payloads, so it cannot repair a stale or broken remote page without changing the hosting source or publishing a small remote wrapper.

**How to apply:** Test representative published URLs in Chromium after rebuilding. If the live page differs from local source, report the hosting/publish gap instead of silently re-bundling the game.