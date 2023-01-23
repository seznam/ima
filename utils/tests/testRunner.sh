#!/bin/bash

set -e

TARGET_WEB_URL="http://localhost:3001/"
PARALLEL_TEST_CONNECTIONS=300
SKELETON_URL="https://github.com/seznam/IMA.js-skeleton.git"
NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL="localhost:4873"
NPM_LOCAL_REGISTRY_URL="http://${NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL}/"
ROOT_DIR_IMA=`pwd`

cd ..

ROOT_DIR=`pwd`
ROOT_DIR_IMA_APP="$ROOT_DIR/ima-app"

cd "$ROOT_DIR_IMA"

CREATE_IMA_APP_DIR="$ROOT_DIR_IMA/packages/create-ima-app"
PACKAGE_VERSION="0.0.0-next"
PACKAGES="cli core create-ima-app dev-utils error-overlay helpers hmr-client server react-page-renderer"

# Setup local registry
node_modules/.bin/verdaccio -l "$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL" -c utils/tests/verdaccio_config.yml >/dev/null &
NPM_LOCAL_REGISTRY_PID=$!

npm config set "//$NPM_LOCAL_REGISTRY_URL_NO_PROTOCOL/:_authToken" "0"

# Release ima packages to local registry
for PACKAGE in $PACKAGES ; do
    cd "$ROOT_DIR_IMA/packages/$PACKAGE"
    echo "Working on $PACKAGE@$PACKAGE_VERSION"
    sed -i "s#\"version\":\s\".*\"#\"version\": \"$PACKAGE_VERSION\"#" package.json

    for PACKAGE_UPDATE in $PACKAGES ; do
        sed -i "s#\"@ima/$PACKAGE_UPDATE\":\s\".*\"#\"@ima/$PACKAGE_UPDATE\": \"$PACKAGE_VERSION\"#" package.json

        if [[ "$PACKAGE" == "create-ima-app" ]]
        then
            sed -i "s#\"@ima/$PACKAGE_UPDATE\":\s\".*\"#\"@ima/$PACKAGE_UPDATE\": \"$PACKAGE_VERSION\"#" template/package.json
        fi
    done

    if [[ "$PACKAGE" == "create-ima-app" ]]
    then
        npx json -I -f template/package.json -e "this.overrides={\"@ima/cli\":\"0.0.0-next\",\"@ima/core\":\"0.0.0-next\",\"@ima/helpers\":\"0.0.0-next\"}"
    fi

    sed -i "s#https://registry.npmjs.org/#${NPM_LOCAL_REGISTRY_URL}#" package.json
    npm publish
done

# Install @ima scoped packages from local registry
npm config set @ima:registry=$NPM_LOCAL_REGISTRY_URL

# Update create-ima-app versions
cd "$ROOT_DIR_IMA"
node utils/version/create-ima-app-versions.js
# Link current create-ima-app version to global scope
cd "$CREATE_IMA_APP_DIR"
npm link

# Setup app from example hello
cd "$ROOT_DIR"
npx create-ima-app ima-app

cd "$ROOT_DIR_IMA_APP"

npm run build

# Run tests
source "$ROOT_DIR_IMA/utils/tests/createImaAppTests.sh"

# Cleanup
npm config delete @ima:registry
kill $NPM_LOCAL_REGISTRY_PID
