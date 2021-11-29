#!/bin/bash

set -eux

npx jest
tsc
./node_modules/.bin/esbuild game.js --bundle --outfile=game.bundle.js
