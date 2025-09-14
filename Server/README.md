# AI Academy Server

This directory contains the FastAPI backend code for the AI Academy project. Below is a detailed explanation of the server structure and functionality.

## Project Structure

- **app/**  
  Main application package.
  - **main.py**  
    Entry point for the FastAPI application. Initializes the server and sets up routes.
  - **routes/**  
    Contains API route handlers for different endpoints:
    - **auth.py**: User authentication (login/signup)
    - **users.py**: User profile management
  - **models/**  
    SQLAlchemy ORM models for database tables:
    - **user.py**: User and Profile models
  - **schemas/**  
    Pydantic models for request/response validation:
    - **user.py**: User, Profile, and authentication schemas
  - **core/**  
    Core functionality and utilities:
    - **security.py**: Password hashing and JWT functions
    - **auth.py**: Authentication dependencies
  - **db/**  
    Database configuration:
    - **database.py**: SQLAlchemy setup
    - **init_db.py**: Database initialization

- **pyproject.toml**  
  Poetry project configuration and dependencies.
  
- **.env**  
  Environment variables for the application.

## API Endpoints

- **Authentication**
  - `POST /api/auth/login`: User login with JWT token response
  - `POST /api/auth/signup`: User registration

- **User Management**
  - `GET /api/users/me`: Get current user profile
  - `PUT /api/users/me`: Update current user details
  - `PUT /api/users/me/profile`: Update user profile details

## Running the Server

```bash
# Install dependencies
poetry install

# Run the server
poetry run uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

