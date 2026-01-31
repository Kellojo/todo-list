# Todo List App

A full-stack todo list application built with SvelteKit and PocketBase.

## Features

- **Frontend**: SvelteKit with TypeScript
- **Backend**: PocketBase (SQLite-based backend with REST API)
- **Deployment**: Docker support with both services in a single container

## Prerequisites

- Node.js 18+
- npm or pnpm
- Docker (for containerized deployment)

## Development

### Local Development

Install dependencies and start both the SvelteKit frontend and PocketBase backend:

```sh
npm install
npm run dev
```

This will:

1. Download PocketBase if not already present
2. Start PocketBase on `http://localhost:8090`
3. Start SvelteKit on `http://localhost:5173`

### PocketBase Admin

Access the PocketBase admin UI at `http://localhost:8090/_/` to:

- Create collections
- Manage authentication
- Configure API rules
- View logs

### Individual Services

Run services separately:

```sh
# SvelteKit only
npm run dev:sveltekit

# PocketBase only
npm run dev:pocketbase
```

## Building

Create a production build:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Docker Deployment

### Build and Run with Docker Compose

```sh
# Build and start the container
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop the container
docker-compose down
```

The application will be available at:

- SvelteKit: `http://localhost:3000`
- PocketBase: `http://localhost:8090`

### Build Docker Image Manually

```sh
# Build the image
docker build -t todo-list-app .

# Run the container
docker run -p 3000:3000 -p 8090:8090 -v pb_data:/app/pb_data todo-list-app
```

### Data Persistence

PocketBase data is persisted in a Docker volume named `pb_data`. To reset the database:

```sh
docker-compose down -v
```

## Project Structure

```
├── src/              # SvelteKit source code
│   ├── lib/         # Shared components and utilities
│   └── routes/      # SvelteKit pages and API routes
├── scripts/         # Build and setup scripts
│   ├── setup-pocketbase.js   # Downloads PocketBase
│   └── start-pocketbase.js   # Starts PocketBase server
├── pocketbase/      # PocketBase binary (auto-downloaded)
├── pb_data/         # PocketBase database (auto-created)
├── Dockerfile       # Production container definition
├── docker-compose.yml  # Docker Compose configuration
└── supervisord.conf    # Supervisor config for running both services
```

## Connecting to PocketBase

Install the PocketBase JS SDK (already included):

```typescript
import PocketBase from "pocketbase";

const pb = new PocketBase("http://localhost:8090");

// Example: Authentication
await pb.collection("users").authWithPassword("user@example.com", "password");

// Example: CRUD operations
const records = await pb.collection("todos").getList(1, 50);
```

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
PUBLIC_POCKETBASE_URL=http://localhost:8090
```

## License

MIT
