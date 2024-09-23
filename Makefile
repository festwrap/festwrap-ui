.PHONY: pre-commit-install
pre-commit-install:
	pre-commit install
	pre-commit install --hook-type commit-msg


.PHONY: install-deps
install-deps:
	npm install

.PHONY: create-env-from-template
create-env-from-template:
	cp .env.template .env

.PHONY: local-setup
local-setup: pre-commit-install install-deps create-env-from-template

.PHONY: run-app
run-app:
	@echo "Starting the frontend app..."
	@export $(shell cat .env | xargs) && npm run dev

.PHONY: run-tests
run-tests:
	@echo "Running tests..."
	npm run test
