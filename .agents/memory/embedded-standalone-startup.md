---
name: Embedded standalone startup
description: Startup rules for large single-file exports with built-in game documents.
---

Store large embedded game documents as inert, individually compressed payloads and inflate only the selected game. Keep lightweight metadata and compact cover art available for initial rendering.

**Why:** Compiling or inflating the complete catalog during startup made a large local HTML file unusably slow. Self-observing DOM synchronization also caused permanent renderer CPU loops.

**How to apply:** Keep payload text out of executable JavaScript, initialize the shell before payload tags, and ensure MutationObserver callbacks do not write unchanged values or observe mutations they continuously create.