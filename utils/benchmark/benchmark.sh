#!/bin/bash

set -e

TARGET_WEB_URL="http://localhost:3001/"
PARALLEL_TEST_CONNECTIONS=300
SKELETON_URL="https://github.com/seznam/IMA.js-skeleton.git"
NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL="localhost:4873"
NPM_LOCAL_REGISTRY_URL="http://${NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL}/"

ROOT_DIR=`pwd`
CREATE_IMA_APP_DIR="$ROOT_DIR/packages/create-ima-app"
PACKAGE_VERSION=`node -e "console.log(require('./lerna.json').version)"`-next
PACKAGES="cli core error-overlay helpers hmr-client server"

# Setup local registry
node_modules/.bin/verdaccio -l "$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL" -c utils/benchmark/verdaccio_config.yml >/dev/null &
NPM_LOCAL_REGISTRY_PID=$!

npm config set "//$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL/:_authToken" "0"

# Release ima packages to local registry
for PACKAGE in $PACKAGES ; do
    cd "$ROOT_DIR/packages/$PACKAGE"
    echo "Working on $PACKAGE@$PACKAGE_VERSION"
    sed -i "s#\"version\":\s\".*\"#\"version\": \"$PACKAGE_VERSION\"#" package.json

    for PACKAGE_UPDATE in $PACKAGES ; do
        sed -i "s#\"@ima/$PACKAGE_UPDATE\":\s\".*\"#\"@ima/$PACKAGE_UPDATE\": \"$PACKAGE_VERSION\"#" package.json
    done

    sed -i "s#https://registry.npmjs.org/#${NPM_LOCAL_REGISTRY_URL}#" package.json
    npm publish
done

# Install @ima scoped packages from local registry
npm config set @ima:registry=$NPM_LOCAL_REGISTRY_URL

# Update create-ima-app versions
cd "$ROOT_DIR"
node utils/version/create-ima-app-versions.js
# Link current create-ima-app version to global scope
cd "$CREATE_IMA_APP_DIR"
npm link

# Setup app from example hello
cd "$ROOT_DIR"
npx create-ima-app --example=hello ima-app
cd ima-app
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
npm config delete @ima:registry
kill $NPM_LOCAL_REGISTRY_PID
kill $IMA_SKELETON_SERVER_PID
