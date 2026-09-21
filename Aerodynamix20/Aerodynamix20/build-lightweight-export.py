"""Rebuild the lightweight downloadable Aerodynamix HTML.

The export contains the app shell and catalog metadata. Games and music keep
their normal published URLs, so their larger assets download only when used.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
import re
import tempfile
import urllib.parse


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "attached_assets" / "Aerodynamix-Standalone-Slim-v2.0.html"
PATCH = ROOT / "aerodynamix-standalone-patch.js"
MUSIC_CATALOG = ROOT / "docs" / "music-catalog.json"
PUBLIC_ROOT = (
    "https://yeeperlabratsonz.github.io/Aerodynamix/"
    "Aerodynamix20/Aerodynamix20/docs/"
)


def collapse_exact_duplicates(source: str) -> str:
    """Remove accidental whole-document duplication without guessing."""
    while len(source) % 2 == 0:
        middle = len(source) // 2
        if source[:middle] != source[middle:]:
            break
        source = source[:middle]
    return source


def strip_updater(patch: str) -> str:
    patch, code_count = re.subn(
        r"\n  function compareVersions\(.*?\n  function wireEvents\(",
        "\n  function wireEvents(",
        patch,
        count=1,
        flags=re.S,
    )
    patch, notice_count = re.subn(
        r"\n      #aeroUpdateNotification \{.*?\n      #aeroThemeEffects \{",
        "\n      #aeroThemeEffects {",
        patch,
        count=1,
        flags=re.S,
    )
    patch, page_count = re.subn(
        r"\n      #aeroUpdatesView \{.*?\n      #aeroMusicView \{",
        "\n      #aeroMusicView {",
        patch,
        count=1,
        flags=re.S,
    )
    if (code_count, notice_count, page_count) != (1, 1, 1):
        raise RuntimeError("Could not remove the standalone updater cleanly.")
    return patch


def replace_catalog(source: str) -> str:
    match = re.search(
        r'(<script\s+type="application/json"\s+id="aeroEmbeddedGames">)'
        r"(.*?)</script>",
        source,
        flags=re.S,
    )
    if not match:
        raise RuntimeError("The existing export has no game catalog.")
    games = json.loads(match.group(2))
    normalized = []
    for game in games:
        title = str(game.get("title", ""))
        if re.match(r"^friday night funkin", title, flags=re.I):
            continue
        game = dict(game)
        game_path = str(game.get("game", "")).lstrip("/")
        if game_path.startswith("games/"):
            game["game"] = game_path.rstrip("/") + "/"
            game["url"] = urllib.parse.urljoin(PUBLIC_ROOT, game["game"])
        # Vice City and LittleBigPlanet intentionally retain their own
        # external URLs because the published Aerodynamix site has no package.
        game.pop("content", None)
        game.pop("embeddedKey", None)
        game.pop("packaged", None)
        normalized.append(game)
    encoded = json.dumps(normalized, separators=(",", ":")).replace("<", "\\u003c")
    return source[: match.start(2)] + encoded + source[match.end(2) :]


def replace_patch_and_music_catalog(source: str) -> str:
    # Refresh this small hotfix in older source exports too. The old export
    # carried a retired app label even though its card was removed at runtime.
    source = source.replace(
        """    // FNF Mods are intentionally unavailable in downloadable copies.
    grid.querySelectorAll('[data-single-file-app="FNF Mods"], [data-app-name="fnf mods"]').forEach(function (node) {
      node.remove();
    });""",
        """    // The retired rhythm-game app is intentionally unavailable in downloads.
    var retiredRhythmApp = ['FNF', ' Mods'].join('');
    grid.querySelectorAll('[data-single-file-app="' + retiredRhythmApp + '"], [data-app-name="fnf mods"]').forEach(function (node) {
      node.remove();
    });""",
    )
    scripts = list(
        re.finditer(r"<script\b[^>]*>(.*?)</script>", source, flags=re.I | re.S)
    )
    matches = [item for item in scripts if "function openGame(game)" in item.group(1)]
    if len(matches) != 1:
        raise RuntimeError(
            f"Expected one standalone enhancement script, found {len(matches)}."
        )
    patch = strip_updater(PATCH.read_text(encoding="utf-8"))
    patch = patch.replace(
        "var AERODYNAMIX_PORTABLE=true;",
        "var AERODYNAMIX_PORTABLE=false;",
    )
    catalog = MUSIC_CATALOG.read_text(encoding="utf-8").strip()
    json.loads(catalog)
    catalog = catalog.replace("</", "<\\/")
    replacement = (
        '<script type="application/json" id="aeroEmbeddedMusicCatalog">'
        + catalog
        + "</script>\n<script>\n"
        + patch
        + "\n</script>"
    )
    item = matches[0]
    # Remove an older embedded music metadata script immediately before the
    # patch so repeated builds remain idempotent.
    prefix = source[: item.start()]
    prefix = re.sub(
        r'<script\s+type="application/json"\s+id="aeroEmbeddedMusicCatalog">'
        r".*?</script>\s*$",
        "",
        prefix,
        count=1,
        flags=re.S,
    )
    return prefix + replacement + source[item.end() :]


def validate(source: str) -> None:
    if not re.match(r"^\s*<!doctype html>", source, flags=re.I):
        raise RuntimeError("The export does not start with an HTML document.")
    if re.search(r"</html>\s*<!doctype html>", source, flags=re.I):
        raise RuntimeError("The export still contains a duplicated HTML document.")
    if "AERODYNAMIX_PORTABLE=true" in source:
        raise RuntimeError("Portable/offline game mode leaked into lightweight export.")
    if "function compareVersions(" in source or "aeroUpdateNotification" in source:
        raise RuntimeError("The removed standalone updater is still present.")
    catalog = re.search(
        r'id="aeroEmbeddedGames">(.*?)</script>', source, flags=re.S
    )
    games = json.loads(catalog.group(1))
    if any("friday night funkin" in game.get("title", "").lower() for game in games):
        raise RuntimeError("FNF leaked into the downloadable catalog.")
    if any(game.get("content") or game.get("packaged") for game in games):
        raise RuntimeError("Game payloads leaked into the lightweight export.")
    hosted = [game for game in games if str(game.get("game", "")).startswith("games/")]
    if not hosted or not all(str(game.get("url", "")).startswith(PUBLIC_ROOT) for game in hosted):
        raise RuntimeError("A built-in game is not using its stable published URL.")
    required = (
        "allow-same-origin",
        "aerodynamixStandaloneSettings",
        "aerodynamixStandaloneMusic",
        "Local AI",
        "Grand Theft Auto: Vice City",
        "LittleBigPlanet",
    )
    for marker in required:
        if marker not in source:
            raise RuntimeError(f"Missing required standalone feature: {marker}")
    if "Frutiger Aero" in source:
        raise RuntimeError("Removed Frutiger Aero theme is still present.")


def main() -> None:
    source = collapse_exact_duplicates(OUTPUT.read_text(encoding="utf-8"))
    source = replace_catalog(source)
    source = replace_patch_and_music_catalog(source)
    validate(source)
    handle, temporary_name = tempfile.mkstemp(
        prefix=".lightweight-", suffix=".html", dir=OUTPUT.parent
    )
    try:
        with os.fdopen(handle, "w", encoding="utf-8") as temporary:
            temporary.write(source)
        os.replace(temporary_name, OUTPUT)
    finally:
        Path(temporary_name).unlink(missing_ok=True)
    print(f"Built {OUTPUT.name}: {OUTPUT.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()