#!/bin/bash

set -e

ROOT_DIR_IMA=`pwd`

cd ..

ROOT_DIR=`pwd`

cd "$ROOT_DIR_IMA"

CREATE_IMA_APP_DIR="$ROOT_DIR_IMA/packages/create-ima-app"
PACKAGES="@ima/cli @ima/core @ima/dev-utils @ima/error-overlay @ima/helpers @ima/hmr-client @ima/server @ima/react-page-renderer @ima/testing-library"
CREATE_IMA_APP_PACKAGE_JSON="$CREATE_IMA_APP_DIR/template/common/package.json"

# Pack ima packages from local filesystem and link
for PACKAGE in $PACKAGES ; do
    echo "Working on $PACKAGE"

    # Pack from local filesystem
    npm pack -w $PACKAGE

    # Get the generated tarball path in the root directory
    SANITIZED_PACKAGE_NAME=$(echo "$PACKAGE" | sed 's#@ima/#ima-#g')
    PACKAGE_PATH=$(find "$ROOT_DIR_IMA" -maxdepth 1 -name "$SANITIZED_PACKAGE_NAME-*.tgz" | head -n 1)

    if [ -z "$PACKAGE_PATH" ]; then
        echo "Error: Could not find packed file for $PACKAGE"
        exit 1
    fi

    # Update the template package.json to use local tarball or add it as an override
    node "$ROOT_DIR_IMA/utils/tests/setDependency.js" "$CREATE_IMA_APP_PACKAGE_JSON" "$PACKAGE" "$PACKAGE_PATH"
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
