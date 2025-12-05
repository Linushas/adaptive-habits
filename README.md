# adaptive-abits
Habit tracker that adapts to the user's progress. Algorithm's that decrease/increase the target values for each habit depending on activity. Implementing Dynamic Difficulty Adjustment (DDA) to keep the user engaged and increase retention. The goal is to give the user just enough of a challenge to improve, but as low friction as possible to continue. 

# Development
This repo follows a monorepo-structure. 
- clients/ is where the webapp is located. 
- services/ contains the backend API's

## Run dev app
```bash
make dev
```
...and clean up:
```bash
make clean
```

## Run production app
```bash
make up
```
...or use docker compose.

Clean up with:
```bash
make down
```

# Architecture Diagram
<!-- ![](./resources/architecture_diagram.png) -->
