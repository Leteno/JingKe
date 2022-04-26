#!/bin/bash

set -eux

npx jest
tsc

# run tsec
yarn tsec -p .\tsconfig.json

./node_modules/.bin/esbuild game.js --bundle --outfile=game.bundle.js
