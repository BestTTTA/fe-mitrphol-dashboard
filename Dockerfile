# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
# RUN npm ci --production
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the Next.js application
RUN npm run build

# Install a lightweight HTTP server for serving static files
RUN npm install -g serve

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
