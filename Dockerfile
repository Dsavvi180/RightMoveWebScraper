FROM ghcr.io/puppeteer/puppeteer:22.14.0

# Set environment variables to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive
ENV USER=root
# Switch to root user to run apt-get update and install commands
USER root

# Update package lists and install necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    python3 \
    python3-pip \
    python3-venv \
    xfce4 \
    xfce4-goodies \
    tightvncserver \
    dbus-x11 \
    xfonts-base \
    locales \
    net-tools \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

# Set up locales
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Set up VNC server
RUN mkdir /root/.vnc \
    && echo "password" | vncpasswd -f > /root/.vnc/passwd \
    && chmod 600 /root/.vnc/passwd \
    && touch /root/.Xauthority

# Set default resolution for VNC
ENV RESOLUTION=1920x1080

# Expose VNC port
EXPOSE 5901

# Set the working directory
WORKDIR /app

# Copy all application files
COPY . .

# Make the VNC startup script executable
RUN chmod +x start-vnc.sh

# Copy the Python requirements file and install Python dependencies
COPY requirements.txt .
RUN python3 -m venv /home/app/venv \
    && . /home/app/venv/bin/activate \
    && pip install --no-cache-dir -r requirements.txt

# Copy the package.json and package-lock.json files, if available, and install Node.js dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Ensure the startup script is executable
RUN ls -a /app

# Start the VNC server
CMD ["./start-vnc.sh"]
