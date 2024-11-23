FROM docker.io/node:22
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN rm -rf services
COPY ./services/account-svc ./services/account-svc

ENV MODE=${MODE}

ENTRYPOINT [ "sh", "-c" ]
CMD [ "if [ $MODE = 'dev' ]; then npx nx serve services/account-svc; else npx nx build services/account-svc && cp ./services/account-svc/.env.dist ./dist/services/account-svc/.env && node ./dist/services/account-svc/main.js; fi" ]