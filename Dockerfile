# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js application
# RUN npm run build

# Install a lightweight HTTP server for serving static files
RUN npm install -g serve

EXPOSE 3000
# Serve the Next.js app
CMD ["npm", "start"]
