FROM node:18-alpine
WORKDIR /src
COPY package-lock.json package-lock.json
COPY package.json package.json
RUN npm ci
COPY . .
RUN npm run cmds
CMD ["node", "src/entry.js"]