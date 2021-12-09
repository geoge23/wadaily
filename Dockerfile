FROM node:12
WORKDIR /usr/src/app

COPY . ./

# building the app
RUN npm i
RUN --mount=type=secret,id=MONGO_URI,dst=/etc/secrets/MONGO_URI --mount=type=secret,id=WEATHER_KEY,dst=/etc/secrets/WEATHER_KEY export MONGO_URI="$(cat /etc/secrets/MONGO_URI)" && export WEATHER_KEY="$(cat /etc/secrets/WEATHER_KEY)" && npm run build

# Running the app
CMD [ "npm", "start" ]