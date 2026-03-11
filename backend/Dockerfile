# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --only=production

COPY --from=build /app/dist ./dist

# SQLite database persistence
RUN mkdir -p /app/data
ENV DATABASE_PATH=/app/data/data.sqlite

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
