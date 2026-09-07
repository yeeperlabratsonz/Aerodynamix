---
name: GitHub large-file pushes
description: Constraints and handling for pushing generated standalone exports through the connected GitHub integration.
---

The connected GitHub REST path cannot reliably upload large Git blobs, and GitHub rejects repository files over its normal size limit. A `.gitattributes` LFS rule does not convert blobs that were already committed.

**Why:** Generated standalone exports were committed as full blobs, causing normal pushes to time out and REST blob creation to fail before the branch update.

**How to apply:** Keep generated standalone exports out of ordinary application history unless a real Git LFS-capable Git transport is available. For a pending local-only history, rewrite only the unpushed commits, preserve the export files locally as ignored files, and push the source/application changes separately.