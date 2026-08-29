---
name: Ruffle self-hosted bundles
description: The asset requirements of Ruffle web self-hosted builds used by local Flash game pages.
---

Ruffle web self-hosted builds are code-split: the main loader is not sufficient by itself. Its matching core JavaScript chunks and hashed WASM files must be available at the loader's resolved public path.

**Why:** When a chunk is missing, Ruffle reports a `ChunkLoadError`, then surfaces a misleading WASM initialization failure even when the WASM files themselves are present.

**How to apply:** Keep the exact release-matched chunk and WASM filenames together with each loader, or configure a shared public path for the complete matching asset set. Do not mix assets from different Ruffle releases.