FROM node:21 AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY ./src /app/src
RUN ls -al

RUN npm run build

FROM node:21-alpine

WORKDIR /app
COPY --from=builder /app/dist /app
RUN npm install --omit=dev
CMD ["node", "/app/main.js"]