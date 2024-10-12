.PHONY: install-deps create-env-from-template local-setup run-app run-build run-start run-tests run-lint run-checks

ENV_VARS := $(shell cat .env | xargs)

install-deps:
	npm install

create-env-from-template:
	cp .env.template .env

local-setup: install-deps create-env-from-template

run-app:
	@echo "Starting the frontend app..."
	@export $(ENV_VARS) && npm run dev

run-build:
	@echo "Building the frontend app..."
	@export $(ENV_VARS) && npm run build

run-start:
	@echo "Starting the production build locally..."
	@export $(ENV_VARS) && npm run start

run-tests:
	@echo "Running tests..."
	npm run test

run-lint:
	@echo "Running linter..."
	npm run lint

run-checks: run-lint run-tests
