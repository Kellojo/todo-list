# Quick Start Guide

## Getting Started

### 1. Install Dependencies

```sh
npm install
```

### 2. Start Development Server

```sh
npm run dev
```

This will:

- Download PocketBase automatically (if not present)
- Start PocketBase on http://localhost:8090
- Start SvelteKit dev server on http://localhost:5173

### 3. Setup PocketBase Admin

1. Open http://localhost:8090/\_/ in your browser
2. Create an admin account (first time only)
3. You'll be redirected to the admin dashboard

### 4. Create Your First Collection

Example: Create a "todos" collection

1. Go to "Collections" in PocketBase admin
2. Click "New collection"
3. Set name to "todos"
4. Add fields:
   - `title` (text, required)
   - `completed` (bool, default: false)
   - `user` (relation to users)
5. Configure API rules in the "API Rules" tab

### 5. Use PocketBase in Your App

```typescript
// src/routes/+page.svelte
<script lang="ts">
import { pb } from '$lib/pocketbase';
import { onMount } from 'svelte';

let todos = [];

onMount(async () => {
  // Fetch todos
  const records = await pb.collection('todos').getList(1, 50);
  todos = records.items;
});

async function createTodo(title: string) {
  const record = await pb.collection('todos').create({
    title,
    completed: false
  });
  todos = [...todos, record];
}
</script>
```

## Docker Deployment

### Quick Deploy

```sh
# Build and run
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Access Services

- **Frontend**: http://localhost:3000
- **PocketBase Admin**: http://localhost:8090/\_/

### Data Persistence

Data is stored in a Docker volume. To backup:

```sh
docker run --rm -v todo-list_pb_data:/data -v ${PWD}:/backup alpine tar czf /backup/pb_data_backup.tar.gz -C /data .
```

To restore:

```sh
docker run --rm -v todo-list_pb_data:/data -v ${PWD}:/backup alpine tar xzf /backup/pb_data_backup.tar.gz -C /data
```

## Troubleshooting

### Port Already in Use

If port 8090 or 5173 is already in use:

```sh
# Kill process on port 8090 (Windows)
netstat -ano | findstr :8090
taskkill /PID <PID> /F

# Or change the port in scripts/start-pocketbase.js
```

### PocketBase Not Downloading

Manually download from: https://pocketbase.io/docs/

Extract to `./pocketbase/` directory.

### Docker Build Fails

Clear Docker cache:

```sh
docker system prune -a
docker-compose build --no-cache
```

## Next Steps

- [ ] Configure authentication in PocketBase
- [ ] Create your data collections
- [ ] Set up API rules and permissions
- [ ] Connect your SvelteKit frontend to PocketBase
- [ ] Deploy to production with Docker

## Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [PocketBase JS SDK](https://github.com/pocketbase/js-sdk)
