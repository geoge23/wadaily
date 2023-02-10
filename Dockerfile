FROM node:17
WORKDIR /usr/src/app

# Downloading dependencies
COPY ./package*.json ./
RUN npm i

# Building the app
COPY . ./
RUN --mount=type=secret,id=MONGO_URI,dst=/etc/secrets/MONGO_URI --mount=type=secret,id=WEATHER_KEY,dst=/etc/secrets/WEATHER_KEY export MONGO_URI="$(cat /etc/secrets/MONGO_URI)" && export WEATHER_KEY="$(cat /etc/secrets/WEATHER_KEY)" && npm run build

ENV NODE_ENV=production

# Running the app
CMD [ "npm", "start" ]