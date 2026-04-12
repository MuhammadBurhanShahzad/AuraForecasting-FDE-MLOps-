# Stage 1: Build the React application
FROM node:24-alpine as build-stage

WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx for production speed
FROM nginx:alpine

# Copy built assets from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Add a simple Nginx config for React routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
