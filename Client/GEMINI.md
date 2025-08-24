## Frontend Development (Client)

This section provides context and guidelines for the client-side application.

### Tech Stack

-   **Framework:** React
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Build Tool:** Vite

### Project Structure

-   **`src/`**: This directory contains all the source code for the client application.
    -   **`components/`**: This directory contains reusable React components.
        -   **`ui/`**: This directory contains basic UI components like `Badge.tsx` and `Card.tsx`.
    -   **`contexts/`**: This directory contains React contexts for managing global state.
    -   **`data/`**: This directory contains mock data for testing and development.
    -   **`hooks/`**: This directory contains custom React hooks.
    -   **`pages/`**: This directory contains the main pages of the application.
    -   **`styles/`**: This directory contains global styles and animations.
    -   **`types/`**: This directory contains TypeScript type definitions.
    -   **`utils/`**: This directory contains utility functions.
-   **`public/`**: This directory contains static assets that are served directly by the web server.
-   **`index.html`**: This is the main HTML file for the application.
-   **`package.json`**: This file contains the project's dependencies and scripts.
-   **`vite.config.ts`**: This file contains the configuration for the Vite build tool.

### Conventions

-   Use functional components with hooks.
-   Follow the existing file structure for components, pages, and contexts.
-   Use TypeScript for all new code.
-   Adhere to the ESLint rules defined in `eslint.config.js`.

### Running the Client

To run the client application, use the following command:

```bash
npm install
npm run dev
```