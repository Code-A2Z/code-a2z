# SETUP PROJECT

## Local Development Setup

This guide explains two ways to run the **Code A2Z** project locally:

1. **Full Project Development** — Run backend + frontend + local MongoDB
2. **Frontend-Only Development** — Run only the client using the deployed backend: `https://code-a2z-server.vercel.app`

> [!IMPORTANT]
> Your `.env.example` already contains **both modes**.
> Simply copy → rename → uncomment the section you need.

---

## 1. Full Project Development (Backend + Frontend + Local MongoDB)

This mode is recommended for contributors working on backend features, APIs, authentication, or database-related flows.

### Requirements

- Node.js (LTS recommended)
- npm
- MongoDB installed locally (`mongodb://127.0.0.1:27017/`)

> [!NOTE]
> If MongoDB is not running, the backend server **will fail on startup**.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Code-A2Z/code-a2z.git
cd code-a2z
```

### Step 2 — Install Dependencies

```bash
npm run install:all
```

> [!TIP]
> You can also use `npm run install:client` to install all depedencies of Frontend.
> Similar for Backend depedencies `npm run install:server`.

### Step 3 — Configure Environment Variables

Copy the example env file:

```bash
cd client
cp .env.example .env
```

```bash
cd server
cp .env.example .env
```

> [!TIP]
> Always restart your server after modifying `.env` values.

### Step 4 — Start Backend & Frontend

There are 2 ways to run the whole project in terminals,

- Single terminal for client & server
- Two seprate terminals

#### Using single terminal inside the repo

```bash
npm run dev
```

#### Using two separate terminals inside the repo

Backend:

```bash
npm run server
```

Frontend (Vite):

```bash
npm run client
```

Your local environment is now fully running.

---

## 2. Frontend-Only Development (Using Deployed Backend)

Choose this mode if you work only on:

- UI/UX
- Components
- Pages
- Client-side routing or logic

You do **not** need MongoDB or backend setup.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Code-A2Z/code-a2z.git
cd code-a2z
```

### Step 2 — Install Dependencies

```bash
npm run install:all
```

### Step 3 — Configure Environment Variable

Copy `.env.example`:

```bash
cd client
cp .env.example .env
```

```bash
cd server
cp .env.example .env
```

That’s all — no DB connection needed.

> [!NOTE]
> This mode automatically uses the hosted backend.
> Backend routes and CRUD operations will still work normally.

### Step 4 — Run Frontend

```bash
npm run client
```

---

## Switching Between Modes

> [!WARNING]
> Changing `.env` values requires restarting your dev server.

| Mode                 | Required Variables                    | MongoDB Needed | Backend Needed             |
| -------------------- | ------------------------------------- | -------------- | -------------------------- |
| **Full Development** | `MONGODB_URL`, Cloudinary, Email, JWT | Yes            | Yes                        |
| **Frontend-Only**    | `VITE_SERVER_DOMAIN`                  | No             | No (uses deployed backend) |

---

## Common Pitfalls & Fixes

> [!CAUTION]
> These mistakes are extremely common for first-time contributors.

### Backend fails to start

**Reason:** MongoDB is not running
**Fix:** Start the MongoDB service or install MongoDB

### Frontend cannot reach the backend

**Reason:** Wrong `VITE_SERVER_DOMAIN`
**Fix:**

- Local mode → set to `http://localhost:8000`
- Frontend mode → set to deployed backend

### File uploads not working

**Reason:** Invalid Cloudinary credentials
**Fix:** Double-check the 3 Cloudinary keys

### Port already in use

Stop the running process or change the port in `.env`.

---

## Final Tips

> [!TIP]
> Keep separate `.env` files for:
>
> - **Local Backend Mode**
> - **Frontend-Only Mode**
>
> This prevents accidental misconfiguration and avoids startup errors.

> [!NOTE]
> This project uses a modular structure for both client & server.
> When adding new modules, follow the established folder patterns to maintain consistency.
