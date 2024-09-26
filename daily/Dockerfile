# Use a multi-stage build to reduce final image size
FROM mhart/alpine-node:16 AS builder

WORKDIR /app

# Install bash and wait-for-it script
RUN apk add --no-cache bash
RUN wget -O /bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Increase memory limit for Node.js during the build process
RUN node --max-old-space-size=4096 node_modules/.bin/nest build

# Use a smaller base image for the final image
FROM mhart/alpine-node:16

WORKDIR /app

# Copy the wait-for-it script from the builder stage
COPY --from=builder /bin/wait-for-it.sh /bin/wait-for-it.sh

# Copy package.json and package-lock.json to ensure proper dependency management
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist

# If your application requires other static files, copy them as well
# COPY --from=builder /app/public ./public

CMD ["npm", "run", "start:prod"]
