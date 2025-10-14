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

### Troubleshooting Guide

#### Common Issues and Solutions

1. **MongoDB Connection Issues**
   - Error: `MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017`
     - Solution: Ensure MongoDB is running locally (`mongod` service)
     - Check if MongoDB is installed correctly using `mongo --version`
     - Verify MongoDB service status: `brew services list` (macOS) or `systemctl status mongodb` (Linux)

2. **Port Conflicts**
   - Error: `EADDRINUSE: address already in use :::8000`
     - Solution: Either kill the process using the port: `lsof -i :8000` then `kill -9 PID`
     - Or change the port in `.env` file to an unused port

3. **Environment Variables**
   - Error: "Configuration error" or "Missing environment variables"
     - Solution: Compare your `.env` with `.env.example`
     - Ensure no trailing spaces in variable values
     - Restart the server after changing environment variables

4. **Frontend Build Issues**
   - Error: Module not found or TypeScript errors
     - Solution: 
       ```bash
       rm -rf node_modules
       npm install
       npm run dev
       ```
   - Clear browser cache and reload

5. **Authentication Issues**
   - Error: JWT verification failed
     - Solution: Check if `JWT_SECRET_ACCESS_KEY` matches in your `.env`
     - Ensure your token hasn't expired (check `JWT_EXPIRES_IN` value)

6. **File Upload Issues**
   - Error: "Failed to upload to Cloudinary"
     - Verify Cloudinary credentials in `.env`
     - Check file size (max 10MB)
     - Ensure supported file format

#### Mode Switching Tips
- When switching between local and deployed backend:
  1. Update `VITE_SERVER_DOMAIN` in `.env`
  2. Stop the dev server (`Ctrl + C`)
  3. Run `npm run dev` again
  4. Clear browser cache and storage

#### Development Best Practices
- Use `npm run dev` for hot-reload during development
- Keep your Node.js version aligned with the project's requirements
- Run `npm run lint` before committing changes
- Check console for warnings and errors frequently

Need more help? Feel free to open an issue on GitHub.
