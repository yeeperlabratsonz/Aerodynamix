# Aerodynamix

A browser-based game arcade with a Frutiger Aero aesthetic. Hosts browser games including Run 3, Slope, Minecraft, PvZ, Hobo series, Fruit Ninja, and more. Includes a music player and social features (profiles, friends, DMs, WebRTC calls).

## Stack

- **Backend:** Python/Flask (`server.py`) — REST API + serves static frontend from `docs/`
- **Database:** SQLite (local: `dynamix.db`) / PostgreSQL (production via `DATABASE_URL`)
- **Frontend:** Plain HTML/CSS/JS in `docs/` — no build step
- **ORM:** SQLAlchemy

## How to run

```
python server.py
```

Serves on port 5000. The `SESSION_SECRET` environment variable is used for Flask session signing.

## Authorized custom domains

The app is designed to serve from its current request origin. First-party API
calls use relative paths, and `docs/runtime-origin.js` exposes
`DynamixOrigin.sameOriginUrl()`, `DynamixOrigin.apiUrl()`, and
`DynamixOrigin.websocketUrl()` for code that needs an absolute URL.

If an approved external frontend needs credentialed cross-origin API access,
set `ALLOWED_CORS_ORIGINS` to a comma-separated list of complete origins, for
example:

```
ALLOWED_CORS_ORIGINS=https://app.example.com,https://dashboard.example.com
```

Do not use `*` with credentialed requests. Same-origin browser traffic does not
need this setting.

## Access

The basic arcade experience loads by default. The existing alternate access path remains
available internally, but normal visitors do not need to enter a key.

## Key files

- `docs/index.html` — main game listing page
- `docs/game-frame.html` — game iframe wrapper
- `docs/auth-overlay.js` — default access bootstrap and retained alternate access path
- `docs/script.js` — main site logic
- `docs/main.css` — global styles
- `docs/games/` — self-hosted game directories
- `docs/dynamix-connect.html` — social/friends hub
- `attached_assets/` — additional game HTML files (also served under `docs/attached_assets/`)

## User preferences
