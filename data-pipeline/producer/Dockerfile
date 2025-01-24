# Use Node.js LTS version
FROM node:lts

# Set working directory
WORKDIR /Data-Engineering/data-pipeline/producer

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]