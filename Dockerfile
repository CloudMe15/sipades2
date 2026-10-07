# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production runtime using Nginx
FROM nginx:alpine

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
