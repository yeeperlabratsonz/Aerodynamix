---
name: Standalone auto-updates
description: Constraints for self-updating downloadable Aerodynamix HTML files opened from local file URLs.
---

Downloaded standalone HTML must bootstrap updates before the app parses, cache the newest HTML in IndexedDB, and replace the current document in memory; a local file cannot overwrite itself.

**Why:** Browser file permissions prevent an HTML file from replacing its own disk copy, while a late update layer cannot affect the next launch without an early cached-document bootstrap.

**How to apply:** Serve a direct no-cache manifest and downloadable HTML with `Access-Control-Allow-Origin: *`; keep ZIP/XZ as containers for the self-updating HTML, and use the hosted server rather than a stale static mirror as the update source.