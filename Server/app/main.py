"""Main module for the FastAPI application."""

import os

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

# Try importing Jinja2Templates but provide a fallback
try:
    from fastapi.templating import Jinja2Templates

    jinja2_available = True
except (ImportError, AssertionError):
    import sys

    print(
        "WARNING: jinja2 is not installed. HTML templating will not be available.",
        file=sys.stderr,
    )
    print("Install it using: pip install jinja2", file=sys.stderr)
    jinja2_available = False

# from .db import init_db
# from .routes import auth, users

app = FastAPI(
    title="AI Academy",
    version="0.0.1",
    description="API Documentation for AI Academy",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/status", tags=["health"])
def check_health():
    """Check the health of the application."""
    return {"status": "ok"}


# Serving - static files
static_files_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
# Mount for backward compatibility
app.mount("/static", StaticFiles(directory=static_files_path), name="static")
# Mount for new client app with base='/'
app.mount(
    "/assets",
    StaticFiles(directory=os.path.join(static_files_path, "assets")),
    name="assets",
)
# Initialize templates only if jinja2 is available
if jinja2_available:
    templates = Jinja2Templates(directory=static_files_path)
else:
    templates = None


@app.get("/", response_class=HTMLResponse)
@app.get("/index.html", response_class=HTMLResponse)
def read_index(request: Request):
    """Serve the index.html file of front-end code at the root."""
    if templates is None:
        # If Jinja2 is not available, return a simple HTML response
        return HTMLResponse(
            "<html><body><h1>Error: Jinja2 not installed</h1><p>Please install jinja2: <pre>pip install jinja2</pre></p></body></html>"
        )

    return templates.TemplateResponse("index.html", {"request": request})


# API routes
# app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
# app.include_router(users.router, prefix="/api/users", tags=["users"])


@app.on_event("startup")
def startup_event():
    """Initialize database on startup."""
    # init_db.init_db()


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1,
    )
