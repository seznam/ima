#!/bin/bash

# Add customized environment configuration
mv server/config/environment.js server/config/environment.orig.js
cp "$ROOT_DIR_IMA/utils/tests/app/environment.js" server/config/environment.js
NODE_ENV=prod node server/server.js &
IMA_SKELETON_SERVER_PID=$!

sleep 7

echo "Run es-check"
npx ../ima/node_modules/.bin/es-check es2018 './build/static/js/**/*.js'

echo "Run benchmark test on create-ima-app"
cd "$ROOT_DIR_IMA"
node_modules/.bin/autocannon -c $PARALLEL_TEST_CONNECTIONS --no-progress "$TARGET_WEB_URL"

kill $IMA_SKELETON_SERVER_PID

cd "$ROOT_DIR_IMA_APP"

echo "Run lint for create-ima-app"
npm run lint

echo "Test unit and integration tests for create-ima-app"
npm run test
