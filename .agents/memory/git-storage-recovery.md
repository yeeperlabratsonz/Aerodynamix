---
name: Git storage recovery
description: Recovering large LFS-backed projects after interrupted restores or export builds exhaust the workspace quota.
---

For large LFS-backed projects, interrupted restores and export builds can leave temporary Git packs or unreachable loose objects that exhaust the workspace quota even when the filesystem reports free space. Reading LFS-backed game assets during a standalone build can also recreate a large `.git/lfs/tmp` file; remove only those temporary LFS files before retrying the final output write. Preserve objects reachable from both the active history and the intended recovery commit, then remove only unreachable temporary objects before retrying Git operations. If a restored LFS path is still a tiny pointer after checkout, fetch that exact object from the reachable remote before rebuilding. Avoid keeping duplicate versioned and unversioned generated exports when the server already resolves download routes to the versioned files.

**Why:** Large standalone HTML exports and LFS history can make a failed operation leave several gigabytes of temporary data, preventing even tiny ref-lock writes.

**How to apply:** Check `git count-objects`, `.git/lfs/tmp`, and other `tmp*` Git objects. Clearing `.git/lfs/tmp` is safe between failed build attempts; use a reachable-object set before deleting any loose object elsewhere. Keep generated export aliases deduplicated.

For LFS cleanup, preserve pointer targets reachable through all refs, reflogs, the index, and working files—not just the current branch. Delete only unreferenced local LFS objects unless the user separately approves losing historical exports.

**Why:** Historical standalone builds can dominate disk usage even after their visible files are deleted. Clearing temporary files alone does not address this, while deleting the whole LFS cache can destroy the only recoverable historical copies.

Historical generated downloads are disposable when the user approves their removal; current downloads and site/game source recovery data are not. Some historical export LFS pointers may consequently have no local payload.

**Why:** The user explicitly approved sacrificing old generated download copies to recover disk space. A valid Git connectivity check does not imply that those old LFS exports can still be restored.

**How to apply:** Do not automatically fetch all historical export payloads during maintenance. Protect current worktree content by hash and keep non-export LFS targets when selecting old generated payloads for removal.