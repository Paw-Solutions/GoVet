FROM node:24
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g ionic
EXPOSE 3000
CMD ["ionic", "s"]