FROM node:22-alpine
WORKDIR /app
COPY services/auth-gateway/package.json ./package.json
RUN npm install --omit=dev
COPY services/auth-gateway/index.js ./index.js
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "index.js"]
