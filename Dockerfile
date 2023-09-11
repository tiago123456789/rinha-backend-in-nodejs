FROM node:alpine

WORKDIR /app

COPY . /app/

COPY package.json package-lock.json pm2.json /app/

RUN npm i -g pm2

RUN npm install

CMD ["pm2-runtime", "start", "pm2.json"]