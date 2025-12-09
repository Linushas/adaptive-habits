include services/process-api-habits/.env
export

.PHONY: up down db-reset dev

up:
	@echo "Starting app..."
	docker compose up -d --build
	@echo "Backend API running on http://localhost:8000"
	@echo "Frontend app running on http://localhost:3000"

dev:
	cd ./services/process-api-habits; python3 -m venv venv; source venv/bin/activate; pip install -r requirements.txt; uvicorn app.main:app --reload & \
	cd ../../clients/adaptive-habits-web-app; npm run dev

clean:
	npx kill-port 8000
	rm -rf ./services/process-api-habits/venv
	npx kill-port 3000
	rm -rf ./clients/adaptive-habits-web-app/.next

down:
	@echo "Stopping backend..."
	docker compose down

db-reset:
	rm -rf ./services/process-api-habits/adaptive_habits.db
