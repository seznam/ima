#!/usr/bin/env bash

CLI_DIR=$PWD
APP_DIR=$1

# package cli
PKG_FILE=$(npm pack | tail -n 1)

echo ""
echo "===--------------------------==="
echo "  Linking cli to $APP_DIR..."
echo "  CLI_DIR: $CLI_DIR"
echo "  APP_DIR: $APP_DIR"
echo "  PKG_FILE: $PKG_FILE"
echo "===--------------------------==="
echo ""

# prepare dependencies
npm link
cd ../core
npm run build

# install dependencies to selected app directory
cd $APP_DIR
npm install $CLI_DIR/$PKG_FILE
rm -rf ./node_modules/@ima/core
rm -rf ./node_modules/@ima/server

# link cli to app
npm link @ima/cli

# copy updated server and core to app node modules
mkdir -p $APP_DIR/node_modules/@ima/core
cd $CLI_DIR/../core
cp -rf `/bin/ls -A | grep -v "node_modules"` $APP_DIR/node_modules/@ima/core

mkdir -p $APP_DIR/node_modules/@ima/server
cd $CLI_DIR/../server
cp -rf `/bin/ls -A | grep -v "node_modules"` $APP_DIR/node_modules/@ima/server


# clenaup
cd $CLI_DIR
rm $PKG_FILE
