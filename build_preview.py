"""Bundle the landing page and its local images for offline viewing."""
import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def embed_asset(match):
    path = ROOT / match.group(0)
    mime = mimetypes.guess_type(path.name)[0]
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def embed_images(text):
    return re.sub(r"assets/[\w-]+\.(?:webp|png|jpg)", embed_asset, text)


html = (ROOT / "index.html").read_text()
css = embed_images((ROOT / "style.css").read_text())
js = embed_images((ROOT / "app.js").read_text())
html = html.replace('<link rel="stylesheet" href="style.css">', f"<style>{css}</style>")
html = html.replace('<script src="app.js" defer></script>', "")
html = html.replace("</body>", f"<script>{js}</script></body>")
(ROOT / "preview.html").write_text(html)
print("Updated preview.html with embedded images, styles and JavaScript.")
