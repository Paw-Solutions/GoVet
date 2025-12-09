# Imagen base ligera
FROM node:20

# Directorio de trabajo
WORKDIR /app

# Copiamos el package.json
COPY package.json ./

# Instalamos dependencias requeridas por tu código existente
# (esto añadirá las entradas en package.json y creará package-lock.json en la imagen)
RUN npm install

# Copiamos el código de tu microservicio (de la carpeta original)
# server.js y whatsapp.js deben existir en este contexto de build
COPY server.js whatsapp.js ./

# Puerto interno de la app (no se publicará hacia fuera en docker-compose)
EXPOSE 3000

# Comando de arranque
CMD ["npm", "start"]