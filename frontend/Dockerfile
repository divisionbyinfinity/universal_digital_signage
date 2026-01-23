FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (use npm install if no lock file)
RUN npm install

# Copy the rest of the app
COPY . .

# Build React app
RUN npm run build
