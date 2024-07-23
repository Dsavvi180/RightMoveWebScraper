# Use the Node.js 16-bullseye image as the base
FROM --platform=linux/amd64 node:16-bullseye

# Set environment variable to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and install necessary packages
RUN apt-get update && apt-get install -y \
    google-chrome-stable\
    python3 \
    python3-pip \
    python3-venv \
    chromium \
    xvfb \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create a new user and set a password
RUN useradd -ms /bin/bash newuser && \
    echo "newuser:newpassword" | chpasswd

# Set the working directory
WORKDIR /home/newuser/app

# Copy the Python requirements file into the container
COPY requirements.txt .

# Create a virtual environment and install Python dependencies
RUN python3 -m venv /home/newuser/app/venv && \
    . /home/newuser/app/venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt

# Copy the package.json and package-lock.json files, if available
COPY package.json package-lock.json* ./

# Install Node.js dependencies
RUN npx puppeteer install --platform=linux --arch=x64 --build=chrome
RUN npx puppeteer browsers install chrome && \
    npm install

# Copy the rest of the application code
COPY . .

# Change ownership of the application directory to the new user
RUN chown -R newuser:newuser /home/newuser/app

# Expose the port the app runs on (adjust as necessary)
EXPOSE 3000

# Switch to the new user
USER newuser

# Define the command to run your application (adjust as necessary)
CMD [ "npm", "start" ]
