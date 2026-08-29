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


PROJECT_ROOT = Path(__file__).resolve().parent
WORKSPACE_ROOT = PROJECT_ROOT.parents[1]
SOURCE_EXPORT = WORKSPACE_ROOT / "attached_assets" / "presentation_1787450952428.html"
OUTPUT_DIR = PROJECT_ROOT / "attached_assets"
VARIANT = "slim" if os.environ.get("AERO_SLIM") else "full"
VARIANT_SUFFIX = "-Slim" if VARIANT == "slim" else ""
OUTPUT_HTML = OUTPUT_DIR / f"Aerodynamix-Standalone{VARIANT_SUFFIX}.html"
OUTPUT_ZIP = OUTPUT_DIR / f"Aerodynamix-Standalone{VARIANT_SUFFIX}.zip"
OUTPUT_DEV_HTML = OUTPUT_DIR / f"Aerodynamix-Dev-Edition{VARIANT_SUFFIX}.html"
OUTPUT_DEV_ZIP = OUTPUT_DIR / f"Aerodynamix-Dev-Edition{VARIANT_SUFFIX}.zip"
OUTPUT_XZ = OUTPUT_DIR / f"Aerodynamix-Standalone{VARIANT_SUFFIX}.html.xz"
OUTPUT_DEV_XZ = OUTPUT_DIR / f"Aerodynamix-Dev-Edition{VARIANT_SUFFIX}.html.xz"


CONNECT_ORIGIN = "https://aerodynamix20.onrender.com"
DEFAULT_PUBLIC_ROOT = "https://yeeperlabratsonz.github.io/Aerodynamix/Aerodynamix20/Aerodynamix20/docs/"


def data_uri(filename: str, mime: str) -> str:
    asset = PROJECT_ROOT / "attached_assets" / filename
    if not asset.exists():
        raise RuntimeError(f"Missing bundled media asset: {asset}")
    encoded = base64.b64encode(asset.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def inline_new_game(source: str) -> str:
    """Add the latest hosted catalogue game to the self-contained export."""
    game_file = PROJECT_ROOT / "attached_assets" / "clnubbysnumberfactory_1787559476408.html"
    thumbnail_file = PROJECT_ROOT / "docs" / "images" / "nubbys-number-factory.jpg"
    content_uri = "data:text/html;base64," + base64.b64encode(game_file.read_bytes()).decode("ascii")
    thumb_uri = "data:image/jpeg;base64," + base64.b64encode(thumbnail_file.read_bytes()).decode("ascii")
    marker = "const GAMES="
    start = source.find(marker)
    end = source.find("];", start)
    if start < 0 or end < 0:
        raise RuntimeError("The standalone source has no GAMES catalogue.")
    catalogue_start = start + len(marker)
    catalogue = source[catalogue_start:end + 1]
    if "Nubby's Number Factory" in catalogue:
        return source
    new_game = json.dumps({
        "title": "Nubby's Number Factory",
        "game": "attached_assets/clnubbysnumberfactory_1787559476408.html",
        "thumb": thumb_uri,
        "content": content_uri,
    }, separators=(",", ":"))
    insert_at = catalogue.rfind("]")
    if insert_at < 0:
        raise RuntimeError("The standalone GAMES catalogue is malformed.")
    separator = "," if catalogue[:insert_at].rstrip().endswith("}") else ""
    updated = catalogue[:insert_at] + separator + new_game + catalogue[insert_at:]
    return source[:catalogue_start] + updated + source[end + 1:]


def make_slim_catalogue(source: str) -> str:
    """Keep only remote game URLs, matching the original UGS loader model."""
    marker = "const GAMES="
    start = source.find(marker)
    end = source.find("];", start)
    if start < 0 or end < 0:
        raise RuntimeError("The standalone source has no GAMES catalogue.")
    catalogue_start = start + len(marker)
    catalogue = json.loads(source[catalogue_start:end + 1])
    ugs_root = "https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile/UGS-Files/"
    attached_ids = {
        "Papa's Pizzeria": "clpizzapapa",
        "Super Smash Flash": "clsupersmashflash",
        "Slope": "clslope",
        "Papa'S Freezeria": "clpapasfreezeria",
        "Adventure Capitalist": "clAdventureCapatalist",
        "Friday Night Funkin'": "clfridaynightfunkin",
        "Run 2": "clrun2",
        "Pico'S School": "clpicosschool",
        "World'S Hardest Game": "clworldshardestgame",
        "Sandboxels": "clsandboxels",
        "Run 3": "clrun3",
        "Drive Mad": "cldrivemady",
        "Retrobowl": "clretrobowl",
        "Papa'S Pancakeria": "clpapaspancakeria",
        "Papa'S Bakeria": "clpapabakeria",
        "Meat Boy": "clmeatboy",
        "Newgrounds Rumble": "clnewgroundsrumble",
        "We Become What We Behold": "clwebecomewhatwebehold",
        "Bad Time Simulator": "clbadtimesim",
        "Deltarune": "cldeltarune",
        "Alien Hominid": "clalienhominid",
        "Subway Surfers San Francisco": "clsubwaysurferssanfrancisco",
        "Hobo 1": "clhobo",
        "Hobo 2": "clhobo2",
        "Hobo 3": "clhobo3",
        "Hobo 4": "clhobo4",
        "Hobo 5": "clhobo5",
        "Hobo 6": "clhobo6",
        "Hobo 7": "clhobo7",
        "Gladihoppers": "clgladdihoppers",
        "Fruit Ninja": "clfruitninja",
        "Binding Of Isaac Wrath Of The Lamb": "clbindingofisaccsheeptime",
        "Crossy Road": "clcrossyroad",
        "Cookie Clicker": "clcookieclicker",
        "Duck Life": "clducklife",
        "Geometry Dash Lite": "clgdlite",
        "Doom": "cldoom",
        "Doki Doki Literature Club": "cldokidokiliteratureclub",
        "Baldi'S Basics Classic Remastered": "clbaldisbasicsremaster",
        "Breaking The Bank": "clstickminbreakingbank",
        "Escaping The Prison": "clstickminescapingprison",
        "Stealing The Diamond": "clstickmanstealingdiamond",
        "Infiltrating The Airship": "clstickminairship",
        "Nubby's Number Factory": "clnubbysnumberfactory",
    }
    for game in catalogue:
        title = str(game.get("title", ""))
        if title in attached_ids:
            game["url"] = ugs_root + attached_ids[title] + ".html"
            game.pop("content", None)
        elif str(game.get("game", "")).startswith("games/"):
            game["url"] = DEFAULT_PUBLIC_ROOT + str(game["game"])
            game.pop("content", None)
        elif game.get("content"):
            # Keep the original wrapper when the remote catalogue has no
            # verified matching file. Its own published asset URLs are more
            # reliable than inventing a CDN filename that returns 404.
            game.pop("url", None)
        else:
            game.pop("content", None)
    updated = json.dumps(catalogue, separators=(",", ":"))
    return source[:catalogue_start] + updated + source[end + 1:]


def bundle_catalogue_games(source: str) -> str:
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
        raw_uris = {}
        for path in files:
            rel = path.relative_to(game_root).as_posix()
            value = uri(path)
            raw_uris[rel] = value

        bundled_uris = {}
        for path in files:
            rel = path.relative_to(game_root).as_posix()
            bundled_uris[rel] = raw_uris[rel]
            if path.name == "ruffle.min.js":
                text = path.read_text(encoding="utf-8", errors="replace")
                # Keep Ruffle's shared WASM engine as a single runtime
                # dependency rather than duplicating two 13 MB binaries into
                # every Flash game document.
                ruffle_base = (
                    "https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@"
                    "0.2.0-nightly.2025.10.2/"
                )
                for name in ("4d882486fa9bfce731b9.wasm", "f7f28eb60b84863611ca.wasm"):
                    text = text.replace(name, ruffle_base + name)
                bundled_uris[rel] = (
                    "data:application/javascript;base64," +
                    base64.b64encode(text.encode("utf-8")).decode("ascii")
                )

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


def build_dev_html(normal_path: Path, dev_path: Path, dev_patch: str) -> None:
    replace_bytes_stream(
        normal_path,
        dev_path,
        {b"window.AERODYNAMIX_EDITION='normal'": b"window.AERODYNAMIX_EDITION='dev'"},
    )
    insert_before_last_marker(
        dev_path,
        b"</body>",
        ("\n<script>\n" + dev_patch + "\n</script>\n").encode("utf-8"),
    )


def main() -> None:
    source = SOURCE_EXPORT.read_text(encoding="utf-8")
    source = inline_new_game(source)
    if os.environ.get("AERO_SLIM"):
        source = make_slim_catalogue(source)
    else:
        source = bundle_catalogue_games(source)
    # Embed the user-provided tracks so the downloaded HTML does not depend on
    # a sibling assets directory or a hosted media route.
    sicko_uri = data_uri("sicko-mode.mp3", "audio/mpeg")
    sicko_art_uri = data_uri("sicko-mode-cover.jpg", "image/jpeg")
    magnolia_uri = data_uri("magnolia-user.mp3", "audio/mpeg")
    magnolia_art_uri = data_uri("magnolia-user.webp", "image/webp")
    source = source.replace(
        "const BUNDLED_TRACKS = [",
        "const BUNDLED_TRACKS = [\n"
        "            {\n"
        "                key: 'sicko-mode-user',\n"
        f"                src: '{sicko_uri}',\n"
        "                fileName: 'SICKO MODE.mp3',\n"
        "                mime: 'audio/mpeg',\n"
        "                tags: { title: 'SICKO MODE', artist: 'Travis Scott; Drake', album: 'ASTROWORLD' },\n"
        f"                artUrl: '{sicko_art_uri}'\n"
        "            },\n"
        "            {\n"
        "                key: 'magnolia-user',\n"
        f"                src: '{magnolia_uri}',\n"
        "                fileName: 'Magnolia.mp3',\n"
        "                mime: 'audio/mpeg',\n"
        "                tags: { title: 'Magnolia', artist: 'Playboi Carti', album: 'Playboi Carti' },\n"
        f"                artUrl: '{magnolia_art_uri}'\n"
        "            },",
        1,
    )
    # The source export's global Media Player shortcut must not intercept
    # spaces typed into Connect textareas and other editable controls.
    source = source.replace(
        "if (e.target.tagName === 'INPUT') return;",
        "if (e.target.matches('input, textarea, select, [contenteditable=\"true\"]')) return;",
    )
    patch = (PROJECT_ROOT / "aerodynamix-standalone-patch.js").read_text(encoding="utf-8")
    dev_patch = (PROJECT_ROOT / "aerodynamix-dev-edition-patch.js").read_text(encoding="utf-8")
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
        + f"<script>window.AERODYNAMIX_EDITION='normal';window.AERODYNAMIX_VARIANT='{VARIANT}';</script>\n"
        + "<script>\n"
        + patch
        + "\n</script>\n"
    )

    if "</body>" not in source:
        raise RuntimeError("The original standalone export has no closing body tag.")
    result = source.rsplit("</body>", 1)[0] + injection + "</body>" + source.rsplit("</body>", 1)[1]
    write_atomic_text(OUTPUT_HTML, result)
    build_dev_html(OUTPUT_HTML, OUTPUT_DEV_HTML, dev_patch)

    normal_hash = validate_html(OUTPUT_HTML, "normal")
    dev_hash = validate_html(OUTPUT_DEV_HTML, "dev")
    print(
        f"Built {OUTPUT_HTML.name} ({OUTPUT_HTML.stat().st_size:,} bytes, "
        f"sha256 {normal_hash})"
    )
    print(
        f"Built {OUTPUT_DEV_HTML.name} ({OUTPUT_DEV_HTML.stat().st_size:,} bytes, "
        f"sha256 {dev_hash})"
    )

    if not os.environ.get("AERO_HTML_ONLY"):
        build_zip(OUTPUT_HTML, OUTPUT_ZIP)
        build_zip(OUTPUT_DEV_HTML, OUTPUT_DEV_ZIP)
        build_xz(OUTPUT_HTML, OUTPUT_XZ)
        build_xz(OUTPUT_DEV_HTML, OUTPUT_DEV_XZ)
        validate_zip(OUTPUT_ZIP, OUTPUT_HTML, normal_hash)
        validate_zip(OUTPUT_DEV_ZIP, OUTPUT_DEV_HTML, dev_hash)
        validate_xz(OUTPUT_XZ, OUTPUT_HTML, normal_hash)
        validate_xz(OUTPUT_DEV_XZ, OUTPUT_DEV_HTML, dev_hash)
        print(f"Built {OUTPUT_ZIP.name} ({OUTPUT_ZIP.stat().st_size:,} bytes)")
        print(f"Built {OUTPUT_DEV_ZIP.name} ({OUTPUT_DEV_ZIP.stat().st_size:,} bytes)")
        print(f"Built {OUTPUT_XZ.name} ({OUTPUT_XZ.stat().st_size:,} bytes)")
        print(f"Built {OUTPUT_DEV_XZ.name} ({OUTPUT_DEV_XZ.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()