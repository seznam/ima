#!/usr/bin/env bash

CLI_DIR=$PWD
APP_DIR=$1

echo ""
echo "===-----------------------------------------------------------==="
echo "  Copying @ima/server, @ima/cli & @ima/core to app directory..."
echo "===-----------------------------------------------------------==="
echo ""

echo 'Syncing @ima/core...'
cd $APP_DIR/node_modules/@ima/core
ls -1 | grep -v 'node_modules' | xargs rm -rf
rsync -aq --progress $CLI_DIR/../core $APP_DIR/node_modules/@ima --exclude node_modules

echo 'Syncing @ima/server...'
cd $APP_DIR/node_modules/@ima/server
ls -1 | grep -v 'node_modules' | xargs rm -rf
rsync -aq --progress $CLI_DIR/../server $APP_DIR/node_modules/@ima --exclude node_modules

echo 'Syncing @ima/cli...'
cd $APP_DIR/node_modules/@ima/cli
ls -1 | grep -v 'node_modules' | xargs rm -rf
rsync -aq --progress $CLI_DIR $APP_DIR/node_modules/@ima --exclude node_modules
