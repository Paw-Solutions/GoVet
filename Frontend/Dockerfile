FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm i -D -E vite
RUN npm install -g @ionic/cli
RUN npm install
COPY . .
EXPOSE 8100
CMD ["ionic", "serve", "--host", "0.0.0.0"]
