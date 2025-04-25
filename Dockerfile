# Step 1: Use Node.js base image
FROM node:18.20.8-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy source code
COPY . .

# Step 5: Build TypeScript
RUN npm run build

# Step 6: Expose port (adjust if needed)
EXPOSE 3000

# Step 7: Start the app
CMD ["node", "dist/index.js"]
