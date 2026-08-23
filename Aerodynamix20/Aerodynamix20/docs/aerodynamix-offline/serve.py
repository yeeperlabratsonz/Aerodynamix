from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

print("Aerodynamix Offline is available at http://127.0.0.1:8000/")
print("Keep this window open while playing. Press Ctrl+C to stop.")
ThreadingHTTPServer(("127.0.0.1", 8000), SimpleHTTPRequestHandler).serve_forever()