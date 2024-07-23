FROM node:18.17.0-alpine3.18

WORKDIR /app

# Copy package json and install package
COPY package-lock.json package.json /app/

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm install

# Copy the remaining file
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

RUN npm run build

CMD npm run start