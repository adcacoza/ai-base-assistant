# 1. Base Image: Use an official Node.js image.
# Using a specific version is good practice for reproducibility.
FROM node:20-alpine AS base

# 2. Set Working Directory
WORKDIR /app

# 3. Copy package.json and package-lock.json
# This is done separately to leverage Docker's layer caching.
# The dependencies layer will only be rebuilt if these files change.
COPY package*.json ./

# 4. Install Dependencies
# We'll create a .npmrc file to handle the --legacy-peer-deps issue automatically.
RUN echo "legacy-peer-deps=true" > .npmrc
RUN npm install
RUN rm .npmrc

# 5. Copy the rest of the application code
COPY . .

# 6. Build the Next.js application
RUN npm run build

# 7. Production Image: Create a smaller, more secure image for production.
FROM node:20-alpine AS production

WORKDIR /app

# Copy built assets from the 'base' stage
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
