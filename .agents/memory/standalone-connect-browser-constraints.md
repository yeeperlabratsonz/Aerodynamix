---
name: Standalone Connect browser constraints
description: Browser-specific constraints for the inline Connect experience in downloadable Aerodynamix exports
---

Root-relative API media paths such as profile pictures and uploaded post images must be resolved against the live Render origin when Connect runs from a downloaded `file://` export. Browser-relative paths otherwise resolve to the local filesystem.

**Why:** A downloaded HTML file has no normal web origin, so paths returned by the API cannot load without explicit origin resolution.

**How to apply:** Keep one shared asset URL helper in the embedded Connect client and use it for every profile, badge, comment, and post image.

Chromebook Chrome cannot grant camera or microphone access to a downloaded `file://` page; WebRTC capture requires a secure HTTPS context.

**Why:** Browser security policy blocks `getUserMedia` on local file documents even when the user has not denied permission.

**How to apply:** Detect the insecure context and explain that video calls must be started from the HTTPS website version rather than presenting it as a missing permission prompt.