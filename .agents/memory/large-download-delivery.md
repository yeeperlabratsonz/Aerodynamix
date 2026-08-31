---
name: Large download delivery
description: How to deliver the oversized standalone HTML exports through the workspace.
---

For standalone HTML exports larger than the attachment limit, provide compressed `.html.xz` assets and keep the uncompressed files available through the application’s direct download routes.

**Why:** The workspace asset attachment service rejects files over 100 MiB, while the Slim HTML exports are larger than that even though their compressed versions fit.

**How to apply:** Attach the compressed file with decompression instructions, and link users to the direct route when they need the ready-to-open uncompressed HTML.

For paired Normal/Dev exports, generate Dev files from the Normal file using copy-on-write cloning and an in-place marker update before appending the small Dev layer.

**Why:** Keeping two physically duplicated 700+ MiB HTML files can exhaust the workspace quota during archive generation even when the filesystem reports free space.

**How to apply:** Keep the files as separate named deliverables, but use a reflink-capable clone in the maintained builder and validate the resulting marker, ZIP member, and XZ hash independently.