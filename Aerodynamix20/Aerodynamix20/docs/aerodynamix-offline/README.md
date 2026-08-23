# Aerodynamix Offline

This is the complete local bundle. It includes the standalone interface, the
real game source files, game assets, site artwork, and the Music Starter Pack.

## Recommended launch

Run `serve.py` with Python, then open:

<http://127.0.0.1:8000/>

Keeping the bundle on a local HTTP server is recommended because several
browser game engines use `fetch`, workers, or canvas resources that browsers
restrict when opened directly with `file://`.

The main `index.html` can also be opened directly for basic pages and
self-contained games.