#!/usr/bin/env bash

CLI_DIR=$PWD
APP_DIR=$1

echo ""
echo "===-------------------------------==="
echo "  Link @ima/cli to app directory..."
echo "===-------------------------------==="
echo ""

# link cli to app
cd $APP_DIR
npm link @ima/cli
