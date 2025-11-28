include services/process-api-habits/.env
export

.PHONY: up down logs restart db-reset

up:
	@echo "Starting Supabase..."
	supabase start
	@echo "Starting backend..."
	docker compose up -d --build
	@echo "Backend running on http://localhost:8000"

down:
	@echo "Stopping API..."
	docker compose down
	@echo "Stopping Supabase..."
	supabase stop
