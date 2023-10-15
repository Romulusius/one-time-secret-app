# Use the official Node.js runtime as a base image
FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN yarn install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run your app using CMD which keeps the process running
CMD ["node", "src/index.js"]
