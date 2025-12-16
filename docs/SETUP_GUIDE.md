# Setup Guide

## Install & Run
Clone this repository: ```git clone https://github.com/Linushas/adaptive-habits.git```

### Run dev app
```bash
make dev
```
...and clean up:
```bash
make clean
```

### Run production app
```bash
make up
```
...or use docker compose.

Quit with:
```bash
make down
```

## File structure

```md
.
├── README.md
├── docker-compose.yaml
├── Makefile
├── CONTRIBUTING.md
├── **docs**
│   ├── API_SPECS.md
│   ├── ARCHITECTURE.md
│   |── SETUP_GUIDE.md
|   └── ...
├── **resources**
│   ├── **Figma UI Design**
│   |── icon.png
|   └── ...
├── **clients**
│   └── **adaptive-habits-web-app**
└── **services**
    └── **habits-service**
```
