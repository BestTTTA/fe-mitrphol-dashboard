# Use an official Node.js image.
FROM node:18

# Set the working directory.
WORKDIR /app

# Copy package.json and package-lock.json into the working directory.
COPY package.json package-lock.json ./

# Install all dependencies.
RUN npm install

# Install TailwindCSS and other related packages if not installed
RUN npm install tailwindcss postcss autoprefixer

# Copy the entire project to the working directory.
COPY . .

# Build the Next.js application.
RUN npm run build

# Install a lightweight HTTP server for serving static files.
RUN npm install -g serve

# Expose port 3000 and specify the command to run the server.
EXPOSE 3000
CMD ["npm", "start"]
