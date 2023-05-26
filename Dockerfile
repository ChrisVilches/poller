ARG BASE_IMAGE="node:slim"

FROM ${BASE_IMAGE}
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY tsconfig*.json ./
COPY src/ src/
RUN npm run build

FROM ${BASE_IMAGE}
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=0 /usr/app/dist/ dist/
CMD ["npm", "run", "start:prod"]
