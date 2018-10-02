FROM hypriot/rpi-node:8-slim

ENV TICK 5000
ENV HUE_BRIDGE_URL http://127.0.0.1
ENV HUEPANEL_URL http://0.0.0.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]

