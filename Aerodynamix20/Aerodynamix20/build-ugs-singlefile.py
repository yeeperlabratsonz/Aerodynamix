"""Create a minimized, CDN-backed copy of the uploaded UGS launcher."""

from __future__ import annotations

import gzip
import lzma
import re
import zipfile
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
SOURCE = PROJECT_ROOT.parents[1] / "attached_assets" / "clSINGLEFILE_1788144031536.html"
OUTPUT_DIR = PROJECT_ROOT / "attached_assets"
OUTPUT_HTML = OUTPUT_DIR / "UGS-Files-CDN.html"
OUTPUT_GZIP = OUTPUT_DIR / "UGS-Files-CDN.html.gz"
OUTPUT_XZ = OUTPUT_DIR / "UGS-Files-CDN.html.xz"
OUTPUT_ZIP = OUTPUT_DIR / "UGS-Files-CDN.zip"


def minify_css(css: str) -> str:
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.DOTALL)
    css = re.sub(r"\s+", " ", css).strip()
    css = re.sub(r"\s*([{}:;,>])\s*", r"\1", css)
    return css


def minify_inline_style(match: re.Match[str]) -> str:
    value = minify_css(match.group(1))
    return f'style="{value}"'


def minify_html(source: str) -> str:
    def replace_style_block(match: re.Match[str]) -> str:
        return f"<style>{minify_css(match.group(1))}</style>"

    result = re.sub(
        r"<style[^>]*>(.*?)</style>",
        replace_style_block,
        source,
        flags=re.IGNORECASE | re.DOTALL,
    )
    result = re.sub(r"<!--(?!\[if).*?-->", "", result, flags=re.DOTALL)
    result = re.sub(r'\s*style="([^"]*)"', minify_inline_style, result)
    result = re.sub(r"\s+", " ", result).strip()
    result = re.sub(r">\s+<", "><", result)
    return result


def validate(html: str) -> None:
    required_urls = (
        "https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile@main/searchbut.js",
        "https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile@latest/game.js",
        "https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile@main/games.js",
    )
    missing = [url for url in required_urls if url not in html]
    if missing:
        raise RuntimeError(f"Missing CDN dependency: {missing[0]}")
    if "<html" not in html.lower() or "</html>" not in html.lower():
        raise RuntimeError("Minimized output is not a complete HTML document.")


def main() -> None:
    original = SOURCE.read_text(encoding="utf-8")
    minimized = minify_html(original)
    validate(minimized)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_HTML.write_text(minimized + "\n", encoding="utf-8")

    with OUTPUT_GZIP.open("wb") as target:
        with gzip.GzipFile(
            filename=OUTPUT_HTML.name,
            mode="wb",
            fileobj=target,
            compresslevel=9,
            mtime=0,
        ) as compressed:
            compressed.write(minimized.encode("utf-8"))

    with lzma.open(OUTPUT_XZ, "wb", preset=9 | lzma.PRESET_EXTREME) as compressed:
        compressed.write(minimized.encode("utf-8"))

    with zipfile.ZipFile(
        OUTPUT_ZIP,
        "w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=9,
    ) as archive:
        archive.writestr(OUTPUT_HTML.name, minimized.encode("utf-8"))

    for path in (OUTPUT_HTML, OUTPUT_GZIP, OUTPUT_XZ, OUTPUT_ZIP):
        print(f"{path.name}: {path.stat().st_size:,} bytes")
    print(f"Original: {SOURCE.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()