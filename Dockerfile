# Base image
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development
FROM base AS dev
RUN npm install
RUN npm run update:bfi
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Builder (for both staging and prod)
FROM base AS builder
RUN npm install
COPY . .
RUN npm run build

# Staging (keeps full source + prod deps + built code)
FROM base AS staging
RUN npm install -g pm2
ENV NODE_ENV=staging
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["pm2-runtime", "dist/server.js"]

# Production (cleanest build, no source, only dist)
FROM base AS prod
RUN npm install -g pm2
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["pm2-runtime", "dist/server.js"]
