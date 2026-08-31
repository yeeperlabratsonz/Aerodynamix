---
name: Slim UGS hosting
description: Constraints for remote game sources used by downloadable Slim exports.
---

Slim exports should prefer verified UGS catalogue entries for games whose GitHub Pages folders are incomplete. UGS jsDelivr wrappers are served as `text/plain`, so they must be fetched and placed in `srcdoc` to execute as HTML. The player iframe also needs explicit `gamepad`, `fullscreen`, `autoplay`, and `pointer-lock` permissions for Unity/WebGL games. Normalize XML-like envelopes and shell-only parent/root helpers before loading. UGS Flash wrappers may contain a literal `$1` player placeholder; substitute the movie URL found in their `param` or `embed` markup. When a patched wrapper already has a `<base href>`, preserve it instead of adding another base tag.

**Why:** GitHub Pages can lag behind the workspace and expose an index without companion game assets, while UGS keeps many large assets available on demand but relies on its original loader for Flash substitution.

**How to apply:** Keep the Slim catalogue on-demand and small, map only verified UGS IDs, fetch and normalize the full remote HTML before assigning `srcdoc`, grant the iframe permissions Unity needs, preserve existing asset bases, guard optional UGS parent APIs, remove only known shell helpers, and inject a base URL only when the wrapper lacks one.