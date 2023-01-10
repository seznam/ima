#!/bin/bash

set -e

TARGET_WEB_URL="http://localhost:3001/"
PARALLEL_TEST_CONNECTIONS=300
SKELETON_URL="https://github.com/seznam/IMA.js-skeleton.git"
NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL="localhost:4873"
NPM_LOCAL_REGISTRY_URL="http://${NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL}/"

cd ..
echo '=============pwd============'
echo pwd

ROOT_DIR=`pwd`
ROOT_DIR_IMA="$ROOT_DIR/ima"
ROOT_DIR_IMA_APP="$ROOT_DIR/ima-app"

cd "$ROOT_DIR_IMA"
echo '=============pwd============'
echo pwd

CREATE_IMA_APP_DIR="$ROOT_DIR_IMA/packages/create-ima-app"
PACKAGE_VERSION="18.0.0-next"
PACKAGES="cli core dev-utils error-overlay helpers hmr-client server react-page-renderer"

# Setup local registry
node_modules/.bin/verdaccio -l "$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL" -c utils/benchmark/verdaccio_config.yml >/dev/null &
NPM_LOCAL_REGISTRY_PID=$!

npm config set "//$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL/:_authToken" "0"

# Release ima packages to local registry
for PACKAGE in $PACKAGES ; do
    cd "$ROOT_DIR_IMA/packages/$PACKAGE"
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
cd "$ROOT_DIR_IMA"
echo '=============pwd============'
echo pwd
node utils/version/create-ima-app-versions.js
# Link current create-ima-app version to global scope
cd "$CREATE_IMA_APP_DIR"
echo '=============pwd============'
echo pwd
npm link

# Setup app from example hello
cd "$ROOT_DIR_IMA"
echo '=============pwd============'
echo pwd
npx create-ima-app ima-app

mv "$ROOT_DIR_IMA/ima-app" "$ROOT_DIR"

cd "$ROOT_DIR_IMA_APP"
echo '=============pwd============'
echo pwd

npm run build
# Add customized environment configuration
mv server/config/environment.js server/config/environment.orig.js
cp "$ROOT_DIR_IMA/utils/benchmark/app/environment.js" server/config/environment.js
NODE_ENV=prod node server/server.js &
IMA_SKELETON_SERVER_PID=$!

sleep 7

# Run tests
source createImaAppTests.sh

# Cleanup
npm config delete @ima:registry
kill $NPM_LOCAL_REGISTRY_PID
kill $IMA_SKELETON_SERVER_PID
