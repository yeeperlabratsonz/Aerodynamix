---
name: Slim UGS hosting
description: Constraints for remote game sources used by downloadable Slim exports.
---

Slim exports should prefer verified UGS catalogue entries for games whose GitHub Pages folders are incomplete. UGS Flash wrappers may contain a literal `$1` player placeholder; the launcher must fetch those wrappers and substitute the movie URL found in their `param` or `embed` markup before placing them in the player frame. When a wrapper already has a `<base href>`, preserve it instead of adding another base tag.

**Why:** GitHub Pages can lag behind the workspace and expose an index without companion game assets, while UGS keeps many large assets available on demand but relies on its original loader for Flash substitution.

**How to apply:** Keep the Slim catalogue on-demand and small, map only verified UGS IDs, preserve the full remote HTML when applying the runtime Flash fix instead of sanitizing it, and only inject a base URL for wrappers that lack one.