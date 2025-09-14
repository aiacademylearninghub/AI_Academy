## AI Academy Project Overview

This document provides a high-level overview of the AI Academy project, including both the client and server components. The goal of this project is to create an online learning platform for AI-related courses.

### Project Workflow

The project is divided into two main parts: a client-side application and a server-side application.

1.  **Client-side Application:** The client-side application is a single-page application (SPA) built with React. It is responsible for rendering the user interface and interacting with the server-side application to fetch and display data.
2.  **Server-side Application:** The server-side application is a RESTful API built with FastAPI. It is responsible for handling business logic, interacting with the database, and providing data to the client-side application.

The general workflow is as follows:

1.  The user opens the client-side application in their browser.
2.  The client-side application makes requests to the server-side application to fetch data, such as a list of courses or user information.
3.  The server-side application processes the request, interacts with the database, and returns the data to the client-side application in JSON format.
4.  The client-side application receives the data and renders it in the user interface.

### Project Structure

-   **Client:** Contains the frontend application, built with React, TypeScript, and Tailwind CSS. See `Client/GEMINI.md` for more details.
-   **Server:** Contains the backend application, built with Python, FastAPI, and SQLAlchemy. See `Server/GEMINI.md` for more details.
-   **.github:** Contains GitHub Actions workflows for CI/CD.
-   **.vscode:** Contains VS Code-specific settings.
-   **.gitignore:** Specifies which files and folders to ignore in Git.
-   **README.md:** Contains a general overview of the project.

### Getting Started

To get started with the project, you will need to run both the client and server applications.

-   **Client:** See `Client/GEMINI.md` for instructions.
-   **Server:** See `Server/GEMINI.md` for instructions.