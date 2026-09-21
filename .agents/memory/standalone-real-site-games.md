---
name: Standalone real-site games
description: Why downloadable Aerodynamix files should launch canonical published game directories instead of repacking game code.
---

For downloads that actually include game code, use a folder-based ZIP served by the included local HTTP launcher. Include the complete referenced game packages, not just index pages or hosted URLs. Keep the older single-HTML export distinct from this portable distribution.

**Why:** Hosted URLs still failed for the user. Complex games need workers, WASM, Unity data, Ruffle assets, storage, and relative dependencies. A plain downloaded HTML file cannot reliably provide this environment. Recovered real-site packages also contained incomplete dependencies and broken runtime code; a successful HTTP response or an existing canvas is not proof of playability.

**How to apply:** Use local HTTP paths for packaged games and preserve dependency trees. Test actual menus or runtime initialization in a browser. Share one matching Ruffle bundle in the portable archive rather than duplicating it for every Flash game. Do not reintroduce Blob/srcdoc packaging for complex games. Keep untrusted custom imports on an opaque sandbox origin.