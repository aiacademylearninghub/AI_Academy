"""Script to install dependencies and run the FastAPI server."""

import os
import sys
import subprocess


def main():
    """Main function to install dependencies and run the server."""
    print("Installing required dependencies...")

    # Install jinja2
    subprocess.check_call([sys.executable, "-m", "pip", "install", "jinja2"])

    # Install other dependencies from requirements.txt if it exists
    if os.path.exists("requirements.txt"):
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"]
        )

    print("Starting the FastAPI server...")

    # Run the server
    subprocess.check_call(
        [
            sys.executable,
            "-m",
            "uvicorn",
            "app.main:app",
            "--reload",
            "--host",
            "0.0.0.0",
            "--port",
            "8000",
        ]
    )


if __name__ == "__main__":
    main()
