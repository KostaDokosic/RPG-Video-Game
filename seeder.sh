#!/bin/bash
docker exec -w /app/services/account-svc account-svc npx sequelize-cli db:seed:all