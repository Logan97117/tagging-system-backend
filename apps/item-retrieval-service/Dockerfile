FROM node:alpine As development
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build item-retrieval-service

FROM node:alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/item-retrieval-service/main"]
