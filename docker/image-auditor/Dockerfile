FROM node:latest


COPY ./src /opt/app/

# Permet de builder l'app
WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/auditor.js"]
