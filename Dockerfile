# Use an official Node.js image.
FROM node:18

# Set the working directory.
WORKDIR /app

# Copy package.json and package-lock.json into the working directory.
COPY package.json package-lock.json ./

ENV NEXT_PUBLIC_BASE_URL=https://mitrphol-api-3.thetigerteamacademy.net
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBb8Ioejj1p4NKXJM1Fyo-xNAlztcA-1wM
ENV REDIS_URL=redis://:mitrphol2024@119.59.102.60:6379

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
