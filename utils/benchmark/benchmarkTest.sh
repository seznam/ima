#!/bin/bash

# Add customized environment configuration
mv server/config/environment.js server/config/environment.orig.js
cp "$ROOT_DIR_IMA/utils/benchmark/app/environment.js" server/config/environment.js
NODE_ENV=prod node server/server.js &
IMA_SKELETON_SERVER_PID=$!

sleep 7

echo "Run benchmark test on create-ima-app"
cd "$ROOT_DIR_IMA"
node_modules/.bin/autocannon -c $PARALLEL_TEST_CONNECTIONS --no-progress "$TARGET_WEB_URL"
