FROM node:20-alpine3.16 AS builder

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY tsconfig*.json ./
COPY src/ src/
RUN npm run build

CMD ["npm", "run", "start:prod"]
