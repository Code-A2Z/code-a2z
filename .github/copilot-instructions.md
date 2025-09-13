# Code A2Z - Project Blog

Code A2Z is a collaborative blogging platform built with React/Vite frontend and Node.js/Express backend with MongoDB. The platform allows developers to submit projects as Git submodules, write blog posts, and collaborate with the community.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Install Dependencies
- **Node.js Version**: Requires Node.js v20+ (tested with v20.19.4)
- **Install root dependencies**: `npm install` -- takes ~10 seconds. Set timeout to 60+ seconds.
- **Install backend dependencies**: `cd backend && npm install` -- takes ~12 seconds. Set timeout to 60+ seconds.
- **Install frontend dependencies**: `cd frontend && npm install` -- takes ~17 seconds. Set timeout to 60+ seconds.
- **Security vulnerabilities**: Installations show critical vulnerabilities - this is expected and not blocking for development.

### Development Setup (Two Modes)

#### Mode 1: Full Local Development (Recommended for Backend Changes)
```bash
# 1. Setup MongoDB with Docker (NEVER CANCEL - takes 15+ seconds)
docker run --name mongodb-code-a2z -d -p 27017:27017 mongo:7

# 2. Configure backend environment
cd backend
cp .env.example .env
# Edit .env to set SECRET_ACCESS_KEY=test-secret-key-for-development

# 3. Configure frontend environment  
cd ../frontend
cp .env.example .env
# Edit .env to set VITE_SERVER_DOMAIN=http://localhost:8000

# 4. Start both servers concurrently
cd ..
npm run dev
```

#### Mode 2: Frontend-Only Development (For Frontend Changes Only)
```bash
# 1. Configure frontend for deployed backend
cd frontend
cp .env.example .env
# Edit .env to set VITE_SERVER_DOMAIN=https://code-a2z.onrender.com

# 2. Start frontend only
npm run dev
```

### Build and Lint
- **Frontend build**: `cd frontend && npm run build` -- takes ~5 seconds. Set timeout to 30+ seconds.
- **Frontend lint**: `cd frontend && npm run lint` -- takes ~1 second. **CURRENTLY FAILS** with 12 errors and 21 warnings.
- **Format check**: `npx prettier --check .` -- takes ~2 seconds. **CURRENTLY FAILS** with 96 files needing formatting.
- **Format fix**: `npx prettier --write .` -- takes ~3 seconds. Use this to fix formatting issues.

### Running the Application
- **Frontend URL**: http://localhost:5173/
- **Backend URL**: http://localhost:8000/
- **Concurrent development**: `npm run dev` starts both frontend and backend with colored output
- **Backend only**: `cd backend && npm run dev` (uses nodemon for auto-restart)
- **Frontend only**: `cd frontend && npm run dev` (uses Vite dev server)

## Validation and Testing

### Manual Validation Requirements
**ALWAYS test these user scenarios after making changes:**

1. **Home Page Loading**: Navigate to http://localhost:5173/ and verify:
   - Page loads without errors
   - Navigation bar displays properly  
   - "No projects published" message appears (expected for empty database)
   - Recommended topics buttons are clickable

2. **Authentication Flow**: Test user registration/login:
   - Click "Sign Up" → verify signup form loads
   - Click "Login" → verify login form loads
   - Form fields should be properly styled and functional

3. **Theme Switching**: Test theme functionality:
   - Click theme button in navigation
   - Test Light/Dark/System theme options
   - Verify theme changes apply correctly

4. **Write/Editor Access**: Test editor access control:
   - Click "Write" → should redirect to login (authentication required)
   - Verify authentication flow is working

### API Endpoint Validation
- **Backend health**: `curl http://localhost:8000/` should return "Backend is running..."
- **Trending projects**: `curl http://localhost:8000/api/project/trending` should return `{"projects":[]}`
- **MongoDB connection**: Backend console should show "MongoDB Connected" message

### Pre-commit Validation
- **ALWAYS run before committing**: `cd frontend && npm run lint` 
- **Fix linting errors**: Address ESLint errors before committing (CI will fail otherwise)
- **Format code**: Run `npx prettier --write .` to fix formatting issues
- **Pre-commit hooks**: Husky runs lint-staged automatically on commit

## Common Issues and Solutions

### Build/Development Issues
- **MongoDB connection fails**: Ensure Docker container is running with `docker ps | grep mongodb-code-a2z`
- **Frontend won't start**: Check Node.js version (needs v20+) and ensure dependencies are installed
- **CORS errors**: Verify VITE_SERVER_DOMAIN is correctly set in frontend/.env
- **ESLint fails**: Run `cd frontend && npm run lint` to see specific errors - fix before committing

### Environment Configuration
- **Backend .env required variables**:
  - `PORT=8000`
  - `MONGODB_URL=mongodb://localhost:27017/` (local) or MongoDB connection string
  - `SECRET_ACCESS_KEY=test-secret-key-for-development` (minimum required)
  - Cloudinary variables optional for development
- **Frontend .env required variables**:
  - `VITE_SERVER_DOMAIN=http://localhost:8000` (local) or `https://code-a2z.onrender.com` (deployed)

### Git Submodules
- **WARNING**: Never clone with GitHub Desktop or GitKraken - downloads all submodules consuming excessive data
- **Adding projects**: Use `git submodule add --depth 1 <repo_url> projects/<category>/<project_name>`
- **Submodule structure**: Projects organized in `/projects/web-development/` and `/projects/data-science/`

## Critical Timing and Timeout Information

**NEVER CANCEL these operations - wait for completion:**

- **npm install operations**: Set timeout to 60+ seconds (measured: 10-17 seconds)
- **Docker MongoDB setup**: Set timeout to 60+ seconds (measured: 12 seconds)  
- **Frontend build**: Set timeout to 30+ seconds (measured: 5 seconds)
- **Application startup**: Allow 10-15 seconds for full initialization

## Repository Structure Reference

### Key Directories
```
/backend/          # Node.js/Express API server
/frontend/         # React/Vite web application  
/projects/         # Git submodules for project examples
/.github/          # GitHub workflows and templates
/.husky/           # Git hooks for pre-commit validation
```

### Important Files
- `package.json` (root): Concurrency scripts for development
- `backend/server.js`: Express server entry point
- `frontend/src/App.jsx`: React application entry point
- `eslint.config.mjs`: ESLint configuration for code quality
- `.gitmodules`: Git submodule definitions
- `SETUP.md`: Local development setup guide

### Available npm Scripts (Root)
- `npm run dev`: Start both frontend and backend concurrently
- `npm run frontend`: Start frontend development server only  
- `npm run backend`: Start backend development server only

### Available npm Scripts (Frontend)
- `npm run dev`: Start Vite development server
- `npm run build`: Build production bundle
- `npm run lint`: Run ESLint (currently fails - fix before committing)

### Available npm Scripts (Backend)  
- `npm run dev`: Start with nodemon (auto-restart)
- `npm start`: Start production server

## Known Issues

1. **ESLint errors**: 12 errors and 21 warnings in frontend code - must be fixed before committing
2. **Prettier formatting**: 96 files need formatting - run `npx prettier --write .` to fix
3. **Security vulnerabilities**: npm audit shows vulnerabilities - expected in development, not blocking
4. **No test suite**: Currently no automated tests exist
5. **Husky deprecation**: Pre-commit hook shows deprecation warning but still functions

## DO NOT attempt to:
- Run tests (no test suite exists)
- Build without installing dependencies first
- Commit code with ESLint errors (CI will fail)
- Use MongoDB without Docker setup in local development mode
- Modify submodule contents directly (they're external repositories)