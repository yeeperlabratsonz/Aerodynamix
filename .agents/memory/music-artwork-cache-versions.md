---
name: Music artwork cache versions
description: How standalone music catalog changes invalidate locally cached album artwork.
---

Album artwork and catalog metadata changes must advance the shared music catalog version. Cover cache keys include that version, allowing existing standalone browsers to fetch corrected artwork without deleting the whole offline music library.

**Why:** Standalone Music persists covers in IndexedDB, so keeping the same catalog version can make a corrected server catalog appear unchanged to returning users.

**How to apply:** When correcting a cover or album label in the shared catalog, bump its version and keep audio cache keys stable so users do not have to redownload audio.