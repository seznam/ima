#!/bin/bash

set -e

ROOT_DIR_IMA=`pwd`

cd ..

ROOT_DIR=`pwd`

cd "$ROOT_DIR_IMA"

CREATE_IMA_APP_DIR="$ROOT_DIR_IMA/packages/create-ima-app"
PACKAGES="@ima/cli @ima/core @ima/dev-utils @ima/error-overlay @ima/helpers @ima/hmr-client @ima/server @ima/react-page-renderer @ima/testing-library"

# Pack ima packages from local filesystem and link
for PACKAGE in $PACKAGES ; do
    echo "Working on $PACKAGE"

    # Convert package name to directory name (e.g., @ima/cli -> cli)
    PACKAGE_DIR=$(echo "$PACKAGE" | sed 's#@ima/##g')

    # cd into the package directory
    cd "$ROOT_DIR_IMA/packages/$PACKAGE_DIR"

    # Pack from local filesystem and specify destination
    npm pack --pack-destination="$ROOT_DIR_IMA"

    # Get the generated tarball path in the root directory
    SANITIZED_PACKAGE_NAME=$(echo "$PACKAGE" | sed 's#@ima/#ima-#g')
    PACKAGE_PATH="$ROOT_DIR_IMA/`echo $SANITIZED_PACKAGE_NAME-*.tgz`"

    # Update the template package.json to use local tarball
    sed -i "s#\"$PACKAGE\":\s\".*\"#\"$PACKAGE\": \"$PACKAGE_PATH\"#" $CREATE_IMA_APP_DIR/template/common/package.json

    # Return to the original directory
    cd "$ROOT_DIR_IMA"
done

cd "$ROOT_DIR_IMA"

# Link current create-ima-app version to global scope
cd "$CREATE_IMA_APP_DIR"
npm link

# Setup JS template from create-ima-app
ROOT_DIR_IMA_APP="$ROOT_DIR/ima-js-app"

cd "$ROOT_DIR"
npx create-ima-app $ROOT_DIR_IMA_APP
cd "$ROOT_DIR_IMA_APP"

npm run build

# Run tests
source "$ROOT_DIR_IMA/utils/tests/createImaAppTests.sh"

# Setup TS template from create-ima-app
ROOT_DIR_IMA_APP="$ROOT_DIR/ima-ts-app"

cd "$ROOT_DIR"
npx create-ima-app $ROOT_DIR_IMA_APP --typescript
cd "$ROOT_DIR_IMA_APP"

npm run build

# Run tests
source "$ROOT_DIR_IMA/utils/tests/createImaAppTests.sh"
