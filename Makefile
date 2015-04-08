BROWSERIFY_OPTS = src/index-base.js src/index-admin.js -u src/nunjucks/server-env.js -o static/bundle.js

JS_FILES = $(shell find src/ -type f -name *js)
CSS_FILES = $(shell find style/ -regex ".*\(css\|less\)")
FONT_FILES = $(shell find style/ -wholename "*/font/*" -type f)

# ------------------ #

all: static/bundle.js static/style.css


static:
	mkdir -p static


static/bundle.js: static src/nunjucks/compiled_templates.js $(JS_FILES)
	node_modules/.bin/browserify $(BROWSERIFY_OPTS)

static/bundle.min.js: static/bundle.js
	node_modules/.bin/uglifyjs static/bundle.js > static/bundle.min.js

src/nunjucks/compiled_templates.js:
	node ./src/nunjucks/precompile > ./src/nunjucks/compiled_templates.js


static/style.css: $(CSS_FILES) static/font
	node_modules/.bin/lessc ./style/main.less > static/style.css
	
static/font: $(FONT_FILES)
	mkdir -p static/font && cp $(FONT_FILES) static/font

static/style.min.css: static/style.css
	node_modules/.bin/cleancss static/style.css -o static/style.min.css


watch:
	node_modules/.bin/watchify $(BROWSERIFY_OPTS) -dv


.PHONY: all watch
