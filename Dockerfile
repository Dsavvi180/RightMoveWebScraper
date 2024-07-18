# Use the official Alpine Linux image
FROM alpine:latest

# Install necessary packages
RUN apk add --no-cache \
    python3 \
    py3-pip \
    nodejs \
    npm

# Create and set the working directory
WORKDIR /app

# Copy the Python requirements file into the container
COPY requirements.txt .

# Create a virtual environment
RUN python3 -m venv /app/venv

# Install Python dependencies
RUN . /app/venv/bin/activate && pip install --no-cache-dir -r requirements.txt

# Copy the package.json and package-lock.json (if available)
COPY package.json package-lock.json* individual_property_data.json property_data.json propertyResultsHrefs.py ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (adjust as necessary)
EXPOSE 3000

# Define the command to run your application (adjust as necessary)
CMD ["node", "test/controlCenter.js"]
