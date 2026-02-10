# Todo List App

A small todo list application built with SvelteKit and PocketBase, designed for easy deployment with Docker in a single container.

## Features

- Maintain multiple todo lists
- Add, edit, and delete todos
- Real-time updates using PocketBase's real-time API
- Responsive design for desktop and mobile
- User authentication (email/password and OAuth/OIDC providers)
- Multi-user support with separate todo lists for each user
- Single container deployment with Docker

- **Frontend**: SvelteKit with TypeScript
- **Backend**: PocketBase (SQLite-based backend with REST API)
- **Deployment**: Docker support with both services in a single container

## Setup and Installation

**Using Docker Compose (Recommended):**

```yaml
services:
  todo-list:
    container_name: todo-list
    image: ghcr.io/kellojo/todo-list:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PB_ENCRYPTION_KEY=YOUR 32 Char Encryption Key
    volumes:
      - ./pb_data:/app/pb_data
      - ./background.png:/app/pb_public/_app/immutable/assets/background.png:ro # Optional: Mount custom background image
    ports:
      - "8090:8090"
```

1. Create a `docker-compose.yml` file with the above content
2. Replace `YOUR 32 Char Encryption Key` with a secure 32-character string
3. Run `docker compose up -d` to start the application
4. Access the app at `http://localhost:8090`

## Development

1. Ensure you have Node.js, npm and docker/docker compose installed
2. Clone the repository
3. Install dependencies with `npm i`
4. Start the development server with `npm run dev`
5. Access the app at `http://localhost:5173`

Happy contributing!
