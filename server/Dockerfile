# Multi-stage Dockerfile for Node.js + Express Backend

# Development Stage
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for nodemon)
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 8000

# Start development server with nodemon
CMD ["npm", "run", "dev"]

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 8000

# Start production server
CMD ["npm", "start"]
