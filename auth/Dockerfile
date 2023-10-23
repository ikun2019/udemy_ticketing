FROM node:16.16.0-alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev

COPY . .

CMD ["npm", "start"]