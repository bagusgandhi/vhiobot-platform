# Stage 1: Build
FROM node:18.17.0-alpine3.18 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
# Configure npm retry settings
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm install
# RUN npm install --legacy-peer-deps

# Copy the remaining application files
COPY . .



# Build the application
RUN npm run build

# Prepare the standalone output
# RUN mkdir -p .next/standalone/.next/static && \
#     cp -r .next/static/* .next/standalone/.next/static/ && \
#     mkdir -p .next/standalone/public && \
#     cp -r public/* .next/standalone/public

RUN cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

# Stage 2: Runtime
FROM node:18.17.0-alpine3.18 AS runtime

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy standalone build from the build stage
COPY --from=build /app/.next/standalone ./

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
# CMD ["node_modules/.bin/next", "start"]
