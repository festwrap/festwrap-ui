ENV_FILE = .env
ENV_VARS := $(shell cat $(ENV_FILE) | xargs)

IMAGE_NAME ?= festwrap-ui
IMAGE_TAG ?= latest
CONTAINER_NAME ?= festwrap-ui

.PHONY: install-deps
install-deps:
	npm install

.PHONY: create-env-from-template
create-env-from-template:
	cp .env.template .env

.PHONY: local-setup
local-setup: install-deps create-env-from-template

.PHONY: run-dev
run-dev:
	@echo "Starting the frontend app..."
	@export $(ENV_VARS) && npm run dev

.PHONY: run-start
run:
	@echo "Starting the production build locally..."
	@export $(ENV_VARS) && npm run build && npm run start

.PHONY: run-tests
run-tests:
	@echo "Running tests..."
	npm run test

.PHONY: run-lint
run-lint:
	@echo "Running linter..."
	npm run lint

.PHONY: run-checks
run-checks: run-lint run-tests

.PHONY: build-image
build-image:
	docker build -f Dockerfile -t ${IMAGE_NAME}:${IMAGE_TAG} .

.PHONY: run-docker
run-docker: build-image
	@export $(ENV_VARS) && \
	docker run \
		--env-file $(ENV_FILE) \
		-e SERVER_HOST=http://host.docker.internal \
		--name $(CONTAINER_NAME) \
		-p $$PORT:$$PORT \
		-t $(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: stop-docker
stop-docker:
	@docker container stop $(CONTAINER_NAME) && docker container rm $(CONTAINER_NAME)
