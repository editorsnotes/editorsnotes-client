###############
#  Variables  #
###############

NPM_BIN=node_modules/.bin

BROWSERIFY_INFILE = src/main.js
BROWSERIFY_OUTFILE = static/bundle.js

JS_FILES = $(shell find src/ -type f -name *js -o -name *jsx)
FONT_FILES = ./node_modules/font-awesome/fonts/* \
	     ./node_modules/openwebicons/font/*



###################
#  Phony targets  #
###################

all: \
	static/bundle.min.js \
	static/style.min.css


watch:
	$(NPM_BIN)/watchify $(BROWSERIFY_INFILE) -o $(BROWSERIFY_OUTFILE) -dv


watch-styleguide: static/style.css
	NODE_ENV=styleguide ./bin/watch-styleguide.sh


#############
#  Targets  #
#############

static:
	mkdir -p $@


$(BROWSERIFY_OUTFILE): $(BROWSERIFY_INFILE) static $(JS_FILES)
	NODE_ENV=production $(NPM_BIN)/browserify $< -o $@


static/bundle.min.js: static/bundle.js
	$(NPM_BIN)/uglifyjs -c warnings=false -- $< > $@


static/style.css: static style.css static/fonts
	# sed command is to replace url() paths for fonts in compiled CSS
	$(NPM_BIN)/cssnext -U ./style.css \
		| sed -e 's|../fonts\?/|fonts/|g' \
		> $@

static/fonts: $(FONT_FILES)
	mkdir -p static/fonts && cp $(FONT_FILES) $@


static/style.min.css: static/style.css
	$(NPM_BIN)/cleancss $< -o $@


.PHONY: all watch watch-styleguide
