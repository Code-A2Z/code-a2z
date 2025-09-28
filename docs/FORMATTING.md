# Code Formatting Guide

This project uses **Prettier** and **ESLint** with **Husky** pre-commit hooks to ensure consistent code formatting across the entire codebase.

## 🚀 Quick Start

### Format All Files (One-time setup)

If you're working with an existing codebase that hasn't been formatted yet:

```bash
npm run format
```

This will format all TypeScript, JavaScript, CSS, HTML, JSON, Markdown, and YAML files in the project.

## 📝 Available Commands

| Command                   | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| `npm run format`          | Format all files in the project                       |
| `npm run format:check`    | Check if all files are formatted (won't modify files) |
| `npm run format:client`   | Format only client-side files                         |
| `npm run format:server`   | Format only server-side files                         |
| `npm run format:docs`     | Format only documentation files (JSON, MD, YAML)      |
| `npm run lint`            | Run ESLint to check for code issues                   |
| `npm run lint:fix`        | Run ESLint and automatically fix issues               |
| `npm run precommit-check` | Run both linting and format checking                  |

## ⚙️ How It Works

### Automatic Formatting on Commit

- **Pre-commit Hook**: When you commit files, Husky automatically runs formatting
- **Staged Files Only**: Only the files you're committing get formatted
- **Auto-stage**: Formatted changes are automatically added to your commit

### File Coverage

The formatting system covers:

**Client (TypeScript/React):**

- `client/src/**/*.{ts,tsx,js,jsx,css,html}`

**Server (JavaScript/Node.js):**

- `server/**/*.js`

**Documentation & Config:**

- `*.{json,md,yml,yaml}`

### Prettier Configuration

The project uses these formatting rules (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## 🔄 Workflow Examples

### For New Contributors

```bash
# 1. Clone the repository
git clone <repository-url>

# 2. Install dependencies
npm install

# 3. Format all existing files (one-time)
npm run format

# 4. Make your changes...
# 5. Stage your changes
git add .

# 6. Commit (formatting happens automatically)
git commit -m "Your commit message"
```

### For Existing Files

```bash
# Check which files need formatting
npm run format:check

# Format all files
npm run format

# Or format specific areas
npm run format:client    # Only client files
npm run format:server    # Only server files
```

### Before Pushing

```bash
# Check everything is properly formatted and linted
npm run precommit-check

# If issues found, fix them
npm run lint:fix
npm run format
```

## 🛠️ Troubleshooting

### Formatting Issues

If files aren't being formatted:

1. Check if the file extension is covered in the configuration
2. Ensure the file path matches the patterns in `package.json` > `lint-staged`
3. Check `.prettierignore` to make sure the file isn't excluded

### Pre-commit Hook Not Running

```bash
# Reinstall Husky hooks
npm run prepare

# Make sure the hook is executable
chmod +x .husky/pre-commit
```

### ESLint Conflicts with Prettier

The project is configured to avoid conflicts, but if you encounter them:

```bash
npm run lint:fix
npm run format
```

## 📂 Files Excluded from Formatting

See `.prettierignore` for the complete list. Major exclusions:

- `node_modules/`
- Build outputs (`dist/`, `build/`)
- Lock files (`package-lock.json`, etc.)
- Environment files (`.env*`)
- Project markdown files that contain code snippets

## 🚦 CI/CD Integration

The GitHub Action workflow (`.github/workflows/format-check.yml`) automatically:

- Checks formatting on all PRs
- Runs linting checks
- Prevents merging of unformatted code

## 💡 Tips

- **VS Code**: Install the Prettier extension for real-time formatting
- **Format on Save**: Enable "Format on Save" in your editor
- **Manual Check**: Run `npm run format:check` before pushing
- **Selective Formatting**: Use specific commands (`format:client`, `format:server`) for targeted formatting
