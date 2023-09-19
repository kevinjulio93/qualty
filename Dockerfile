# Fetching the latest node image on apline linux
FROM node:lts as builder

# Setting up the work directory
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./

RUN npm install -g typescript

RUN npm i --force

COPY . .

# Building our application
RUN npm run build


FROM nginx:stable-alpine

#!/bin/sh

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT ["nginx", "-g", "daemon off;"]
