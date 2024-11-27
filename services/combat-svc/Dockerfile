FROM docker.io/node:22
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN rm -rf services
COPY ./services/combat-svc ./services/combat-svc

ENV MODE=${MODE}

ENTRYPOINT [ "sh", "-c" ]
CMD [ "if [ $MODE = 'dev' ]; then npx nx serve services/combat-svc; else npx nx build services/combat-svc && cp ./services/combat-svc/.env.dist ./dist/services/combat-svc/.env && node ./dist/services/combat-svc/main.js; fi" ]