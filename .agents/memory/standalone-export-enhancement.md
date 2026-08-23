---
name: Standalone export enhancement
description: How to maintain very large self-contained exports without repeatedly rewriting their embedded payloads.
---

Keep a giant standalone export immutable and maintain improvements in a small end-of-document enhancement layer. Inline that layer only while producing the downloadable artifact.

**Why:** Direct edits to exports dominated by huge inline thumbnails and game payloads are slow and fragile, while duplicating the embedded manifest can create severe browser memory pressure.

**How to apply:** Stream the source with a small external script for hosted preview, then inject the same script text immediately before the closing body tag for the final one-file download. Reuse the already-loaded manifest from page scope. For authenticated online pages, let a downloaded file open the configured secure server in an iframe so the existing client retains its same-origin session and signaling behavior; inline a maintained source snapshot for same-origin packaged use.