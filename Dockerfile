# Base for staging and prod
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install -g pm2

# Development
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Staging (like prod but keeps full source)
FROM base AS staging
ENV NODE_ENV=staging
COPY . .
RUN npm install --omit=dev
RUN npm run build
EXPOSE 3000
CMD ["pm2-runtime", "dist/server.js"]

# Production (cleanest build)
FROM base AS prod
ENV NODE_ENV=production
COPY . .
RUN npm install --omit=dev
RUN npm run build
EXPOSE 3000
CMD ["pm2-runtime", "dist/server.js"]
