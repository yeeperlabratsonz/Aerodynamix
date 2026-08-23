"""Build the downloadable Aerodynamix standalone HTML and ZIP.

The hosted preview streams the original export plus the maintainable patch. This
builder produces the portable equivalent by inlining the patch and the Connect
page itself. Connect API requests still go to the live Aerodynamix service.
"""

from pathlib import Path
import re
import zipfile


PROJECT_ROOT = Path(__file__).resolve().parent
WORKSPACE_ROOT = PROJECT_ROOT.parents[1]
SOURCE_EXPORT = WORKSPACE_ROOT / "attached_assets" / "presentation_1787450952428.html"
OUTPUT_HTML = PROJECT_ROOT / "attached_assets" / "Aerodynamix-Standalone.html"
OUTPUT_ZIP = PROJECT_ROOT / "attached_assets" / "Aerodynamix-Standalone.zip"


CONNECT_ORIGIN = "https://aerodynamix20.onrender.com"


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


def main() -> None:
    source = SOURCE_EXPORT.read_text(encoding="utf-8")
    # The source export's global Media Player shortcut must not intercept
    # spaces typed into Connect textareas and other editable controls.
    source = source.replace(
        "if (e.target.tagName === 'INPUT') return;",
        "if (e.target.matches('input, textarea, select, [contenteditable=\"true\"]')) return;",
    )
    patch = (PROJECT_ROOT / "aerodynamix-standalone-patch.js").read_text(encoding="utf-8")
    markup, styles, client = build_connect_assets()
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
        + "<script>\n"
        + patch
        + "\n</script>\n"
    )

    if "</body>" not in source:
        raise RuntimeError("The original standalone export has no closing body tag.")
    result = source.rsplit("</body>", 1)[0] + injection + "</body>" + source.rsplit("</body>", 1)[1]
    OUTPUT_HTML.write_text(result, encoding="utf-8")

    with zipfile.ZipFile(OUTPUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        archive.write(OUTPUT_HTML, arcname=OUTPUT_HTML.name)

    print(f"Built {OUTPUT_HTML.name} ({OUTPUT_HTML.stat().st_size:,} bytes)")
    print(f"Built {OUTPUT_ZIP.name} ({OUTPUT_ZIP.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()