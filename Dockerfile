FROM node:slim

RUN npm install -g vue-cli@2.9.1

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN cd /app && npm install