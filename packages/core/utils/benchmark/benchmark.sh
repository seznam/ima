#!/bin/bash

set -e

TARGET_WEB_URL="http://localhost:3001/"
SKELETON_URL="https://github.com/seznam/IMA.js-skeleton.git"
NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL="localhost:4873"
NPM_LOCAL_REGISTRY_URL="http://${NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL}/"

ROOT_DIR=`pwd`
PACKAGE_VERSION=`cat package.json | grep \"version\" | cut -d':' -f2 | cut -d'"' -f2`-next
PACKAGE_NAME=`cat package.json | grep \"name\" | head -1 | cut -d':' -f2 | cut -d'"' -f2`

# Setup local registry
cd "$ROOT_DIR/utils/benchmark"
npm install
node_modules/.bin/verdaccio -l "$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL" -c verdaccio_config.yml >/dev/null &
NPM_LOCAL_REGISTRY_PID=$!

npm config set "//$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL/:_authToken" "0"

# Release ima-core
cd "$ROOT_DIR"
npm install --registry="$NPM_LOCAL_REGISTRY_URL"
npm run build
cd dist
sed -i "s/\"version\":\s\".*\"/\"version\": \"$PACKAGE_VERSION\"/" package.json
sed -i "s#https://registry.npmjs.org/#${NPM_LOCAL_REGISTRY_URL}#" package.json
npm publish

# Setup IMA.js-skeleton
cd "$ROOT_DIR"
git clone "$SKELETON_URL" ima-skeleton
cd ima-skeleton
sed -i "s/\"$PACKAGE_NAME\":\s\".*\"/\"$PACKAGE_NAME\": \"$PACKAGE_VERSION\"/" package.json
npm install --registry="$NPM_LOCAL_REGISTRY_URL"
npm run app:hello
npm run build
mv build/ima/config/environment.js build/ima/config/environment.orig.js
mv "$ROOT_DIR/utils/benchmark/app/environment.js" build/ima/config/environment.js
NODE_ENV=prod node build/server.js &
IMA_SKELETON_SERVER_PID=$!

sleep 5

# Run test
cd "$ROOT_DIR/utils/benchmark"
node_modules/.bin/autocannon -c 300 "$TARGET_WEB_URL"

# Cleanup
kill $NPM_LOCAL_REGISTRY_PID
kill $IMA_SKELETON_SERVER_PID
