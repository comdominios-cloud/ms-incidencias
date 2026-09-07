FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Puerto interno del contenedor. Se publica como 9003 en la VM de produccion.
EXPOSE 3003

CMD ["node", "src/index.js"]
