BROWSERIFY_OPTS = src/main.js -o static/bundle.js

JS_FILES = $(shell find src/ -type f -name *js -o -name *jsx)
CSS_FILES = $(shell find style/ -regex ".*\(css\|less\)") \
	    static/basscss.css \
	    static/normalize.css \
	    static/codemirror.css \
	    style.css

FONT_FILES = $(shell find style/ -wholename "*/font/*" -type f)

# ------------------ #

all: \
	static/bundle.min.js \
	static/style.min.css


static:
	mkdir -p static


static/bundle.js: static $(JS_FILES)
	node_modules/.bin/browserify $(BROWSERIFY_OPTS)

static/bundle.min.js: static/bundle.js
	node_modules/.bin/uglifyjs -c -- static/bundle.js > static/bundle.min.js


static/basscss.css: static
	echo '@import "basscss";' | node_modules/.bin/cssnext > static/basscss.css

static/normalize.css: static
	echo '@import "normalize.css";' | node_modules/.bin/cssnext > static/normalize.css

static/codemirror.css: static
	echo '@import "codemirror/lib/codemirror.css";' | node_modules/.bin/cssnext > static/codemirror.css

static/style.css: static $(CSS_FILES) static/font
	node_modules/.bin/lessc ./style/main.less > static/style.css
	node_modules/.bin/cssnext ./style.css >> static/style.css
	
static/font: $(FONT_FILES)
	mkdir -p static/font && cp $(FONT_FILES) static/font

static/style.min.css: static/style.css
	node_modules/.bin/cleancss static/style.css -o static/style.min.css


watch:
	node_modules/.bin/watchify $(BROWSERIFY_OPTS) -dv


.PHONY: all watch
