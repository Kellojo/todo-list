#!/bin/sh
# Startup script for Docker container

# Start PocketBase in background
/usr/local/bin/pocketbase serve --http=0.0.0.0:8090 &

# Wait a moment for PocketBase to initialize
sleep 2

# Start SvelteKit
cd /app && PORT=3000 HOST=0.0.0.0 node build
