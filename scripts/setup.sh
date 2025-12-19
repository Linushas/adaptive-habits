#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

echo "Adaptive Habits - setup!"
echo "Choose database?"
echo "1) SQLite (default)"
echo "2) PostgreSQL"
read -p "Välj (1/2): " choice

if [ "$choice" == "2" ]; then
    echo "Configuring for PostgreSQL..."
    
    read -p "Enter user (default: myuser): " DB_USER
    DB_USER=${DB_USER:-myuser}
    
    read -p "Enter password (default: mypassword): " DB_PASS
    DB_PASS=${DB_PASS:-mypassword}

    echo "COMPOSE_PROFILES=postgres" > "$PROJECT_ROOT/.env"
    echo "DB_USER=$DB_USER" >> "$PROJECT_ROOT/.env"
    echo "DB_PASSWORD=$DB_PASS" >> "$PROJECT_ROOT/.env"
    echo "DB_NAME=adaptive_habits_db" >> "$PROJECT_ROOT/.env"
    echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASS@db:5432/adaptive_habits_db" >> "$PROJECT_ROOT/.env"

else
    echo "Configuring for SQLite..."
    echo "COMPOSE_PROFILES=" > "$PROJECT_ROOT/.env"
    echo "DATABASE_URL=sqlite:////data/adaptive_habits.db" >> "$PROJECT_ROOT/.env"
    echo "DB_USER=user" >> "$PROJECT_ROOT/.env"
    echo "DB_PASSWORD=pass" >> "$PROJECT_ROOT/.env"
    echo "DB_NAME=db" >> "$PROJECT_ROOT/.env"
fi

echo "Done! Run 'make up' to start."
