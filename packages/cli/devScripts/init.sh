#!/usr/bin/env bash

CLI_DIR=$PWD
CREATE_IMA_APP_BIN=$PWD/../create-ima-app/bin/create-ima-app.js
APP_DIR=$1

echo ""
echo "===--------------------------==="
echo "  Initializing Hello example with ima CLI"
echo "  CLI_DIR: $CLI_DIR"
echo "  APP_DIR: $APP_DIR"
echo "  CREATE_IMA_APP_BIN: $CREATE_IMA_APP_BIN"
echo "===--------------------------==="
echo ""

echo 'build @ima/cli'
cd $CLI_DIR
npm run build

# create hello app
$CREATE_IMA_APP_BIN $APP_DIR --example=hello

# remove installed dependencies
cd $APP_DIR
rm -rf ./node_modules/@ima/cli
rm -rf ./node_modules/@ima/core
rm -rf ./node_modules/@ima/server

# replace node_modules dependencies with the ones up to date
mkdir -p $APP_DIR/node_modules/@ima/cli
cd $CLI_DIR
npm run build
cp -rf `/bin/ls -A | grep -v "node_modules"` $APP_DIR/node_modules/@ima/cli

mkdir -p $APP_DIR/node_modules/@ima/core
cd $CLI_DIR/../core
npm run build
cp -rf `/bin/ls -A | grep -v "node_modules"` $APP_DIR/node_modules/@ima/core

mkdir -p $APP_DIR/node_modules/@ima/server
cd $CLI_DIR/../server
cp -rf `/bin/ls -A | grep -v "node_modules"` $APP_DIR/node_modules/@ima/server


# clenaup
cd $CLI_DIR
rm $PKG_FILE

echo ""
echo "===--------------------------==="
echo "  DONE, now run"
echo "  'npm run dev:sync $APP_DIR'"
echo "  to copy and watch latest package changes"
echo "===--------------------------==="
echo ""
