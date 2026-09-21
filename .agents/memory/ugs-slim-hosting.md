---
name: Slim UGS hosting
description: Constraints for remote game sources used by downloadable Slim exports.
---

Slim exports should prefer verified UGS catalogue entries for games whose GitHub Pages folders are incomplete. Open UGS jsDelivr wrappers directly in the player iframe rather than fetching them into `srcdoc`; their own document location and base URL are needed by games such as Crossy Road and Cookie Clicker. The player iframe also needs explicit `gamepad`, `fullscreen`, `autoplay`, and `pointer-lock` permissions for Unity/WebGL games. UGS Flash wrappers may contain a literal `$1` player placeholder, but direct loading should remain the default.

**Why:** GitHub Pages can lag behind the workspace and expose an index without companion game assets, while UGS keeps many large assets available on demand. Converting the wrapper into `srcdoc` changes its runtime location and breaks games that resolve assets or storage from their original document.

**How to apply:** Keep the Slim catalogue on-demand and small, map only verified UGS IDs, assign those URLs directly to the sandboxed iframe, and grant the iframe permissions Unity/WebGL needs. Keep Vice City and LittleBigPlanet as explicit non-UGS exceptions.