# Local Development Setup

This guide explains two ways to run the project locally:

1. Full Project Development — Your own MongoDB server is running locally.
2. Frontend Development — Using the deployed backend (`https://code-a2z.onrender.com`) without running your own MongoDB server.

Both setups are already shown in the `.env.example` file.  
You only need to uncomment the relevant lines for the setup you choose.

---

### 1. Full Project Development (MongoDB running locally)

In this setup, both backend and frontend run on your machine.

#### Requirements

- Node.js (LTS version)
- MongoDB installed and running locally (default port `27017`)
- npm

#### Steps

##### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/repo-name.git
cd repo-name
```

##### 2. Install dependencies

```bash
npm install
```

##### 3. Configure environment variables

Open `.env.example`, uncomment the **Local Development** section,  
and copy it to `.env`:

```bash
cp .env.example .env
```

Example local development variables:

```env
PORT=8000
NODE_ENV=production # Change to 'development' for local development
MONGODB_URL=mongodb://127.0.0.1:27017/code-a2z
JWT_SECRET_ACCESS_KEY=your_secret_key
JWT_EXPIRES_IN=7 # (Numerical value)

# Cloudinary Configuration (for media uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
ADMIN_EMAIL=avdhesh.opensource@gmail.com
ADMIN_PASSWORD=email_password_here
```

##### 4. Run backend and frontend

Open two terminals:

Backend:

```bash
npm run server
```

Frontend:

```bash
npm run client
```

---

### 2. Frontend Development (No local MongoDB)

If you are working on Frontend changes, no need to run the BE locally, directly use BE deployed URL.

#### Steps

##### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/repo-name.git
cd repo-name
```

##### 2. Install dependencies

```bash
npm install
```

##### 3. Configure environment variables

Open `.env.example` and copy it to `.env`:

```bash
cp .env.example .env
```

Example frontend-only variables:

```env
VITE_SERVER_DOMAIN=https://code-a2z.onrender.com
```

You do not need to set `MONGODB_URL` or run the backend.

##### 4. Start the frontend

```bash
npm run dev
```

Your app will connect directly to the deployed backend.

---

### Common Pitfalls

- If you try to run backend code without MongoDB running, you’ll get connection errors.
- Check the respective PORTS are free to use in your machine.
- Keep `.env` variables separate for each mode (local backend vs deployed backend).
- The `.env.example` file already contains both modes — just uncomment the one you need.
- If switching between modes, update `VITE_SERVER_DOMAIN` and restart the dev server.
