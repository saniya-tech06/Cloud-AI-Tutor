FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .
RUN mkdir -p src/uploads && chown -R node:node src/uploads

ENV NODE_ENV=production

USER node

EXPOSE 5000

CMD ["npm", "start"]
