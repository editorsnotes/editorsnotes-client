#!/usr/bin/env bash

python3 -m http.server 8020 &
PYTHON_PID=$!

node_modules/.bin/watchify \
	-p browserify-hmr \
	-o static/styleguide-bundle.js \
	style_guide/index.js \
	-dv &
WATCHIFY_PID=$!

trap " kill $PYTHON_PID $WATCHIFY_PID; exit 0" INT
wait
