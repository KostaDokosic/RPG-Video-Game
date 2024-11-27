#!/bin/sh

set -e

for dir in services/*/
do
    dir="${dir%/}"
    service=$(basename "$dir")
    docker exec "$service" npx nx test "services/$service" --passWithNoTests
done