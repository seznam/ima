#!/usr/bin/env bash

CLI_DIR=$PWD
APP_DIR=$1

echo ""
echo "===-----------------------------------------------------------==="
echo "  Copying @ima/server, @ima/cli & @ima/core to app directory..."
echo "===-----------------------------------------------------------==="
echo ""

echo 'Syncing @ima/core...'
rm -rf $APP_DIR/node_modules/@ima/core
rsync -aq --progress $CLI_DIR/../core $APP_DIR/node_modules/@ima --exclude node_modules

echo 'Syncing @ima/server...'
rm -rf $APP_DIR/node_modules/@ima/server
rsync -aq --progress $CLI_DIR/../server $APP_DIR/node_modules/@ima --exclude node_modules

echo 'Syncing @ima/cli...'
rm -rf $APP_DIR/node_modules/@ima/cli
rsync -aq --progress $CLI_DIR $APP_DIR/node_modules/@ima --exclude node_modules
