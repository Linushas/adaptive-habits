# Adaptive Habits
Most habit trackers are static. This project explores Dynamic Difficulty Adjustment applied to productivity, similar to how video games balance difficulty.

This habit tracker adapts to the user's progress. Using algorithms that decrease/increase the target values for each habit depending on activity. Implementing Dynamic Difficulty Adjustment to keep the user engaged and increase retention. The goal is to give the user just enough of a challenge to improve, but as low friction as possible to continue. 

**Visit the live demo:** [Setup Guide](adaptive-habits.vercel.app)
- Register and try for free. Note: project is in development and may produce severe bugs.
- If you want to *self host* the app, see instructions below.

## Project Roadmap
This project is currently **in development** (not yet MVP stage). The core habit tracking, entry logging, basic EMA algorithm (for determining next target dynamically) and basic calendar features are functional.

### Next Steps
1. Improve client responsiveness for mobile use.
2. Agent Integration & AI function/tool calling: AI Agent panel to handle natural language requests for logging and modifying habits and entries.

# Development
This repo follows a monorepo-structure. 
- clients/ is where the webapp is located. 
- services/ contains the backend APIs

Get started: [Setup Guide](./docs/SETUP_GUIDE.md)
Contribute: [CONTRIBUTING.md](./CONTRIBUTING.md)

# Production
Run the system, "self hosted", locally or host on external services. Follow the instructions in ```make setup``` to configure the database (SQLite, Local PostgreSQL, or External PostgreSQL).

If you want to host this using Vercel, Google Cloud Run, and Supabase, I have prepared a simple guide for this. See: [Hosting Guide](./docs/gcp-vercel-supabase-setup-guide.md)

## Run dev app
```bash
make dev
```
...and clean up:
```bash
make clean
```

## Run production app

### Setup
```bash
make setup
```
... then follow the instructions.

### Run
```bash
make up
```
...or use docker compose.

### Clean up
```bash
make down
```

