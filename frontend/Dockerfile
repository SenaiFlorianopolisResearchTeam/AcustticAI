FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

COPY ./src ./src
COPY ./public ./public
RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD [ "npm", "run", "dev" ]

