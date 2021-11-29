#!/bin/bash

set -eux

tsc
./node_modules/.bin/esbuild game.js --bundle --outfile=docs/game.bundle.js

cp -r res docs/
