## Backend Development (Server)

This section provides context and guidelines for the server-side application.

### Tech Stack

-   **Framework:** FastAPI
-   **Language:** Python
-   **Database:** SQLAlchemy with SQLite

### Project Structure

-   **`app/`**: This directory contains the main application code.
    -   **`core/`**: This directory contains the core logic of the application, such as authentication and security.
    -   **`db/`**: This directory contains the database connection and initialization logic.
    -   **`models/`**: This directory contains the SQLAlchemy models for the database tables.
    -   **`routes/`**: This directory contains the API routes for the application.
    -   **`schemas/`**: This directory contains the Pydantic schemas for data validation.
-   **`static/`**: This directory contains static files, such as the frontend build files.
-   **`.env`**: This file contains environment variables for the application.
-   **`ai_academy.db`**: This is the SQLite database file.
-   **`run_app.py`**: This is the main entry point for the application.
-   **`requirements.txt`**: This file contains the project's dependencies.

### Conventions

-   Follow the existing file structure for routes, models, and schemas.
-   Use Pydantic for data validation.
-   Use dependency injection for database sessions.

### Running the Server

To run the server application, use the following command:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run_app.py
```