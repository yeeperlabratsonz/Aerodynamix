---
name: Large download delivery
description: How to deliver the oversized standalone HTML exports through the workspace.
---

For standalone HTML exports larger than the attachment limit, provide compressed `.html.xz` assets and keep the uncompressed files available through the application’s direct download routes.

**Why:** The workspace asset attachment service rejects files over 100 MiB, while the Slim HTML exports are larger than that even though their compressed versions fit.

**How to apply:** Attach the compressed file with decompression instructions, and link users to the direct route when they need the ready-to-open uncompressed HTML.