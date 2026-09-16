FROM node:22-alpine
WORKDIR /app
COPY services/launcher/package.json ./package.json
RUN npm install --omit=dev
COPY services/launcher/index.js ./index.js
COPY services/routing/language-router.js ./routing/language-router.js
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "index.js"]
