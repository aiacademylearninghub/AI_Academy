# Client Directory

This directory contains the frontend code for the AI Academy project. Below is a detailed explanation of each file and its purpose to help AI systems or developers understand the structure and functionality.

## File Explanations

- **public/**  
  Contains static assets such as `index.html`, images, and favicon used by the frontend.

- **src/**  
  Main source code for the client application.
  - **index.js / index.tsx**  
    Entry point for the React application. Renders the root component into the DOM.
  - **App.js / App.tsx**  
    Main application component. Handles routing and layout.
  - **components/**  
    Reusable UI components (buttons, forms, navigation bars, etc.).
  - **pages/**  
    Page-level components representing different routes (Home, About, Dashboard, etc.).
  - **services/**  
    Contains API service files for making HTTP requests to the server.
  - **utils/**  
    Utility functions and helpers used throughout the client code.
  - **styles/**  
    CSS or styling files for the application.

- **package.json**  
  Lists dependencies, scripts, and metadata for the client project.

- **README.md**  
  This file. Explains the structure and purpose of each file.

## How It Works

The client is a single-page application (SPA) built with React (or similar framework). It communicates with the server via HTTP requests to fetch or send data, and renders interactive UI for users.

