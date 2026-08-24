"""Build the downloadable Aerodynamix standalone HTML and ZIP.

The hosted preview streams the original export plus the maintainable patch. This
builder produces the portable equivalent by inlining the patch and the Connect
page itself. Connect API requests still go to the live Aerodynamix service.
"""

from pathlib import Path
import base64
import re
import zipfile


PROJECT_ROOT = Path(__file__).resolve().parent
WORKSPACE_ROOT = PROJECT_ROOT.parents[1]
SOURCE_EXPORT = WORKSPACE_ROOT / "attached_assets" / "presentation_1787450952428.html"
OUTPUT_HTML = PROJECT_ROOT / "attached_assets" / "Aerodynamix-Standalone.html"
OUTPUT_ZIP = PROJECT_ROOT / "attached_assets" / "Aerodynamix-Standalone.zip"
OUTPUT_DEV_HTML = PROJECT_ROOT / "attached_assets" / "Aerodynamix-Dev-Edition.html"
OUTPUT_DEV_ZIP = PROJECT_ROOT / "attached_assets" / "Aerodynamix-Dev-Edition.zip"


CONNECT_ORIGIN = "https://aerodynamix20.onrender.com"


def data_uri(filename: str, mime: str) -> str:
    asset = PROJECT_ROOT / "attached_assets" / filename
    if not asset.exists():
        raise RuntimeError(f"Missing bundled media asset: {asset}")
    encoded = base64.b64encode(asset.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


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
        "  async function api(path, options = {}) {\n"
        "    const res = await fetch(path, { credentials: 'same-origin', ...options });",
        "  window.AERO_CONNECT_ORIGIN = " + repr(CONNECT_ORIGIN) + ";\n\n"
        "  async function api(path, options = {}) {\n"
        "    const res = await fetch(new URL(path, window.AERO_CONNECT_ORIGIN).href, { credentials: 'include', ...options });",
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


def main() -> None:
    source = SOURCE_EXPORT.read_text(encoding="utf-8")
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
        + "<script>\n"
        + patch
        + "\n</script>\n"
    )

    if "</body>" not in source:
        raise RuntimeError("The original standalone export has no closing body tag.")
    result = source.rsplit("</body>", 1)[0] + injection + "</body>" + source.rsplit("</body>", 1)[1]
    OUTPUT_HTML.write_text(result, encoding="utf-8")
    dev_result = result.rsplit("</body>", 1)[0] + "<script>\n" + dev_patch + "\n</script>\n</body>" + result.rsplit("</body>", 1)[1]
    OUTPUT_DEV_HTML.write_text(dev_result, encoding="utf-8")

    with zipfile.ZipFile(OUTPUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        archive.write(OUTPUT_HTML, arcname=OUTPUT_HTML.name)
    with zipfile.ZipFile(OUTPUT_DEV_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        archive.write(OUTPUT_DEV_HTML, arcname=OUTPUT_DEV_HTML.name)

    print(f"Built {OUTPUT_HTML.name} ({OUTPUT_HTML.stat().st_size:,} bytes)")
    print(f"Built {OUTPUT_ZIP.name} ({OUTPUT_ZIP.stat().st_size:,} bytes)")
    print(f"Built {OUTPUT_DEV_HTML.name} ({OUTPUT_DEV_HTML.stat().st_size:,} bytes)")
    print(f"Built {OUTPUT_DEV_ZIP.name} ({OUTPUT_DEV_ZIP.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()