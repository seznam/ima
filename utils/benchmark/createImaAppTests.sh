#!/bin/bash

cd "$ROOT_DIR_IMA_APP"

echo "Run lint for create-ima-app"
npm run lint

echo "Test unit and integration tests for create-ima-app"
npm run test
