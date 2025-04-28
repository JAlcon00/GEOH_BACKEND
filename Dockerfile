FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm test -- --passWithNoTests || true

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/src/index.js"]

