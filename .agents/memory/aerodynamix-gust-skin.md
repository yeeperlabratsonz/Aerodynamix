---
name: Branded self-contained browser variants
description: How to skin and optimize a large self-contained browser page without duplicating its engine
---

For a branded variant of a large self-contained browser export, keep the reference HTML immutable and transform it at the hosted route with a small CSS/behavior layer. Put essential first-paint branding and startup decisions in the server-rendered response, not only in a deferred external script.

**Why:** The browser engine can initialize its own defaults before a late skin script runs, and a visual check may capture the page before that script has loaded. Startup gates can also be restored by later engine initialization.

**How to apply:** Inject the variant marker before the engine scripts execute, patch the exact startup gate for the variant, server-render visible branding into the shell, and keep variant preferences in separate storage keys so the original browser remains independent.