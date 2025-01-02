FROM node:20-alpine3.19 as BASE
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Build Image
FROM node:20-alpine3.19 as BUILD
WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN npm run build \
    && rm -rf node_modules \
    && npm install --prod --frozen-lockfile


# Build production
FROM node:20-alpine3.19 as PROD
WORKDIR /app
COPY --from=BUILD /app/node_modules ./node_modules
COPY --from=BUILD /app/dist ./dist
COPY --from=BUILD /app/package.json ./package.json
COPY --from=BUILD /app/package-lock.json ./package-lock.lockb
COPY --from=BUILD /app/tsconfig.json ./tsconfig.json

CMD ["node", "dist/main"]
