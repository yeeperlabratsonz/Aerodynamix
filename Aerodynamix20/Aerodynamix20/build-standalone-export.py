"""Build the downloadable Aerodynamix standalone HTML and ZIP.

The hosted preview streams the original export plus the maintainable patch. This
builder produces the portable equivalent by inlining the patch and the Connect
page itself. Connect API requests still go to the live Aerodynamix service.
"""

from pathlib import Path
import base64
import hashlib
import json
import re
import zipfile
import lzma
import mimetypes
import posixpath
import os
import shutil
import subprocess
import urllib.parse
import zlib


PROJECT_ROOT = Path(__file__).resolve().parent
WORKSPACE_ROOT = PROJECT_ROOT.parents[1]
SOURCE_EXPORT = WORKSPACE_ROOT / "attached_assets" / "presentation_1787450952428.html"
OUTPUT_DIR = Path(os.environ.get("AERO_OUTPUT_DIR", PROJECT_ROOT / "attached_assets"))
VARIANT = "slim" if os.environ.get("AERO_SLIM") else "full"
VARIANT_SUFFIX = "-Slim" if VARIANT == "slim" else ""
RELEASE_VERSION = "2.0"
VERSION_SUFFIX = f"-v{RELEASE_VERSION}"
OUTPUT_HTML = OUTPUT_DIR / f"Aerodynamix-Standalone{VARIANT_SUFFIX}{VERSION_SUFFIX}.html"
OUTPUT_ZIP = OUTPUT_DIR / f"Aerodynamix-Standalone{VARIANT_SUFFIX}{VERSION_SUFFIX}.zip"
OUTPUT_XZ = OUTPUT_DIR / f"Aerodynamix-Standalone{VARIANT_SUFFIX}{VERSION_SUFFIX}.html.xz"


CONNECT_ORIGIN = "https://aerodynamix20.onrender.com"
DEFAULT_PUBLIC_ROOT = "https://yeeperlabratsonz.github.io/Aerodynamix/Aerodynamix20/Aerodynamix20/docs/"


def data_uri(filename: str, mime: str) -> str:
    asset = PROJECT_ROOT / "attached_assets" / filename
    if not asset.exists():
        raise RuntimeError(f"Missing bundled media asset: {asset}")
    encoded = base64.b64encode(asset.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def file_data_uri(path: Path, mime: str) -> str:
    if not path.exists():
        raise RuntimeError(f"Missing bundled media asset: {path}")
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def compact_thumbnail(value: str) -> str:
    """Shrink embedded cover art without making standalone files use the network."""
    match = re.fullmatch(r"data:image/[^;,]+;base64,(.+)", value, flags=re.S)
    if not match:
        return value
    original = base64.b64decode(match.group(1))
    if len(original) < 40_000:
        return value
    converted = subprocess.run(
        [
            "magick", "-", "-auto-orient", "-thumbnail", "320x180>",
            "-strip", "-quality", "68", "webp:-",
        ],
        input=original,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if converted.returncode or not converted.stdout:
        raise RuntimeError(
            "Could not compact embedded game artwork: "
            + converted.stderr.decode("utf-8", errors="replace")
        )
    return "data:image/webp;base64," + base64.b64encode(converted.stdout).decode("ascii")


def standalone_hotfix() -> str:
    """Inline the file-only games and app pages into the generated export."""
    hotfix = (PROJECT_ROOT / "aerodynamix-single-file-hotfix.js").read_text(
        encoding="utf-8"
    )

    def embedded_html(path: Path, strip_host_shell: bool = False) -> str:
        markup = path.read_text(encoding="utf-8")
        # srcdoc has an about:blank base URL. Point page assets at the public
        # docs directory so the embedded catalogue still has its own styling
        # and images without copying the whole docs tree into the export.
        markup = markup.replace(
            "<head>",
            f'<head><base href="{DEFAULT_PUBLIC_ROOT}">',
            1,
        )
        if strip_host_shell:
            markup = re.sub(r"<nav\b[^>]*>.*?</nav>", "", markup, flags=re.I | re.S)
            for script_name in (
                "theme.js", "tab-cloak.js", "discs.js", "auth-overlay.js",
                "mobile-nav.js", "music-player.js", "bubble-overlay.js",
                "snow-overlay.js",
            ):
                markup = re.sub(
                    rf"<script\b[^>]*\bsrc=[\"'][^\"']*{re.escape(script_name)}[^\"']*[\"'][^>]*>\s*</script>",
                    "",
                    markup,
                    flags=re.I | re.S,
                )
            markup = markup.replace(
                "game-frame.html?game=${encodeURIComponent(game.url)}",
                "${game.url}",
            )
        return markup

    replacements = {
        "__AERO_LOCAL_AI_HTML__": embedded_html(
            PROJECT_ROOT / "docs" / "aerodynamix-offline" / "local-ai.html",
            strip_host_shell=True,
        ),
    }
    for placeholder, value in replacements.items():
        # The hotfix itself lives inside a script tag. Escape less-than signs
        # in embedded documents so a nested </script> cannot terminate that
        # outer script before the browser evaluates the string.
        encoded_value = json.dumps(value).replace("<", "\\u003c")
        hotfix = hotfix.replace("'" + placeholder + "'", encoded_value)
    if "__AERO_" in hotfix:
        raise RuntimeError("Standalone hotfix still has unresolved placeholders.")
    return hotfix


def make_slim_catalogue(source: str) -> str:
    """Point the download at the same local game packages as the real site."""
    marker = "const GAMES="
    start = source.find(marker)
    end = source.find("];", start)
    if start < 0 or end < 0:
        raise RuntimeError("The standalone source has no GAMES catalogue.")
    catalogue_start = start + len(marker)
    catalogue = json.loads(source[catalogue_start:end + 1])
    catalogue = [
        game for game in catalogue
        if not re.match(r"^friday night funkin", str(game.get("title", "")), flags=re.I)
    ]
    compact_name = lambda value: re.sub(r"[^a-z0-9]", "", value.lower())
    game_directories = {
        compact_name(path.name): path.name
        for path in (PROJECT_ROOT / "docs" / "games").iterdir()
        if path.is_dir()
    }
    missing = []
    for game in catalogue:
        game_path = str(game.get("game", ""))
        if game_path.startswith("games/"):
            relative = game_path[len("games/"):].strip("/")
        else:
            relative = game_directories.get(compact_name(str(game.get("title", ""))), "")
        if not relative:
            if game.get("url"):
                game.pop("content", None)
                continue
            missing.append(str(game.get("title", "Untitled")))
            continue
        game["game"] = f"games/{relative}/"
        game["url"] = urllib.parse.urljoin(DEFAULT_PUBLIC_ROOT, game["game"])
        game.pop("content", None)
        game.pop("embeddedKey", None)
        if game.get("thumb"):
            game["thumb"] = compact_thumbnail(str(game["thumb"]))
    if missing:
        raise RuntimeError(
            "The standalone catalogue has no real-site package for: "
            + ", ".join(missing)
        )
    metadata = json.dumps(catalogue, separators=(",", ":")).replace("<", "\\u003c")
    script_end = source.find("</script>", end)
    if script_end < 0:
        raise RuntimeError("The standalone catalogue script has no closing tag.")
    inert_catalogue = (
        '<script type="application/json" id="aeroEmbeddedGames">'
        + metadata
        + "</script>"
    )
    # Keep the original global name for legacy code, but do not make the
    # browser compile the entire embedded game library as JavaScript.
    updated_source = (
        source[:start]
        + "var GAMES=[];"
        + source[end + 1:script_end + len("</script>")]
        + inert_catalogue
        + source[script_end + len("</script>"):]
    )
    return updated_source


def bundle_catalogue_games(source: str, max_game_bytes: int = 1024 * 1024) -> str:
    """Embed hosted game folders and rewrite their local dependencies.

    The catalogue's HTML files often load large Unity/WASM/SWF assets through
    relative URLs. A single-file export has no directory beside it, so those
    URLs must become data URLs before the game HTML is embedded.
    """
    marker = "const GAMES="
    start = source.find(marker)
    end = source.find("];", start)
    if start < 0 or end < 0:
        raise RuntimeError("The standalone source has no GAMES catalogue.")
    catalogue_start = start + len(marker)
    catalogue = json.loads(source[catalogue_start:end + 1])

    def uri(path: Path) -> str:
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        return "data:" + mime + ";base64," + base64.b64encode(path.read_bytes()).decode("ascii")

    def replace_paths(text: str, replacements: dict[str, str]) -> str:
        """Replace paths without recursively rewriting inserted data URLs."""
        ordered = sorted(replacements.items(), key=lambda item: len(item[0]), reverse=True)
        tokens = {}
        for index, (needle, value) in enumerate(ordered):
            token = f"__AERO_BUNDLE_PATH_{index:05d}__"
            text = text.replace(needle, token)
            tokens[token] = value
        for token, value in tokens.items():
            text = text.replace(token, value)
        return text

    def flatten_nested_scripts(html: str) -> str:
        """Remove a redundant base64 layer from embedded JavaScript files."""
        pattern = re.compile(
            r"<script(?P<attrs>[^>]*?)\s+src=[\"']data:"
            r"(?:text/javascript|application/javascript);base64,"
            r"(?P<payload>[A-Za-z0-9+/=]+)[\"'](?P<rest>[^>]*)></script>",
            flags=re.IGNORECASE | re.DOTALL,
        )

        def inline(match: re.Match[str]) -> str:
            try:
                script = base64.b64decode(match.group("payload")).decode("utf-8")
            except (ValueError, UnicodeDecodeError):
                return match.group(0)
            # Prevent an embedded string from prematurely closing the wrapper
            # script element.
            script = re.sub(r"</script", r"<\\/script", script, flags=re.IGNORECASE)
            attrs = re.sub(r"\s+src=[\"'][^\"']*[\"']", "", match.group("attrs"), flags=re.IGNORECASE)
            return "<script" + attrs + match.group("rest") + ">\n" + script + "\n</script>"

        return pattern.sub(inline, html)

    def compact_name(value: str) -> str:
        return re.sub(r"[^a-z0-9]", "", value.lower())

    game_directories = {
        compact_name(path.name): path
        for path in (PROJECT_ROOT / "docs" / "games").iterdir()
        if path.is_dir()
    }

    for game in catalogue:
        game_path = str(game.get("game", ""))
        if game_path.startswith("games/"):
            relative = game_path[len("games/"):].strip("/")
            game_root = PROJECT_ROOT / "docs" / "games" / relative
        else:
            # Older catalogue entries point to a small wrapper in
            # attached_assets, while the actual downloadable game folder is
            # named after the catalogue title.
            game_root = game_directories.get(compact_name(str(game.get("title", ""))))
            if not game_root:
                continue
        if game_root.is_file():
            index_file = game_root
            game_root = game_root.parent
        else:
            index_file = game_root / "index.html"
        if not index_file.exists():
            continue

        files = [path for path in game_root.rglob("*") if path.is_file()]
        if sum(path.stat().st_size for path in files) > max_game_bytes:
            continue
        raw_uris = {}
        for path in files:
            rel = path.relative_to(game_root).as_posix()
            value = uri(path)
            raw_uris[rel] = value

        bundled_uris = {}
        for path in files:
            rel = path.relative_to(game_root).as_posix()
            bundled_uris[rel] = raw_uris[rel]
        html = index_file.read_text(encoding="utf-8", errors="replace")
        # Flash wrappers commonly declare the same SWF in both an object
        # param and an embed tag. Ruffle can use the object param, and keeping
        # both would duplicate multi-megabyte SWFs in the single-file export.
        if re.search(r"<object\b", html, flags=re.IGNORECASE):
            html = re.sub(r"<embed\b[^>]*>\s*", "", html, flags=re.IGNORECASE)
        if compact_name(str(game.get("title", ""))) == "adventurecapitalist":
            # This legacy Unity wrapper embeds webgl.js once as a script and
            # once again in an obsolete Math.fround fallback XHR branch.
            html = re.sub(
                r"<script>\s*if\s*\(!\(!Math\.fround\)\).*?</script>",
                '<script>var script = document.createElement("script"); script.src = "Release/webgl.js"; document.body.appendChild(script);</script>',
                html,
                count=1,
                flags=re.IGNORECASE | re.DOTALL,
            )
        parent = posixpath.dirname(index_file.relative_to(game_root).as_posix()) or "."
        replacements = {}
        for target, value in bundled_uris.items():
            if target == index_file.relative_to(game_root).as_posix():
                continue
            local = posixpath.relpath(target, parent)
            replacements[local] = value
            replacements["./" + local] = value
            replacements["/" + target] = value
            replacements[target] = value
        html = replace_paths(html, replacements)

        def rewrite_nested_data_url(match: re.Match[str]) -> str:
            mime = match.group("mime")
            try:
                decoded = base64.b64decode(match.group("payload")).decode("utf-8")
            except (ValueError, UnicodeDecodeError):
                return match.group(0)
            nested = {}
            for target, value in bundled_uris.items():
                if mime == "application/javascript" and Path(target).suffix.lower() in {
                    ".js", ".mjs", ".html", ".htm", ".css", ".json"
                }:
                    continue
                nested[target] = value
                nested["./" + target] = value
            if mime == "application/javascript" and (
                "RufflePlayer" in decoded or "Ruffle" in decoded
            ):
                return match.group(0)
            decoded = replace_paths(decoded, nested)
            return (
                "data:" + mime + ";base64," +
                base64.b64encode(decoded.encode("utf-8")).decode("ascii")
            )

        html = re.sub(
            r"data:(?P<mime>application/(?:json|javascript)|text/javascript);base64,(?P<payload>[A-Za-z0-9+/=]+)",
            rewrite_nested_data_url,
            html,
        )
        html = flatten_nested_scripts(html)
        game["content"] = "data:text/html;base64," + base64.b64encode(
            html.encode("utf-8")
        ).decode("ascii")

    updated = json.dumps(catalogue, separators=(",", ":"))
    return source[:catalogue_start] + updated + source[end + 1:]


def add_requested_games(source: str) -> str:
    """Restore hosted games that were added after the original file export."""
    marker = "const GAMES="
    start = source.find(marker)
    end = source.find("];", start)
    if start < 0 or end < 0:
        raise RuntimeError("The standalone source has no GAMES catalogue.")
    catalogue_start = start + len(marker)
    catalogue = json.loads(source[catalogue_start:end + 1])
    existing = {str(game.get("title", "")).lower() for game in catalogue}
    additions = (
        (
            "Grand Theft Auto: Vice City",
            PROJECT_ROOT / "attached_assets" / "vicecity_1788678084299.html",
            PROJECT_ROOT / "attached_assets" / "vice_1788678166601.webp",
        ),
        (
            "LittleBigPlanet",
            PROJECT_ROOT / "attached_assets" / "lbp_1788679870225.html",
            PROJECT_ROOT / "attached_assets" / "lbp_1788679892555.png",
        ),
    )
    for title, html_path, thumb_path in additions:
        if title.lower() in existing:
            continue
        html = html_path.read_text(encoding="utf-8")
        iframe = re.search(r'<iframe\b[^>]*\bsrc=["\']([^"\']+)', html, flags=re.I)
        if not iframe:
            raise RuntimeError(f"{title} wrapper has no hosted game URL.")
        mime = mimetypes.guess_type(thumb_path.name)[0] or "image/png"
        catalogue.append({
            "title": title,
            "thumb": file_data_uri(thumb_path, mime),
            "url": iframe.group(1),
        })
    updated = json.dumps(catalogue, separators=(",", ":"))
    return source[:catalogue_start] + updated + source[end + 1:]


def build_connect_assets() -> tuple[str, str]:
    docs = PROJECT_ROOT / "docs"
    document = (docs / "dynamix-connect.html").read_text(encoding="utf-8")
    styles = (docs / "dynamix-connect.css").read_text(encoding="utf-8")
    client = (docs / "dynamix-connect.js").read_text(encoding="utf-8")

    body = re.search(r"<body[^>]*>(.*?)</body>", document, flags=re.DOTALL | re.IGNORECASE)
    if not body:
        raise RuntimeError("The Connect document has no body.")

    # The standalone owns navigation. Keep only the real Connect page content.
    markup = body.group(1)
    markup = re.sub(r"\s*<nav>.*?</nav>", "", markup, count=1, flags=re.DOTALL | re.IGNORECASE)
    disc_path = docs / "images" / "disc.png"
    if disc_path.exists():
        disc_uri = (
            "data:image/png;base64,"
            + base64.b64encode(disc_path.read_bytes()).decode("ascii")
        )
        markup = markup.replace("images/disc.png", disc_uri)
    styles = styles.replace("body.dc-embedded nav", ".aero-connect-page nav")
    styles = styles.replace("body.dc-embedded .dc-container", ".aero-connect-page .dc-container")
    styles += "\n.aero-connect-page nav { display: none !important; }\n"

    # Run the maintained client against the Render API while mounting it inside
    # the standalone document instead of giving it a remote browsing context.
    client = re.sub(
        r"\s*document\.body\.classList\.toggle\(.*?\);\s*",
        "\n",
        client,
        count=1,
        flags=re.DOTALL,
    )
    client = client.replace(
        "\n  // ── Session check ───────────────────────────────────────────────────────────\n",
        "\n"
        "  window.AERO_CONNECT_ORIGIN = " + repr(CONNECT_ORIGIN) + ";\n"
        "  window.AERO_CONNECT_PROXY = " + repr(CONNECT_ORIGIN + "/api/connect-proxy") + ";\n"
        "\n"
        "  // ── Session check ───────────────────────────────────────────────────────────\n",
        1,
    )
    return markup, styles, client


def build_app_assets() -> tuple[str, str, str, str, str]:
    docs = PROJECT_ROOT / "docs"

    def main_markup(filename: str) -> str:
        document = (docs / filename).read_text(encoding="utf-8")
        match = re.search(r"<main[^>]*>(.*?)</main>", document, flags=re.DOTALL | re.IGNORECASE)
        if not match:
            raise RuntimeError(f"{filename} has no main element.")
        return match.group(0)

    apps_markup = main_markup("apps.html")
    drawing_markup = main_markup("drawing.html")
    apps_document = (docs / "apps.html").read_text(encoding="utf-8")
    apps_style_match = re.search(r"<style>(.*?)</style>", apps_document, flags=re.DOTALL | re.IGNORECASE)
    apps_styles = apps_style_match.group(1) if apps_style_match else ""
    drawing_styles = (docs / "drawing.css").read_text(encoding="utf-8")
    drawing_client = (docs / "drawing.js").read_text(encoding="utf-8")
    return apps_markup, apps_styles + "\n", drawing_markup, drawing_styles + "\n", drawing_client


def atomic_path(path: Path) -> Path:
    return path.with_name(path.name + ".tmp")


def write_atomic_text(path: Path, content: str) -> None:
    temporary = atomic_path(path)
    try:
        temporary.write_text(content, encoding="utf-8")
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def replace_bytes_stream(source: Path, destination: Path, replacements: dict[bytes, bytes]) -> None:
    """Copy a large file while replacing tokens even when they cross chunks."""
    longest = max(len(token) for token in replacements)
    temporary = atomic_path(destination)
    try:
        with source.open("rb") as input_file, temporary.open("wb") as output_file:
            carry = b""
            while chunk := input_file.read(1024 * 1024):
                data = carry + chunk
                keep = max(0, longest - 1)
                if keep and len(data) > keep:
                    safe, carry = data[:-keep], data[-keep:]
                else:
                    safe, carry = b"", data
                for old, new in replacements.items():
                    safe = safe.replace(old, new)
                output_file.write(safe)
            for old, new in replacements.items():
                carry = carry.replace(old, new)
            output_file.write(carry)
        os.replace(temporary, destination)
    finally:
        if temporary.exists():
            temporary.unlink()


def insert_before_last_marker(path: Path, marker: bytes, insertion: bytes) -> None:
    """Insert into a generated file without loading the whole export."""
    with path.open("rb+") as file:
        file.seek(0, os.SEEK_END)
        end = file.tell()
        tail_size = min(end, 2 * 1024 * 1024)
        file.seek(end - tail_size)
        tail = file.read(tail_size)
        marker_index = tail.rfind(marker)
        if marker_index < 0:
            raise RuntimeError(f"{path.name} has no final {marker!r} marker.")
        absolute_index = end - tail_size + marker_index
        file.seek(absolute_index)
        remainder = file.read()
        file.seek(absolute_index)
        file.write(insertion)
        file.write(remainder)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        while chunk := file.read(1024 * 1024):
            digest.update(chunk)
    return digest.hexdigest()


def build_zip(html_path: Path, archive_path: Path) -> None:
    temporary = atomic_path(archive_path)
    try:
        with zipfile.ZipFile(
            temporary, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=1
        ) as archive:
            archive.write(html_path, arcname=html_path.name)
        os.replace(temporary, archive_path)
    finally:
        if temporary.exists():
            temporary.unlink()


def build_xz(html_path: Path, archive_path: Path) -> None:
    temporary = atomic_path(archive_path)
    try:
        with html_path.open("rb") as source, lzma.open(temporary, "wb", preset=1) as target:
            shutil.copyfileobj(source, target, length=1024 * 1024)
        os.replace(temporary, archive_path)
    finally:
        if temporary.exists():
            temporary.unlink()


def validate_html(path: Path, edition: str) -> str:
    marker = f"window.AERODYNAMIX_EDITION='{edition}'".encode("ascii")
    data = path.read_bytes()
    markers = re.findall(rb"window\.AERODYNAMIX_EDITION='([^']+)'", data)
    if markers != [edition.encode("ascii")]:
        raise RuntimeError(
            f"{path.name} has invalid edition markers: "
            + ", ".join(item.decode("ascii", "replace") for item in markers)
        )
    if data.count(marker) != 1 or b"</body>" not in data:
        raise RuntimeError(f"{path.name} failed standalone HTML validation.")
    return sha256_file(path)


def validate_zip(path: Path, html_path: Path, expected_hash: str) -> None:
    with zipfile.ZipFile(path) as archive:
        if archive.namelist() != [html_path.name]:
            raise RuntimeError(f"{path.name} contains unexpected members: {archive.namelist()}")
        member = archive.getinfo(html_path.name)
        if member.file_size != html_path.stat().st_size:
            raise RuntimeError(f"{path.name} has a stale member size.")
        digest = hashlib.sha256()
        with archive.open(member) as file:
            while chunk := file.read(1024 * 1024):
                digest.update(chunk)
        if digest.hexdigest() != expected_hash:
            raise RuntimeError(f"{path.name} does not match {html_path.name}.")


def validate_xz(path: Path, html_path: Path, expected_hash: str) -> None:
    digest = hashlib.sha256()
    size = 0
    with lzma.open(path, "rb") as file:
        while chunk := file.read(1024 * 1024):
            digest.update(chunk)
            size += len(chunk)
    if size != html_path.stat().st_size or digest.hexdigest() != expected_hash:
        raise RuntimeError(f"{path.name} does not match {html_path.name}.")


def main() -> None:
    source = SOURCE_EXPORT.read_text(encoding="utf-8")
    source, media_sections_removed = re.subn(
        r'<section\b[^>]*\bclass=["\'][^"\']*\bactual-site-view\b[^"\']*["\'][^>]*\bid=["\']mediaView["\'][^>]*>.*?</section>',
        '',
        source,
        count=1,
        flags=re.I | re.S,
    )
    if media_sections_removed != 1:
        raise RuntimeError("The legacy Media Player section was not found.")
    source, boot_scripts_removed = re.subn(
        r"<script>\s*/\*\s*Aerodynamix Boot Screen\s*\*/.*?</script>",
        "<script>window.AeroBootScreen={show:function(){}};</script>",
        source,
        count=1,
        flags=re.I | re.S,
    )
    if boot_scripts_removed != 1:
        raise RuntimeError("The legacy boot screen script was not found.")
    # Every variant keeps the small self-contained HTML game payloads already
    # present in the catalogue. The slim filename is kept for compatibility,
    # but it no longer means CDN-backed game loading.
    source = add_requested_games(source)
    source = make_slim_catalogue(source)
    # The source export's global Media Player shortcut must not intercept
    # spaces typed into Connect textareas and other editable controls.
    source = source.replace(
        "if (e.target.tagName === 'INPUT') return;",
        "if (e.target.matches('input, textarea, select, [contenteditable=\"true\"]')) return;",
    )
    # Keep the player frame empty without navigating it through about:blank.
    # This is also friendlier to file-based exports that restore the frame.
    source = source.replace(
        "frame.src='about:blank';",
        "frame.removeAttribute('src');frame.srcdoc='';",
    )
    patch = (PROJECT_ROOT / "aerodynamix-standalone-patch.js").read_text(encoding="utf-8")
    patch, update_code_removed = re.subn(
        r"\n  function compareVersions\(.*?\n  function wireEvents\(",
        "\n  function wireEvents(",
        patch,
        count=1,
        flags=re.S,
    )
    if update_code_removed != 1:
        raise RuntimeError("The standalone update implementation was not found.")
    patch, update_notification_styles_removed = re.subn(
        r"\n      #aeroUpdateNotification \{.*?\n      #aeroThemeEffects \{",
        "\n      #aeroThemeEffects {",
        patch,
        count=1,
        flags=re.S,
    )
    patch, update_page_styles_removed = re.subn(
        r"\n      #aeroUpdatesView \{.*?\n      #aeroMusicView \{",
        "\n      #aeroMusicView {",
        patch,
        count=1,
        flags=re.S,
    )
    if update_notification_styles_removed != 1 or update_page_styles_removed != 1:
        raise RuntimeError("The standalone update styles were not found.")
    music_styles = (PROJECT_ROOT / "aerodynamix-music-enhancement.css").read_text(encoding="utf-8")
    music_script = (PROJECT_ROOT / "aerodynamix-music-enhancement.js").read_text(encoding="utf-8")
    hotfix = standalone_hotfix()
    edition_marker = (
        f"<script>window.AERODYNAMIX_EDITION='normal';"
        f"window.AERODYNAMIX_VARIANT='{VARIANT}';</script>"
    )
    if "</head>" not in source:
        raise RuntimeError("The original standalone export has no closing head tag.")
    source = source.replace("</head>", "\n" + edition_marker + "\n</head>", 1)
    markup, styles, client = build_connect_assets()
    apps_markup, apps_styles, drawing_markup, drawing_styles, drawing_client = build_app_assets()
    injection = (
        "\n<template id=\"aeroConnectMarkup\"><div class=\"aero-connect-page\">"
        + markup
        + "</div></template>\n"
        + "<style id=\"aeroConnectStyles\">\n"
        + styles
        + "\n</style>\n"
        + "<script type=\"text/plain\" id=\"aeroConnectClient\">\n"
        + client
        + "\n</script>\n"
        + "<template id=\"aeroAppsMarkup\">"
        + apps_markup
        + "</template>\n"
        + "<style id=\"aeroAppsStyles\">\n"
        + apps_styles
        + "\n</style>\n"
        + "<template id=\"aeroDrawingMarkup\">"
        + drawing_markup
        + "</template>\n"
        + "<style id=\"aeroDrawingStyles\">\n"
        + drawing_styles
        + "\n</style>\n"
        + "<script type=\"text/plain\" id=\"aeroDrawingClient\">\n"
        + drawing_client
        + "\n</script>\n"
        + "<script>\n"
        + "(function(){window.AeroLoadEmbeddedGames=function(){"
        + "if(window.__aeroEmbeddedGamesLoaded)return Promise.resolve(window.GAMES||[]);"
        + "var node=document.getElementById('aeroEmbeddedGames');"
        + "if(!node)return Promise.resolve(window.GAMES||[]);"
        + "try{window.GAMES=JSON.parse(node.textContent||'[]');"
        + "window.__aeroEmbeddedGamesLoaded=true;"
        + "return Promise.resolve(window.GAMES);"
        + "}catch(error){return Promise.reject(error);}};"
        + "window.AeroLoadGameContent=function(game){"
        + "if(!game||game.content)return Promise.resolve(game);"
        + "var node=document.getElementById('aeroGamePayload-'+game.embeddedKey);"
        + "if(!node)return Promise.reject(new Error('Embedded game payload is missing'));"
        + "try{var raw=atob(node.textContent||''),bytes=new Uint8Array(raw.length);"
        + "for(var i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);"
        + "return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate')))"
        + ".text().then(function(text){game.content=text;return game;});"
        + "}catch(error){return Promise.reject(error);}};}());"
        + "\n</script>\n"
        + "<script>\n"
        + patch
        + "\n</script>\n"
        + "<script>\n"
        + hotfix
        + "\n</script>\n"
        + "<style id=\"aeroMusicEnhancementStyles\">\n"
        + music_styles
        + "\n</style>\n"
        + "<script>\n"
        + music_script
        + "\n</script>\n"
    )

    if "</body>" not in source:
        raise RuntimeError("The original standalone export has no closing body tag.")
    result = source.rsplit("</body>", 1)[0] + injection + "</body>" + source.rsplit("</body>", 1)[1]
    write_atomic_text(OUTPUT_HTML, result)

    normal_hash = validate_html(OUTPUT_HTML, "normal")
    print(
        f"Built {OUTPUT_HTML.name} ({OUTPUT_HTML.stat().st_size:,} bytes, "
        f"sha256 {normal_hash})"
    )

    if not os.environ.get("AERO_HTML_ONLY"):
        build_zip(OUTPUT_HTML, OUTPUT_ZIP)
        build_xz(OUTPUT_HTML, OUTPUT_XZ)
        validate_zip(OUTPUT_ZIP, OUTPUT_HTML, normal_hash)
        validate_xz(OUTPUT_XZ, OUTPUT_HTML, normal_hash)
        print(f"Built {OUTPUT_ZIP.name} ({OUTPUT_ZIP.stat().st_size:,} bytes)")
        print(f"Built {OUTPUT_XZ.name} ({OUTPUT_XZ.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()