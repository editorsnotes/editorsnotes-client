###############
#  Variables  #
###############

NPM_BIN=node_modules/.bin

VERSION := $(shell npm ls --depth=0 --long 2> /dev/null | head -n 1 | cut -d@ -f 2)

BROWSERIFY_ENTRY = src/main.js

JS_BUNDLE = static/editorsnotes.js
VERSIONED_JS_BUNDLE = $(JS_BUNDLE:.js=-$(VERSION).js)
MINIFIED_VERSIONED_JS_BUNDLE = $(VERSIONED_JS_BUNDLE:.js=.min.js)


CSS_BUNDLE = $(JS_BUNDLE:.js=.css)
VERSIONED_CSS_BUNDLE = $(VERSIONED_JS_BUNDLE:.js=.css)
MINIFIED_VERSIONED_CSS_BUNDLE = $(MINIFIED_VERSIONED_JS_BUNDLE:.js=.css)

VERSIONED_DIRECTORY = editorsnotes-$(VERSION)
VERSIONED_ZIPFILE = dist/$(VERSIONED_DIRECTORY).zip

ZIPPED_FILES = $(MINIFIED_VERSIONED_JS_BUNDLE) \
	       $(MINIFIED_VERSIONED_JS_BUNDLE).map \
	       $(MINIFIED_VERSIONED_CSS_BUNDLE) \
	       LICENSE \
	       README.md \
	       CHANGELOG.md

POSTCSS_OPTS = --use postcss-import \
	       --use postcss-cssnext \
	       --use postcss-url \
	       --postcss-url.url copy \
	       --postcss-url.useHash true \
	       --postcss-url.assetsPath assets \
	       ./style/main.css

JS_FILES = $(shell find src/ -type f -name *js -o -name *jsx)
CSS_FILES = $(shell find style -type f -name *css)

###################
#  Phony targets  #
###################

all: node_modules $(MINIFIED_VERSIONED_JS_BUNDLE) $(MINIFIED_VERSIONED_CSS_BUNDLE)

zip: $(VERSIONED_ZIPFILE)

clean:
	@rm -rf static

watch: node_modules | static
	$(NPM_BIN)/watchify $(BROWSERIFY_ENTRY) -o $(JS_BUNDLE) -dv & \
		$(NPM_BIN)/postcss $(POSTCSS_OPTS) --watch -o $(CSS_BUNDLE)

.PHONY: all clean watch zip


#############
#  Targets  #
#############

static:
	mkdir -p $@

dist:
	mkdir -p $@

node_modules: package.json
	npm install

$(VERSIONED_JS_BUNDLE): $(JS_FILES) | static
	NODE_ENV=production $(NPM_BIN)/browserify -d $(BROWSERIFY_ENTRY) \
		 | $(NPM_BIN)/exorcist $@.map > $@

$(MINIFIED_VERSIONED_JS_BUNDLE): $(VERSIONED_JS_BUNDLE)
	$(NPM_BIN)/uglifyjs $< \
		--in-source-map $<.map \
		--source-map $@.map \
		-c warnings=false \
		-o $@


$(VERSIONED_CSS_BUNDLE): $(CSS_FILES) | static
	$(NPM_BIN)/postcss $(POSTCSS_OPTS) -o $@

$(MINIFIED_VERSIONED_CSS_BUNDLE): $(VERSIONED_CSS_BUNDLE)
	$(NPM_BIN)/cssnano $< -o $@
	rm -f static/editorsnotes.css
	ln -s $(notdir $@) static/editorsnotes.css

$(VERSIONED_ZIPFILE): $(ZIPPED_FILES) | dist
	mkdir $(VERSIONED_DIRECTORY)
	cp $^ $(VERSIONED_DIRECTORY)
	zip -r $@ $(VERSIONED_DIRECTORY)
	rm -rf $(VERSIONED_DIRECTORY)
