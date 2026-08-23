---
name: Standalone page shells
description: Durable guidance for embedding full site pages into a single-file export
---

Embedded site pages should contribute their feature content and behavior, not a second full-page shell or navigation bar, when the host export already owns navigation.

**Why:** Two independently authored page shells can overlap, trap navigation state, and make adjacent views appear to be the same page.

**How to apply:** Keep one host-level header and view controller; strip embedded page headers/navs and wire only the embedded page’s feature content into the host view.