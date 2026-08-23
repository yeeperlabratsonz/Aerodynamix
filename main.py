"""Render/Gunicorn entry point for the Aerodynamix Flask application."""

import os
import sys
from pathlib import Path


APP_DIR = Path(__file__).resolve().parent / "Aerodynamix20" / "Aerodynamix20"

# server.py uses paths relative to its own directory (docs/, uploads/, and the
# default SQLite database), so make that directory the process working
# directory before importing the Flask app.
os.chdir(APP_DIR)
sys.path.insert(0, str(APP_DIR))

from server import app  # noqa: E402


if __name__ == "__main__":
    main()
