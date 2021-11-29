#!/bin/bash

set -eux

tsc
./node_modules/.bin/esbuild game.js --bundle --outfile=public/game.bundle.js

cp -r res public/