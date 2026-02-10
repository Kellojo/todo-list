# Todo List

A small todo list application built with SvelteKit and PocketBase, designed for easy deployment with Docker in a single container.

## Features

- 🗂️ Maintain multiple todo lists
- ✏️ Add, edit, and delete todos
- ⚡ Real-time updates using PocketBase's real-time API
- 📱 Responsive design for desktop and mobile
- 🔐 User authentication (email/password and OAuth/OIDC providers)
- 👥 Multi-user support with separate todo lists for each user
- 🐳 Single container deployment with Docker

Technologies used:

- **Frontend**: SvelteKit with TypeScript
- **Backend**: PocketBase (SQLite-based backend with REST API)
- **Deployment**: Docker container including both frontend and backend exposing a single port (8090)

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

### Setting up OIDC/OAuth Providers

To enable OIDC/OAuth providers, you need to configure them in PocketBase:

1. Open the PocketBase admin interface at `http://localhost:8090/_/` and navigate to `Collections > Users > Edit Collection`.

2. Navigate to the "Options" tab and enable OAuth2. Then, add your desired OAuth providers (e.g., Google, GitHub) with the appropriate client IDs and secrets.

3. Once configured, the enabled providers will automatically appear on the login page of the Todo List app.

> [!NOTE]  
> Make sure your users have a verified email address setup in the provider. Otherwise the login will fail.

### Disabling Email/Password Authentication

If you want to disable email/password authentication and only allow OAuth/OIDC providers, you can do so in the PocketBase admin interface:

1. Open the PocketBase admin interface at `http://localhost:8090/_/` and navigate to `Collections > Users > Edit Collection`.
2. Navigate to the "Options" tab and disable the "Email/Password" authentication method.

## Development

1. Ensure you have Node.js, npm and docker/docker compose installed
2. Clone the repository
3. Install dependencies with `npm i`
4. Start the development server with `npm run dev`
5. Access the app at `http://localhost:5173`

Happy contributing!
