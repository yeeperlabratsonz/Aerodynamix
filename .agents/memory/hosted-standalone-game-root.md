---
name: Hosted standalone game root
description: The GitHub Pages deployment path required by Slim game URLs.
---

Slim game URLs copied from the Aerodynamix repository must include `/Aerodynamix/Aerodynamix20/Aerodynamix20/docs/`; the repository root only redirects there.

**Why:** The shorter repository paths return GitHub Pages 404 responses even though the same game folders are published successfully under `docs`.

**How to apply:** When changing the Slim export host or adding hosted game paths, validate the exact published URL rather than assuming the repository root is the site root.