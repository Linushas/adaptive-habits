include services/process-api-habits/.env
export

.PHONY: up down logs restart db-reset

up:
	@echo "Starting backend..."
	docker compose up -d --build
	@echo "Backend running on http://localhost:8000"

down:
	@echo "Stopping backend..."
	docker compose down
