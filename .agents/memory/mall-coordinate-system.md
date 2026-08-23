---
name: Mall coordinate system
description: Coordinate-system and optimization constraints for the imported abandoned mall asset.
---

The abandoned mall GLB is already Y-up, with playable floor geometry around Y=0 and its existing spawn positions expressed as X/Z coordinates. Do not rotate it around X; doing so turns the floor into a wall and places gameplay in the void.

**Why:** The source model’s bounds and recorded gameplay video showed that applying a Z-up-to-Y-up conversion was incorrect for this asset.

**How to apply:** Keep the mall map rotation at zero, update its world matrix after attaching it to the scene, use its known flat ground level and playable X/Z bounds instead of per-frame full-mesh raycasts, and preserve Meshopt decoding when using the optimized GLB.