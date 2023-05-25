ARG BASE_IMAGE="node:20-alpine3.16"

FROM ${BASE_IMAGE}
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY tsconfig*.json ./
COPY src/ src/
RUN npm run build

FROM ${BASE_IMAGE}
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=0 /usr/app/dist/ dist/
CMD ["npm", "run", "start:prod"]
