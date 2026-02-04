# Build stage for SvelteKit
FROM node:25-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build SvelteKit app
RUN npm run build

# Production stage
FROM alpine:latest AS runtime

WORKDIR /app

# Install wget and unzip for PocketBase
RUN apk add --no-cache wget unzip

# Download PocketBase
ARG POCKETBASE_VERSION=0.36.2
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip -d /usr/local/bin/ \
    && rm pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip \
    && chmod +x /usr/local/bin/pocketbase

# Create PocketBase directories
RUN mkdir -p /app/pb_data /app/pb_migrations /app/pb_hooks /app/pb_public
COPY --from=build /app/pocketbase/pb_migrations /app/pb_migrations
COPY --from=build /app/pocketbase/pb_hooks /app/pb_hooks

COPY --from=build /app/build /app/pb_public


COPY start-pocketbase.sh /app/start-pocketbase.sh
RUN chmod +x /app/start-pocketbase.sh

EXPOSE 8090

# Start PocketBase (it will serve both API and static files)
CMD ["/app/start-pocketbase.sh"]
