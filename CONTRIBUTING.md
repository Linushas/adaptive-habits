# Contributing to Adaptive Habits
Thanks for taking the time to contribute!

Contributions of all forms are welcomed. This guide will help you get started.

## Project Structure

This is a monorepo containing both the frontend and backend services:

- **`clients/adaptive-habits-web-app`**: The frontend application (TypeScript, Next.js, React, Tailwind CSS).
- **`services/process-api-habits`**: The backend API (Python, FastAPI, SQLModel).
- **`docs/`**: Documentation.
- **`resources/`**: Design assets and diagrams.

## Getting Started

### Prerequisites
- **Docker & Docker Compose**
- **Node.js**
- **Python**
- **Make**

### Quick Start
A `Makefile` is used for development.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Linushas/adaptive-habits.git
    cd adaptive-habits
    ```

2.  **Run the Development Environment**
    To set up the Python virtual environment, install dependencies for both services, and start the app in dev mode:
    ```bash
    make dev
    ```

    * **Frontend:** `http://localhost:3000`
    * **Backend:** `http://localhost:8000`

3.  **Clean Up**
    To stop servers and remove temporary files:
    ```bash
    make clean
    ```

Please read the **[Setup Guide](docs/SETUP_GUIDE.md)**.

## Development Workflow

### Database
The project uses a local SQLite database by default (see `services/process-api-habits/app/db.py`).

**To reset the database (wipe all data):**
```bash
make db-reset
```

### Frontend Development
- The web app: `clients/adaptive-habits-web-app`.
- Stack: TypeScript, NEXT.js and Tailwind CSS is used.

### Backend Development
- Backend API: `services/process-api-habits`.
- Stack: Python, FastAPI and SQLModel.
- Authentication: We use JWTs (`python-jose`). If you are modifying auth logic, please check [Architecture Docs](docs/ARCHITECTURE.md) first.

## Submission Guidelines
1. **Search Issues:** Check if the issue or feature is already being worked on.
2. **Fork & Branch:** Create a new branch for your feature or fix.
    - Example: `feat/feature-name` or `fix/bug-description`.
3. **Format Code:** Run the formatter before committing to ensure styles match.
```bash
make format
```
4. **Commit Messages:** Write clear, descriptive commit messages. Use the prefixes `feat:` or `fix:`.
5. **Pull Request:**
    - Open a PR against the `main` branch.
    - Provide a description of changes.
    - Link any related issues.

## Coding Standards
- **Generative AI / Vibe Coding**: AI-assisted development (Cursor, Copilot, LLMs) is embraced. Note: You are fully responsible for the code you commit. Ensure you understand the logic, security, and that it fits the project structure.

### Formatting & Style
Automated formatters are used to maintain consistency. Please run ```make format``` before pushing. 
- Frontend: Prettier
- Backend: Black 

(Python: Follow PEP 8 guidelines.)

## Documentation
If you change an API endpoint or add a major feature, please update the relevant documentation:
- **API Changes:** Update `docs/API_SPECS.md`.
- **Architectural Changes:** Update `docs/ARCHITECTURE.md`.

Thank you for contributing!
