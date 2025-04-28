FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN ls -l dist/src/index.js
# Copiar el archivo de credenciales y los certificados SSL al directorio de salida
COPY src/config/keys/keyfile.json dist/src/config/keys/keyfile.json
COPY src/config/keys/server-ca.pem dist/src/config/keys/server-ca.pem
COPY src/config/keys/client-cert.pem dist/src/config/keys/client-cert.pem
COPY src/config/keys/client-key.pem dist/src/config/keys/client-key.pem
# Ejecutar tests en la etapa builder
RUN npm test -- --passWithNoTests || true

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/src/index.js"]
# Note: This Dockerfile is for a Node.js application. It uses a multi-stage build to first install all dependencies and build the application, and then create a smaller image for production with only the necessary files.
# The final image exposes port 8080 and runs the application using Node.js.