# Use an official Node.js image.
FROM node:18

# Set the working directory.
WORKDIR /app

# Define build arguments.
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG REDIS_URL

# Copy package.json and package-lock.json into the working directory.
COPY package.json package-lock.json ./

# Install all dependencies.
RUN npm install

# Copy the entire project to the working directory.
COPY . .

# Build the Next.js application.
RUN npm run build

# Expose port 3000 for the application.
EXPOSE 3000

# Specify the command to run the application.
CMD ["npm", "start"]
