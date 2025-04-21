# Dockerfile para el servicio backend
FROM node:18-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Instala dependencias de producción
COPY package*.json ./
RUN npm install --production

# Copia el resto del código y compila TypeScript
COPY . .
RUN npm run build

# Configura puerto y punto de entrada
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]