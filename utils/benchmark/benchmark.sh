#!/bin/bash

set -e

TARGET_WEB_URL="http://localhost:3001/"
PARALLEL_TEST_CONNECTIONS=300
SKELETON_URL="https://github.com/seznam/IMA.js-skeleton.git"
NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL="localhost:4873"
NPM_LOCAL_REGISTRY_URL="http://${NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL}/"

ROOT_DIR=`pwd`
SKELETON_DIR="$ROOT_DIR/packages/skeleton"
PACKAGE_VERSION=`cat $ROOT_DIR/package.json | grep \"version\" | cut -d':' -f2 | cut -d'"' -f2`-next
PACKAGES="core server examples gulp-task-loader gulp-tasks"

# Setup local registry
node_modules/.bin/verdaccio -l "$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL" -c utils/benchmark/verdaccio_config.yml >/dev/null &
NPM_LOCAL_REGISTRY_PID=$!

npm config set "//$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL/:_authToken" "0"

# Release ima packages to local registry
for PACKAGE in $PACKAGES ; do
    cd "$ROOT_DIR/packages/$PACKAGE"
    sed -i "s#\"version\":\s\".*\"#\"version\": \"$PACKAGE_VERSION\"#" package.json
    sed -i "s#https://registry.npmjs.org/#${NPM_LOCAL_REGISTRY_URL}#" package.json
    npm publish
done

# Setup IMA.js-skeleton
cd "$SKELETON_DIR"
# Update packages version
for PACKAGE in $PACKAGES ; do
    sed -i "s#\"@ima/$PACKAGE\":\s\".*\"#\"@ima/$PACKAGE\": \"$PACKAGE_VERSION\"#" package.json
done
# Install @ima scoped packages from local registry
npm config set @ima:registry=$NPM_LOCAL_REGISTRY_URL
npm install
npm config delete @ima:registry
# Setup app from example app:feed
npm run app:feed
npm run build
# Add customized environment configuration
mv build/ima/config/environment.js build/ima/config/environment.orig.js
mv "$ROOT_DIR/utils/benchmark/app/environment.js" build/ima/config/environment.js
NODE_ENV=prod node build/server.js &
IMA_SKELETON_SERVER_PID=$!

sleep 7

# Run test
cd "$ROOT_DIR"
node_modules/.bin/autocannon -c $PARALLEL_TEST_CONNECTIONS --no-progress "$TARGET_WEB_URL"

# Cleanup
kill $NPM_LOCAL_REGISTRY_PID
kill $IMA_SKELETON_SERVER_PID
