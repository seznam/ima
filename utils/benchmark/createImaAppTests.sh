#!/bin/bash

echo "Run test benchmark on create-ima-app"
cd "$ROOT_DIR"
node_modules/.bin/autocannon -c $PARALLEL_TEST_CONNECTIONS --no-progress "$TARGET_WEB_URL"

cd ./ima-app

echo "Run lint test for create-ima-app"
npm run lint

echo "Test unit and integration tests for create-ima-app"
npm run test
