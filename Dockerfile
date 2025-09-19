ARG NODE_VERSION="18"
ARG DOCKER_TAG="bookworm-slim"

FROM node:${NODE_VERSION}-${DOCKER_TAG} as builder

WORKDIR /app

COPY . ./
RUN npm ci && npm run build


FROM node:${NODE_VERSION}-${DOCKER_TAG}

WORKDIR /app

ARG USERNAME=frontend
ARG USER_UID=1001
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

COPY --from=builder /app .

RUN CACHE_DIR=.next/cache mkdir -p $CACHE_DIR && chown -R $USERNAME:$USER_GID $CACHE_DIR

USER $USERNAME
EXPOSE $PORT

CMD ["npm", "run", "start"]