FROM node:18.20.8-slim

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD npm run start