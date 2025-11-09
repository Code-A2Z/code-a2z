# GitHub Copilot Instructions for Code A2Z

## Project Overview

Code A2Z is a collaborative blogging platform built as a monorepo with separate client and server applications. Contributors can create, manage, and share blog posts about their projects with markdown support, customizable templates, and role-based access control.

## Repository Structure

```
code-a2z/
├── client/          # React + TypeScript + Vite frontend
│   └── src/
│       ├── modules/       # Feature modules (home, editor, profile, etc.)
│       ├── shared/        # Shared utilities and components
│       │   ├── components/    # Atomic design pattern
│       │   │   ├── atoms/         # Basic UI elements
│       │   │   ├── molecules/     # Composite components
│       │   │   └── organisms/     # Complex sections
│       │   ├── hooks/         # Custom React hooks
│       │   ├── states/        # Jotai state atoms
│       │   └── utils/         # Helper functions
│       ├── infra/         # Infrastructure layer
│       │   ├── rest/          # API clients
│       │   ├── states/        # Global state
│       │   └── types/         # TypeScript types
│       ├── config/        # Configuration files
│       └── assets/        # Static assets
├── server/          # Node.js + Express + MongoDB backend
│   └── src/
│       ├── controllers/   # Request handlers by domain
│       ├── routes/        # API route definitions
│       ├── models/        # Mongoose models
│       ├── schemas/       # Mongoose schemas
│       ├── middlewares/   # Express middlewares
│       ├── utils/         # Helper functions
│       ├── config/        # Server configuration
│       ├── constants/     # Constant values
│       ├── logger/        # Winston logging
│       └── typings/       # Type definitions
└── docs/            # Project documentation
```

## Tech Stack

### Client

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (using Rolldown)
- **State Management**: Jotai
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v7
- **Editor**: EditorJS
- **Styling**: Emotion CSS-in-JS + Tailwind CSS

### Server

- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer + Resend
- **Security**: Helmet, HPP, sanitize-html
- **Rate Limiting**: rate-limiter-flexible
- **Logging**: Winston + Morgan

## Coding Standards

### File Naming Conventions

#### Client (TypeScript/React)

- **Components**: `kebab-case` files, `PascalCase` exports
  - `index.tsx` - Main component file
  - `render-menu.tsx` - Sub-components
  - `category-button.tsx` - Feature components
- **Hooks**: `kebab-case` with `use-` prefix
  - `use-auth.ts`
  - `use-editor.ts`
- **Utils**: `kebab-case.ts`
  - `api-interceptor.ts`
  - `date.ts`
  - `regex.ts`
- **State**: `kebab-case` files with descriptive names
  - `auth-state.ts`
  - `editor-state.ts`
- **Types**: `kebab-case.ts`
  - `user-types.ts`
  - `project-types.ts`

#### Server (JavaScript/Node.js)

- **Controllers**: `kebab-case.js` with action name
  - `signup.js`
  - `create-project.js`
  - `upload-image.js`
- **Routes**: `*.routes.js`
  - `auth.routes.js`
  - `project.routes.js`
- **Models**: `*.model.js`
  - `user.model.js`
  - `project.model.js`
- **Schemas**: `*.schema.js`
  - `user.schema.js`
  - `project.schema.js`
- **Middlewares**: `*.middleware.js` or `*.limiter.js`
  - `auth.middleware.js`
  - `auth.limiter.js`
- **Utils**: `kebab-case.js` or descriptive names
  - `response.js`
  - `regex.js`

### Code Organization

#### Client Module Structure

Each feature module follows this pattern:

```
module-name/
├── index.tsx              # Main module component
├── components/            # Module-specific components
│   ├── component-name.tsx
│   └── index.tsx
├── hooks/                 # Module-specific hooks
│   └── index.ts
├── states/                # Module-specific state
│   └── index.ts
└── constants/             # Module-specific constants
    └── index.ts
```

#### Server Domain Structure

Each domain (auth, project, user, etc.) follows this pattern:

```
domain/
├── controller-action.js   # One controller per action
└── utils/                 # Domain-specific utilities (if needed)
    └── index.js
```

### Component Patterns

#### React Components

- Use **functional components** with hooks
- Export default for main component
- Use TypeScript interfaces for props
- Follow **Atomic Design** pattern in `shared/components`
  - Atoms: Basic elements (Button, Typography, Modal)
  - Molecules: Simple combinations (InputField, SearchBar)
  - Organisms: Complex sections (Navbar, Sidebar, Comments)

Example:

```typescript
const ComponentName = ({
  prop1,
  prop2,
}: {
  prop1: string;
  prop2: number;
}) => {
  // Component logic
  return <div>...</div>;
};

export default ComponentName;
```

#### Server Controllers

- One function per file
- Use async/await
- Always use `sendResponse` utility for responses
- Add JSDoc comments for API endpoints

Example:

```javascript
/**
 * POST /api/auth/signup - Register a new user
 * @param {string} fullname - User's full name
 * @param {string} email - Valid email address
 * @param {string} password - Password (6-20 chars)
 * @returns {Object} User object with account details
 */
const signup = async (req, res) => {
  // Controller logic
  return sendResponse(res, 200, 'Success', data);
};

export default signup;
```

### State Management

#### Client (Jotai)

- Use **Jotai atoms** for state management
- Name atoms with descriptive suffixes: `*Atom`, `*State`
- Keep atoms in module-specific `states/` directory or `infra/states/` for global state

Example:

```typescript
import { atom } from 'jotai';

export const UserAtom = atom<User | null>(null);
export const HomePageStateAtom = atom<string>('home');
```

#### Server

- Use Mongoose models for data persistence
- Keep schemas separate from models
- Use constants for collection names

### API Structure

#### Client API Calls

- Use Axios with interceptors in `shared/utils/api-interceptor.ts`
- Organize API functions in `infra/rest/` by domain

#### Server Routes

- Group routes by domain in `routes/api/`
- Apply rate limiters: `authLimiter` for auth, `generalLimiter` for others
- Use `authenticateUser` middleware for protected routes

Example:

```javascript
import express from 'express';
import authenticateUser from '../../middlewares/auth.middleware.js';
import createProject from '../../controllers/project/create-project.js';

const projectRoutes = express.Router();
projectRoutes.post('/', authenticateUser, createProject);

export default projectRoutes;
```

### Styling Guidelines

#### Client

- Use **Material-UI components** as base
- Apply **Emotion** for CSS-in-JS styling
- Use **Tailwind CSS** utility classes when appropriate
- Keep consistent spacing and color schemes from MUI theme

### Error Handling

#### Client

- Use try-catch blocks for async operations
- Display user-friendly error messages
- Log errors to console in development

#### Server

- Use `sendResponse` utility for consistent error responses
- Validate inputs before processing
- Use middleware for error handling
- Log errors using Winston logger

### Security Practices

#### Server

- **Always validate and sanitize** user inputs
- Use `sanitize-html` for HTML content
- Apply rate limiting to all routes
- Use **Helmet** for security headers
- Use **HPP** to prevent HTTP parameter pollution
- Hash passwords with **bcrypt** (SALT_ROUNDS constant)
- Use **JWT** for authentication (httpOnly cookies)
- Validate environment variables with proper typing

### Database Conventions

#### Mongoose Models

- Use schema validation
- Define indexes for frequently queried fields
- Use virtual properties for computed fields
- Keep schemas in separate files from models

Example:

```javascript
import { model } from 'mongoose';
import USER_SCHEMA from '../schemas/user.schema.js';
import { COLLECTION_NAMES } from '../constants/db.js';

const USER = model(COLLECTION_NAMES.USERS, USER_SCHEMA);
export default USER;
```

### Code Quality Tools

#### Linting

- **ESLint** configured for both client and server
- Client: TypeScript ESLint with React rules
- Server: JavaScript ESLint with Node rules
- Run `npm run lint` to check, `npm run lint:fix` to auto-fix

#### Formatting

- **Prettier** for consistent code formatting
- Configuration in `.prettierrc`:
  - Single quotes
  - 2-space indentation
  - 80 character line width
  - Semicolons required
  - LF line endings
- Run `npm run format` to format all files
- Pre-commit hooks auto-format staged files via **Husky**

#### Git Workflow

- Never commit directly to `main` branch
- Create feature branches with descriptive names
- Keep commits focused (3-4 commits max per PR)
- Write clear commit messages
- Auto-formatting runs on commit via Husky

### Testing Guidelines

While there are currently no tests in the repository:

- When adding tests, place them near the code they test
- Use `.test.ts` or `.test.js` extensions
- Follow existing project structure patterns

### Documentation

- Add JSDoc comments for complex functions
- Document API endpoints in controller files
- Update README.md when adding major features
- Keep CONTRIBUTING.md current with workflow changes
- Add inline comments only when necessary for clarity

### Performance Considerations

#### Client

- Use **React.memo** for expensive components
- Use **useCallback** and **useMemo** for optimization
- Implement virtualization for long lists (react-virtuoso)
- Lazy load routes and heavy components
- Optimize images and assets

#### Server

- Use database indexes for query optimization
- Implement proper pagination
- Use rate limiting to prevent abuse
- Cache frequently accessed data when appropriate
- Monitor with logging middleware

### Contribution Workflow

1. **Before starting**: Check existing issues and documentation
2. **Create a feature branch** from `main`
3. **Follow the established patterns** in similar existing code
4. **Run linting and formatting**: `npm run precommit-check`
5. **Publish a blog post** about your project on the website (required for PRs)
6. **Add screenshots** to your PR showing changes
7. **Fill out PR template** completely
8. **Keep PRs focused** on a single feature or fix

### Environment Variables

#### Client

- Prefix with `VITE_`
- Access via `import.meta.env.VITE_*`
- Define in `.env.example` with documentation

#### Server

- Use `dotenv` package
- Never commit `.env` files
- Document all variables in `.env.example`
- Validate required variables on startup

### Module Resolution

#### Client

- Use relative imports for local files
- Use absolute imports from `src/` root when needed
- Configured in `tsconfig.json`

#### Server

- Use ESM syntax (`import/export`)
- Use `.js` extension in imports (required for ESM)
- Relative paths for local modules

## Best Practices Summary

1. **Follow existing patterns** - Browse similar code before implementing new features
2. **Keep it modular** - One responsibility per file/function
3. **Type everything** - Use TypeScript interfaces and JSDoc where applicable
4. **Validate inputs** - Never trust client data on the server
5. **Handle errors gracefully** - Provide meaningful error messages
6. **Write clean code** - Let linters and formatters handle style
7. **Document when necessary** - Clear code > excessive comments
8. **Test your changes** - Manually verify functionality before submitting
9. **Security first** - Sanitize inputs, use HTTPS, protect sensitive data
10. **Be consistent** - Match the style and structure of existing code

## Questions or Clarifications?

- Check existing documentation in `/docs`
- Review similar existing implementations
- Join the Discord community for support
- Comment on relevant issues or discussions
