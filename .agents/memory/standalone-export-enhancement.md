---
name: Standalone export enhancement
description: How to maintain very large self-contained exports without repeatedly rewriting their embedded payloads.
---

Keep a giant standalone export immutable and maintain improvements in a small end-of-document enhancement layer. Inline that layer only while producing the downloadable artifact.

**Why:** Direct edits to exports dominated by huge inline thumbnails and game payloads are slow and fragile, while duplicating the embedded manifest can create severe browser memory pressure.

**How to apply:** Stream the source with a small external script for hosted preview, then inject the same script text immediately before the closing body tag for the final one-file download. Reuse the already-loaded manifest from page scope. For authenticated online pages, let a downloaded file open the configured secure server in an iframe so the existing client retains its same-origin session and signaling behavior; inline a maintained source snapshot for same-origin packaged use.

Avoid routine full in-memory regeneration of the multi-hundred-megabyte editions. Validate the maintained client and `build_connect_assets()` independently, then use a streaming packaging path and verify every generated edition still ends with a complete HTML document.

**Why:** A complete rebuild can be killed by memory pressure even when the maintained source and exporter are valid, and a partially written large output is harder to diagnose than a failed small validation.

**How to apply:** Treat the source client and exporter as the primary change surface. Only refresh generated HTML/ZIP/XZ assets with a memory-bounded builder, and check the output tail plus embedded client marker before publishing downloads.

When embedding complete HTML documents inside an injected JavaScript string, encode `<` as a JavaScript Unicode escape before inserting the string. Otherwise a nested `</script>` closes the outer packaging script during HTML parsing and exposes escaped source text in the rendered page.

**Why:** Embedded Local AI and app documents contain their own script tags; raw closing tags caused the standalone browser to render literal `\n` sequences and page fragments.

**How to apply:** Escape the document at packaging time, then let JavaScript decode it back to normal markup at runtime before assigning it to `iframe.srcdoc`.