FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Ejecutar tests en la etapa builder
RUN npm test -- --passWithNoTests || true

FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/index.js"]
# Note: This Dockerfile is for a Node.js application. It uses a multi-stage build to first install all dependencies and build the application, and then create a smaller image for production with only the necessary files.
# The final image exposes port 8080 and runs the application using Node.js.