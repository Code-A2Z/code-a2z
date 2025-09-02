# Local Development Setup

This guide explains two ways to run the project locally:

1. Full Local Development — your own MongoDB server is running locally.
2. Frontend Only — using the deployed backend (`https://pjt-blog.onrender.com`) without running your own MongoDB server.

Both setups are already shown in the `.env.example` file.  
You only need to uncomment the relevant lines for the setup you choose.

---

## 1. Full Local Development (MongoDB running locally)

In this setup, both backend and frontend run on your machine.

### Requirements
- Node.js (LTS version)
- MongoDB installed and running locally (default port `27017`)
- npm or yarn

### Steps

#### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/repo-name.git
cd repo-name
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment variables
Open `.env.example`, uncomment the **Local Development** section,  
and copy it to `.env`:
```bash
cp .env.example .env
```
Example local development variables:
```env
PORT=8000
MONGODB_URL=mongodb://127.0.0.1:27017/blogdb
SECRET_ACCESS_KEY=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

VITE_SERVER_DOMAIN=http://localhost:8000
```

#### 4. Run backend and frontend
Open two terminals:

Backend:
```bash
npm run server
```

Frontend:
```bash
npm run dev
```

---

## 2. Frontend Only (No local MongoDB)

If you don’t have MongoDB installed or don’t want to run the backend locally,  
you can point the frontend to the already deployed backend.

### Steps

#### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/repo-name.git
cd repo-name
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment variables
Open `.env.example`, uncomment the **Frontend Only** section,  
and copy it to `.env`:
```bash
cp .env.example .env
```
Example frontend-only variables:
```env
VITE_SERVER_DOMAIN=https://code-a2z.onrender.com
```

You do not need to set `MONGODB_URL` or run the backend.

#### 4. Start the frontend
```bash
npm run dev
```

Your app will connect directly to the deployed backend.

---

## Common Pitfalls

- If you try to run backend code without MongoDB running, you’ll get connection errors.
- Keep `.env` variables separate for each mode (local backend vs deployed backend).
- The `.env.example` file already contains both modes — just uncomment the one you need.
- If switching between modes, update `VITE_SERVER_DOMAIN` and restart the dev server.
