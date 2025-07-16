FROM node:21 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:21 AS backend-builder
WORKDIR /app
COPY backend/package.json ./
COPY backend/package-lock.json ./
RUN npm install
COPY backend/tsconfig.json ./
COPY backend/src /app/src
# Ensure /app/src/sa exists
RUN mkdir -p /app/src/sa
# Copy React build output from frontend-builder stage to a temp location
COPY --from=frontend-builder /app/frontend/dist /app/react-build
# Remove all static files except sa.js and env directory, then copy React build into backend static dir
RUN find /app/src/sa ! -name 'sa.js' ! -name 'env' ! -path '/app/src/sa/env/*' -type f -delete && find /app/src/sa ! -name 'sa.js' ! -name 'env' ! -path '/app/src/sa/env/*' -type d -empty -delete && cp -r /app/react-build/* /app/src/sa/
RUN ls -al /app/src/sa
RUN npm run build

FROM node:21-alpine
WORKDIR /app
COPY --from=backend-builder /app/dist /app
RUN npm install --omit=dev
CMD ["node", "/app/main.js"]