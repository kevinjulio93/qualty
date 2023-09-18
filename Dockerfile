# Fetching the latest node image on apline linux
FROM node:lts AS builder

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./package.json ./
RUN npm install -g typescript

RUN npm ci --force

# Copying all the files in our project
COPY . .

# Building our application
RUN npm run build

EXPOSE 8080
# Run the command to start the server

# Copying built assets from builder
CMD ["npm", "start"]