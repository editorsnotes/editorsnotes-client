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


JS_FILES = $(shell find src/ -type f -name *js -o -name *jsx)
CSS_FILES = $(shell find style -type f -name *css)
FONT_FILES = ./node_modules/font-awesome/fonts/* \
	     ./node_modules/openwebicons/font/*


###################
#  Phony targets  #
###################

all: $(MINIFIED_VERSIONED_JS_BUNDLE) $(MINIFIED_VERSIONED_CSS_BUNDLE)

clean:
	@rm -rf static

watch: | static
	$(NPM_BIN)/watchify $(BROWSERIFY_ENTRY) -o $(JS_BUNDLE) -dv


watch-styleguide: static/style.css | static
	NODE_ENV=styleguide ./bin/watch-styleguide.sh


.PHONY: all clean watch watch-styleguide


#############
#  Targets  #
#############

static:
	mkdir -p $@


$(VERSIONED_JS_BUNDLE): $(JS_FILES) | static
	NODE_ENV=production $(NPM_BIN)/browserify -d $(BROWSERIFY_ENTRY) \
		 | $(NPM_BIN)/exorcist $@.map > $@

$(MINIFIED_VERSIONED_JS_BUNDLE): $(VERSIONED_JS_BUNDLE)
	$(NPM_BIN)/uglifyjs $< \
		--in-source-map $<.map \
		--source-map $@.map \
		-c warnings=false \
		-o $@


$(VERSIONED_CSS_BUNDLE): static/fonts style/main.css $(CSS_FILES) | static
	# sed command is to replace url() paths for fonts in compiled CSS
	$(NPM_BIN)/cssnext -U ./style/main.css \
		| sed -e 's|../fonts\?/|fonts/|g' \
		> $@

$(MINIFIED_VERSIONED_CSS_BUNDLE): $(VERSIONED_CSS_BUNDLE)
	$(NPM_BIN)/cleancss $< -o $@

static/fonts: $(FONT_FILES)
	mkdir -p static/fonts && cp $(FONT_FILES) $@


