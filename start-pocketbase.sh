#!/bin/sh

# Run migrations first
/usr/local/bin/pocketbase migrate up --dir=/app/pb_data --migrationsDir=/app/pb_migrations

# Then start the server
exec /usr/local/bin/pocketbase serve --http=0.0.0.0:8090 --dir=/app/pb_data --encryptionEnv=PB_ENCRYPTION_KEY
