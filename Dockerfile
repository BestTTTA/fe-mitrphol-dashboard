# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# ENV NEXT_PUBLIC_BASE_URL=https://mitrphol-api-3.thetigerteamacademy.net
# ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBb8Ioejj1p4NKXJM1Fyo-xNAlztcA-1wM
# ENV REDIS=redis://:mitrphol2024@119.59.102.60:6379

COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --production

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
