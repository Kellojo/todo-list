# Build stage for SvelteKit
FROM node:25-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build SvelteKit app
RUN npm run build

# Production stage
FROM node:25-alpine AS runtime

WORKDIR /app

# Install supervisor to manage multiple processes
RUN apk add --no-cache supervisor wget unzip

# Create supervisor log directory
RUN mkdir -p /var/log/supervisor /var/run

# Download PocketBase
ARG POCKETBASE_VERSION=0.23.6
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip -d /usr/local/bin/ \
    && rm pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip \
    && chmod +x /usr/local/bin/pocketbase

# Create PocketBase data directory
RUN mkdir -p /app/pb_data
RUN mkdir -p /app/pb_migrations

# Copy built SvelteKit app
COPY /pocketbase/pb_migrations /app/pb_migrations
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Expose ports (SvelteKit on 3000, PocketBase on 8090)
EXPOSE 3000 8090

# Start supervisor to run both services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
