# ---- Build stage ----
FROM node:22 AS builder
WORKDIR /app

# Install *all* deps to build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
ARG BUILD_VERSION=dev
ENV NEXT_PUBLIC_BUILD_VERSION=$BUILD_VERSION
# If you use standalone output, set `output: 'standalone'` in next.config.js
RUN npx next build

# ---- Runtime stage ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Only prod deps for runtime
COPY package*.json ./
RUN npm ci --omit=dev

# If using "output: 'standalone'"
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER node
EXPOSE $PORT
CMD ["npm", "start"]