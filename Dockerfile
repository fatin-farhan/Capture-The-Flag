# Use official Node.js image as a base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the application's port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
