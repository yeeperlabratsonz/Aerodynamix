---
name: Git storage recovery
description: Recovering large LFS-backed projects after interrupted restores or export builds exhaust the workspace quota.
---

For large LFS-backed projects, interrupted restores and export builds can leave temporary Git packs or unreachable loose objects that exhaust the workspace quota even when the filesystem reports free space. Preserve objects reachable from both the active history and the intended recovery commit, then remove only unreachable temporary objects before retrying Git operations. Avoid keeping duplicate versioned and unversioned generated exports when the server already resolves download routes to the versioned files.

**Why:** Large standalone HTML exports and LFS history can make a failed operation leave several gigabytes of temporary data, preventing even tiny ref-lock writes.

**How to apply:** Check `git count-objects`, locate `tmp*` Git objects, and build a reachable-object set that includes the intended recovery commit before deleting unreachable loose objects. Keep generated export aliases deduplicated.