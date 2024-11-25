FROM docker.io/node:22
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN rm -rf services
COPY ./services/character-svc ./services/character-svc

ENV MODE=${MODE}

ENTRYPOINT [ "sh", "-c" ]
CMD [ "if [ $MODE = 'dev' ]; then npx nx serve services/character-svc; else npx nx build services/character-svc && cp ./services/character-svc/.env.dist ./dist/services/character-svc/.env && node ./dist/services/character-svc/main.js; fi" ]