# Use a more full-featured Node.js image to ensure build tools are present
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies required by Puppeteer (Chromium)
# This is crucial for running in Docker, especially on ARM64 architectures like Apple Silicon
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libasound2 \
    --no-install-recommends

# Tell Puppeteer to use the system-installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 3000, so expose it
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "server.js" ]
