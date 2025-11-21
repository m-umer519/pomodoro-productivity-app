# Stage 1: Build dependencies
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# Stage 2: Prune dependencies and prepare standalone output
FROM node:18-alpine AS runner

WORKDIR /app

# Copy minimal Next.js production output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# If you have custom fonts/images etc:
# COPY --from=builder /app/app ./app
# COPY --from=builder /app/components ./components
# COPY --from=builder /app/lib ./lib

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]