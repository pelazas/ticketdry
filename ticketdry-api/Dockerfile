# Use a more recent Node.js image (version 18 or higher)
FROM node:18

RUN echo "Acquire::http::Pipeline-Depth 0;" > /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::http::No-Cache true;" >> /etc/apt/apt.conf.d/99custom && \
    echo "Acquire::BrokenProxy    true;" >> /etc/apt/apt.conf.d/99custom

# Install dependencies required for running Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Create a non-root user
RUN useradd -m appuser

# Create the directory for PDFs and set permissions
RUN mkdir -p /app/util/pdfs && chown -R appuser:appuser /app/util/pdfs

# Switch to appuser
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose the application port
EXPOSE 8000

# Command to run the application
CMD ["node", "app.js"]
