# Publish Aerodynamix on GitHub Pages

The site is already a static HTML/CSS/JavaScript app, so GitHub Pages can host
the `docs/` folder without a build step.

## One-time GitHub setup

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` (or `master`) and folder `/ (root)`.
5. Click **Save**.

The root `index.html` redirects GitHub Pages to the actual site at
`Aerodynamix20/Aerodynamix20/docs/`. A second redirect is also present in
`docs/index.html`, so selecting `/docs` will still reach the site.

If you want the cleanest URL and folder layout later, move the contents of
`Aerodynamix20/Aerodynamix20/` to the repository root. This redirect setup
does not require that larger file move.

## Important limitation

GitHub Pages only serves static files. The games and other static pages work,
but features that require the Flask server, database, sessions, or WebRTC
signaling (such as account data, discs persistence, shop purchases, and
social features) need the existing Python server deployed separately.