# Docker Setup Guide for Code A2Z

This guide explains how to use Docker for development in the **Code A2Z** project. The Docker setup is organized by directory:

- **`server/`** — Backend + MongoDB (server development)
- **`client/`** — Frontend only (UI development with deployed backend)
- **Root (`/`)** — Full Stack (complete development environment)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (version 20.10 or higher)
  - [Download for macOS](https://docs.docker.com/desktop/install/mac-install/)
  - [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)
- **Docker Compose** (included with Docker Desktop)

Verify installation:

```bash
docker --version
docker-compose --version
```

---

## Project Structure

```
code-a2z/
├── docker-compose.yaml         # Full stack (client + server + mongo)
├── client/
│   ├── Dockerfile              # Frontend Docker image
│   ├── docker-compose.yaml     # Frontend only
│   ├── nginx.conf              # Production nginx config
│   └── .dockerignore
└── server/
    ├── Dockerfile              # Backend Docker image
    ├── docker-compose.yaml     # Backend + MongoDB
    └── .dockerignore
```

---

## Quick Start

### Option 1: Backend-Only Development (Server + MongoDB)

**Use when:** Working on backend features, APIs, or database logic.

**From root directory:**

```bash
npm run docker:server:up

# View logs
npm run docker:server:logs

# Stop when done
npm run docker:server:down
```

**Or from server directory:**

```bash
cd server
npm run docker:up

# View logs
npm run docker:logs
```

**Access:**

- Backend API: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017/code-a2z`
- mongo-express: `http://localhost:8081` (admin/admin123)

**Environment:**

- Uses `server/.env` configuration
- MongoDB data persists in Docker volume
- Hot reload enabled with nodemon

---

### Option 2: Frontend-Only Development (Client)

**Use when:** Working on UI/UX, components, or client-side features without backend changes.

**From root directory:**

```bash
npm run docker:client:up

# View logs
npm run docker:client:logs

# Stop when done
npm run docker:client:down
```

**Or from client directory:**

```bash
cd client
npm run docker:up

# View logs
npm run docker:logs
```

**Access:**

- Frontend: `http://localhost:5173`

**Environment:**

- Uses `client/.env` configuration
- Connects to deployed backend at `https://code-a2z-server.vercel.app`
- Hot reload enabled with Vite
- No backend or database required

---

### Option 3: Full Stack Development (Client + Server + MongoDB)

**Use when:** Working on features that require both frontend and backend changes.

**From root directory:**

```bash
npm run docker:up

# View logs for all services
npm run docker:logs

# View logs for specific service
docker-compose logs -f client
docker-compose logs -f server
docker-compose logs -f mongo

# Stop when done
npm run docker:down
```

**Access:**

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- MongoDB: `mongodb://localhost:27017/code-a2z`
- mongo-express: `http://localhost:8081` (admin/admin123)

**Environment:**

- Uses both `client/.env` and `server/.env`
- All services communicate via Docker network
- Hot reload enabled for both client and server
- MongoDB data persists in Docker volume

---

## NPM Scripts

### Root Directory Commands

You can run **all Docker commands from the root directory** for convenience:

#### Full Stack (Client + Server + MongoDB)

```bash
npm run docker:up          # Start all services
npm run docker:down        # Stop all services
npm run docker:logs        # View all logs (real-time)
npm run docker:build       # Build all images
npm run docker:restart     # Restart all services
npm run docker:clean       # Remove containers, volumes, and prune system
```

#### Frontend Only

```bash
npm run docker:client:up       # Start frontend only
npm run docker:client:down     # Stop frontend only
npm run docker:client:logs     # View frontend logs (real-time)
npm run docker:client:build    # Build frontend image
npm run docker:client:restart  # Restart frontend
```

#### Backend Only (Server + MongoDB)

```bash
npm run docker:server:up       # Start backend + MongoDB
npm run docker:server:down     # Stop backend + MongoDB
npm run docker:server:logs     # View backend logs (real-time)
npm run docker:server:build    # Build backend image
npm run docker:server:restart  # Restart backend
```

---

### Client Directory Commands

If you're working exclusively in the `client/` directory:

```bash
cd client
npm run docker:up          # Start frontend
npm run docker:down        # Stop frontend
npm run docker:logs        # View frontend logs
npm run docker:build       # Build frontend image
npm run docker:restart     # Restart frontend
```

---

### Server Directory Commands

If you're working exclusively in the `server/` directory:

```bash
cd server
npm run docker:up          # Start backend + MongoDB
npm run docker:down        # Stop backend + MongoDB
npm run docker:logs        # View backend logs
npm run docker:build       # Build backend image
npm run docker:restart     # Restart backend
```

---

## Detailed Commands

### Building Images

```bash
# Backend only
cd server
docker-compose build
# or
npm run docker:build

# Frontend only
cd client
docker-compose build
# or
npm run docker:build

# Full stack (from root)
docker-compose build
# or
npm run docker:build

# Force rebuild without cache
docker-compose build --no-cache
```

### Starting Services

```bash
# Start in foreground (see logs)
docker-compose up

# Start in background (detached)
docker-compose up -d
# or
npm run docker:up

# Start specific service (full stack only)
docker-compose up client
docker-compose up server
```

### Stopping Services

```bash
# Stop all services
docker-compose down
# or
npm run docker:down

# Stop and remove volumes (deletes MongoDB data)
docker-compose down -v

# Stop specific service
docker-compose stop client
```

### Viewing Logs

```bash
# All services
docker-compose logs
# or
npm run docker:logs

# Follow logs (real-time)
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f client

# Last 100 lines
docker-compose logs --tail=100
```

### Executing Commands in Containers

```bash
# Open shell in backend container
docker exec -it code-a2z-server sh

# Open shell in frontend container
docker exec -it code-a2z-client sh

# Run npm command in container
docker exec -it code-a2z-server npm install <package-name>
docker exec -it code-a2z-client npm install <package-name>

# Access MongoDB shell
docker exec -it code-a2z-mongo mongosh
```

---

## MongoDB Interaction & Data Inspection

When your API isn't working properly or you want to verify data storage, you have several options to interact with MongoDB.

### Option 1: mongo-express - Web-based GUI (Recommended for Docker)

**mongo-express** is a web-based MongoDB admin interface that runs as a Docker container alongside your database.

**Access:**

- URL: `http://localhost:8081`
- Username: `admin`
- Password: `admin123`

**Features:**

- ✅ Browser-based interface - No installation required
- ✅ Visual database browser with collections
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Document viewer and editor
- ✅ Query builder
- ✅ Import/Export data
- ✅ Automatic updates when data changes
- ✅ Runs automatically with your Docker setup

**Usage:**

1. Start your Docker environment:

```bash
# Full stack
npm run docker:up

# Or backend only
npm run docker:server:up
```

2. Open browser and navigate to `http://localhost:8081`

3. Login with credentials:
   - Username: `admin`
   - Password: `admin123`

4. Select `code-a2z` database

5. Browse collections (users, projects, comments, etc.)

6. View, edit, or delete documents directly

**Common Tasks:**

- **View all users**: Click on `users` collection → View Documents
- **Search documents**: Use the search bar at the top
- **Edit document**: Click on document → Click Edit → Modify → Save
- **Delete document**: Click on document → Delete button
- **Add new document**: Click "New Document" → Enter JSON → Save
- **Export collection**: Click on collection → Export

> [!TIP]
> mongo-express is automatically started when you run `npm run docker:up` or `npm run docker:server:up`. No extra setup needed!

> [!WARNING]
> The default credentials (`admin`/`admin123`) are for development only. Change them in production by modifying the `ME_CONFIG_BASICAUTH_USERNAME` and `ME_CONFIG_BASICAUTH_PASSWORD` environment variables in `docker-compose.yaml`.

---

### Option 2: MongoDB Shell (mongosh) - Command Line

Access the MongoDB shell directly from your terminal:

```bash
# Access MongoDB shell
docker exec -it code-a2z-mongo mongosh

# Once inside mongosh, use these commands:
show dbs                              # List all databases
use code-a2z                          # Switch to code-a2z database
show collections                      # List all collections

# View documents
db.users.find()                       # Get all users
db.users.find().pretty()              # Get all users (formatted)
db.users.findOne()                    # Get one user
db.users.find({ email: "test@example.com" })  # Find by field

db.projects.find()                    # Get all projects
db.projects.countDocuments()          # Count projects

# Find with specific fields
db.users.find({}, { fullname: 1, email: 1, _id: 0 })

# Sort and limit
db.projects.find().sort({ createdAt: -1 }).limit(10)

# Exit mongosh
exit
```

### Option 3: MongoDB Compass - GUI Tool

**MongoDB Compass** is the official GUI tool for MongoDB. It's the easiest way to visualize and interact with your data.

**Installation:**

1. Download from [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
2. Install and open MongoDB Compass

**Connection:**

```
Connection String: mongodb://localhost:27017
```

**Features:**

- ✅ Visual database browser
- ✅ Query builder with autocomplete
- ✅ Document editor
- ✅ Performance monitoring
- ✅ Index management
- ✅ Schema analysis

**Steps:**

1. Open MongoDB Compass
2. Enter connection string: `mongodb://localhost:27017`
3. Click "Connect"
4. Navigate to `code-a2z` database
5. Explore collections: `users`, `projects`, `comments`, etc.

### Option 4: VS Code Extensions

Install MongoDB extensions in VS Code:

**Recommended Extension:**

- **MongoDB for VS Code** (by MongoDB)
  - Extension ID: `mongodb.mongodb-vscode`

**Setup:**

1. Install the extension
2. Click MongoDB icon in sidebar
3. Add connection: `mongodb://localhost:27017`
4. Browse databases and collections
5. Run queries directly in VS Code

### Option 5: mongosh One-Liners

Execute queries directly from your terminal without entering the shell:

```bash
# List all databases
docker exec -it code-a2z-mongo mongosh --eval "show dbs"

# Count users
docker exec -it code-a2z-mongo mongosh code-a2z --eval "db.users.countDocuments()"

# Find specific user
docker exec -it code-a2z-mongo mongosh code-a2z --eval 'db.users.findOne({ email: "test@example.com" })'

# Get all project titles
docker exec -it code-a2z-mongo mongosh code-a2z --eval 'db.projects.find({}, { title: 1, _id: 0 })'
```

### Common MongoDB Queries for Debugging

```javascript
// Inside mongosh (docker exec -it code-a2z-mongo mongosh)

use code-a2z

// Check if user exists
db.users.findOne({ email: "user@example.com" })

// Check recent projects
db.projects.find().sort({ createdAt: -1 }).limit(5).pretty()

// Count documents in each collection
db.users.countDocuments()
db.projects.countDocuments()
db.comments.countDocuments()

// Find projects by author
db.projects.find({ "author.email": "user@example.com" }).pretty()

// Check for draft vs published projects
db.projects.countDocuments({ draft: true })
db.projects.countDocuments({ draft: false })

// Find recent notifications
db.notifications.find().sort({ createdAt: -1 }).limit(10).pretty()

// Check indexes
db.users.getIndexes()
db.projects.getIndexes()

// Database stats
db.stats()
```

### Backup and Restore MongoDB Data

**Backup:**

```bash
# Create backup directory
mkdir -p ./backups

# Backup all databases
docker exec code-a2z-mongo mongodump --out /data/backup

# Copy backup to host
docker cp code-a2z-mongo:/data/backup ./backups/

# Or backup directly to host
docker exec code-a2z-mongo mongodump --out /data/backup && \
docker cp code-a2z-mongo:/data/backup ./backups/mongodb-backup-$(date +%Y%m%d)
```

**Restore:**

```bash
# Copy backup to container
docker cp ./backups/mongodb-backup-20250120 code-a2z-mongo:/data/restore

# Restore database
docker exec code-a2z-mongo mongorestore /data/restore
```

### Export/Import Specific Collections

**Export to JSON:**

```bash
# Export users collection
docker exec code-a2z-mongo mongoexport --db=code-a2z --collection=users --out=/data/users.json

# Copy to host
docker cp code-a2z-mongo:/data/users.json ./users.json
```

**Import from JSON:**

```bash
# Copy to container
docker cp ./users.json code-a2z-mongo:/data/users.json

# Import
docker exec code-a2z-mongo mongoimport --db=code-a2z --collection=users --file=/data/users.json
```

### MongoDB Container Logs

View MongoDB logs to debug connection issues:

```bash
# View MongoDB logs
docker logs code-a2z-mongo

# Follow logs in real-time
docker logs -f code-a2z-mongo

# Last 100 lines
docker logs --tail=100 code-a2z-mongo
```

### Quick MongoDB Health Check

```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check MongoDB status
docker exec -it code-a2z-mongo mongosh --eval "db.adminCommand('ping')"

# Check database size
docker exec -it code-a2z-mongo mongosh code-a2z --eval "db.stats()"
```

---

## Environment Configuration

### Backend Environment Variables

Create `server/.env` from `server/.env.example`:

```bash
cd server
cp .env.example .env
```

**Important variables for Docker:**

```env
# For backend-only or fullstack mode
MONGODB_URL=mongodb://mongo:27017/code-a2z

# Other required variables
JWT_SECRET_ACCESS_KEY=your_secret_key
JWT_SECRET_REFRESH_KEY=your_refresh_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=your_email
RESEND_API_KEY=your_resend_key
```

### Frontend Environment Variables

Create `client/.env` from `client/.env.example`:

```bash
cd client
cp .env.example .env
```

**For frontend-only mode (deployed backend):**

```env
VITE_SERVER_DOMAIN=https://code-a2z-server.vercel.app
```

**For fullstack mode (local backend):**

```env
VITE_SERVER_DOMAIN=http://localhost:8000
```

> [!NOTE]
> When using fullstack Docker, the frontend can also access the backend via the Docker network using `http://server:8000`, but `http://localhost:8000` works fine since ports are exposed.

---

## Volume Management

### Persistent Data

MongoDB data is stored in a Docker volume to persist across container restarts.

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect code-a2z_mongo-data

# Remove volume (deletes all database data)
docker volume rm code-a2z_mongo-data
```

### Node Modules

Node modules are stored in anonymous volumes to improve performance:

```bash
# Client container has: /app/node_modules
# Server container has: /app/node_modules
```

This prevents conflicts between host and container dependencies.

---

## Troubleshooting

### Port Already in Use

**Error:** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution:**

```bash
# Find and kill the process using the port
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
lsof -ti:27017 | xargs kill -9

# Or change port in docker-compose file
```

### MongoDB Connection Failed

**Error:** `MongoServerError: Authentication failed`

**Solution:**

- Ensure `MONGODB_URL` in `server/.env` is set to `mongodb://mongo:27017/code-a2z`
- Remove volumes and restart: `docker-compose down -v && docker-compose up`

### Hot Reload Not Working

**Frontend:**

- Ensure Vite is started with `--host 0.0.0.0` flag (already configured)
- Check that `src` directory is mounted as volume

**Backend:**

- Ensure nodemon is watching the correct directories
- Check that `src` directory is mounted as volume

### Permission Denied Errors

**macOS/Linux:**

```bash
# Fix permissions
sudo chown -R $USER:$USER .
```

**Windows:**

- Run Docker Desktop as Administrator
- Enable WSL 2 backend

### Build Failures

```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache

# Remove all containers and images
docker-compose down
docker system prune -a
```

### Cannot Connect to Backend from Frontend

**Solution:**

- Ensure both services are on the same Docker network
- Check `VITE_SERVER_DOMAIN` environment variable
- For fullstack mode, use `http://localhost:8000` (not `http://server:8000` from browser)

---

## Production Build

### Frontend Production Build

```bash
# Build production image
cd client
docker build --target production -t code-a2z-client:prod .

# Run production container
docker run -p 80:80 code-a2z-client:prod
```

**Access:** `http://localhost`

### Backend Production Build

```bash
# Build production image
cd server
docker build --target production -t code-a2z-server:prod .

# Run production container
docker run -p 8000:8000 --env-file .env code-a2z-server:prod
```

---

## Docker Compose File Reference

### Backend Only: `server/docker-compose.yaml`

- **Location:** `server/docker-compose.yaml`
- **Services:** `server`, `mongo`
- **Networks:** `code-a2z-network`
- **Volumes:** `mongo-data` (persistent)
- **Ports:** 8000 (server), 27017 (mongo)
- **Usage:** `cd server && npm run docker:up`

### Frontend Only: `client/docker-compose.yaml`

- **Location:** `client/docker-compose.yaml`
- **Services:** `client`
- **Networks:** `code-a2z-network`
- **Ports:** 5173 (client)
- **External API:** Uses deployed backend
- **Usage:** `cd client && npm run docker:up`

### Full Stack: `docker-compose.yaml`

- **Location:** Root directory (`docker-compose.yaml`)
- **Services:** `client`, `server`, `mongo`
- **Networks:** `code-a2z-network`
- **Volumes:** `mongo-data` (persistent)
- **Ports:** 5173 (client), 8000 (server), 27017 (mongo)
- **Usage:** `npm run docker:up` (from root)

---

## Best Practices

### Development

1. **Use volume mounts** for hot reload during development
2. **Keep `.env` files up to date** with required variables
3. **Run `docker-compose logs -f`** to monitor issues in real-time
4. **Use named volumes** for databases to prevent data loss

### Cleanup

```bash
# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Remove all volumes (WARNING: deletes database data)
docker volume prune

# Complete cleanup
docker system prune -a --volumes
```

### Optimization

1. **Use multi-stage builds** for smaller production images
2. **Leverage `.dockerignore`** to exclude unnecessary files
3. **Cache dependencies** by copying `package.json` before source code
4. **Use Alpine images** for smaller footprint

---

## Switching Between Modes

### From Frontend-Only to Full Stack

```bash
# Stop frontend-only (from root)
npm run docker:client:down

# Update client/.env
echo "VITE_SERVER_DOMAIN=http://localhost:8000" > client/.env

# Start full stack
npm run docker:up
```

### From Full Stack to Backend-Only

```bash
# Stop full stack (from root)
npm run docker:down

# Start backend only
npm run docker:server:up
```

### From Backend-Only to Frontend-Only

```bash
# Stop backend (from root)
npm run docker:server:down

# Start frontend
npm run docker:client:up
```

### Quick Switch Examples

```bash
# Switch from client to server
npm run docker:client:down && npm run docker:server:up

# Switch from server to full stack
npm run docker:server:down && npm run docker:up

# Restart everything
npm run docker:down && npm run docker:up
```

---

## Common Use Cases

### 1. Working on Backend APIs

**From root directory:**

```bash
npm run docker:server:up
# Make changes to server/src files
# Changes auto-reload with nodemon

# View logs
npm run docker:server:logs

# Stop when done
npm run docker:server:down
```

**Or from server directory:**

```bash
cd server
npm run docker:up
# Make changes to server/src files
# Changes auto-reload with nodemon
```

### 2. Working on UI Components

**From root directory:**

```bash
npm run docker:client:up
# Make changes to client/src files
# Changes auto-reload with Vite

# View logs
npm run docker:client:logs

# Stop when done
npm run docker:client:down
```

**Or from client directory:**

```bash
cd client
npm run docker:up
# Make changes to client/src files
# Changes auto-reload with Vite
```

### 3. Full Feature Development

**From root directory:**

```bash
npm run docker:up
# Work on both frontend and backend
# Both auto-reload on changes

# View all logs
npm run docker:logs

# Stop when done
npm run docker:down
```

### 4. Database Operations

```bash
# Access MongoDB shell
docker exec -it code-a2z-mongo mongosh

# Backup database
docker exec code-a2z-mongo mongodump --out /backup

# Restore database
docker exec code-a2z-mongo mongorestore /backup
```

### 5. Rebuilding Images After Dependency Changes

**From root directory:**

```bash
# Rebuild specific service
npm run docker:client:build
npm run docker:server:build

# Or rebuild all services
npm run docker:build
```

### 6. Cleaning Up Docker Resources

**From root directory:**

```bash
# Stop and remove all containers, volumes, and prune system
npm run docker:clean

# Or just stop services
npm run docker:down
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Docker Hub](https://hub.docker.com/_/node)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

---

## Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review Docker logs: `docker-compose logs -f`
3. Verify environment variables in `.env` files
4. Ensure Docker Desktop is running
5. Try rebuilding: `docker-compose build --no-cache`
6. Ask in the project's Discord community

---

## Summary

| Mode              | Root Command               | Directory Command                | Use Case                                |
| ----------------- | -------------------------- | -------------------------------- | --------------------------------------- |
| **Full Stack**    | `npm run docker:up`        | N/A                              | Features requiring both FE & BE changes |
| **Frontend Only** | `npm run docker:client:up` | `cd client && npm run docker:up` | UI/UX, components, client-side logic    |
| **Backend Only**  | `npm run docker:server:up` | `cd server && npm run docker:up` | API development, database work          |

**Directory Structure:**

- **Root**: Full stack development (`docker-compose.yaml`)
- **`client/`**: Frontend-only development (`docker-compose.yaml`)
- **`server/`**: Backend-only development (`docker-compose.yaml`)

**Access URLs:**

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **MongoDB**: `mongodb://localhost:27017/code-a2z`
- **mongo-express**: `http://localhost:8081` (admin/admin123)

**Pro Tip:** All commands can be run from the root directory for maximum convenience! 🚀

### Complete Command Reference

```bash
# Full Stack (from root)
npm run docker:up                # Start all services
npm run docker:down              # Stop all services
npm run docker:logs              # View logs
npm run docker:build             # Build images
npm run docker:restart           # Restart services
npm run docker:clean             # Clean up everything

# Frontend Only (from root)
npm run docker:client:up         # Start frontend
npm run docker:client:down       # Stop frontend
npm run docker:client:logs       # View logs
npm run docker:client:build      # Build image
npm run docker:client:restart    # Restart

# Backend Only (from root)
npm run docker:server:up         # Start backend + MongoDB
npm run docker:server:down       # Stop backend + MongoDB
npm run docker:server:logs       # View logs
npm run docker:server:build      # Build image
npm run docker:server:restart    # Restart
```

Choose the mode that fits your development needs and start coding! 🚀
