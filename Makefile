TEST_CMD := ./node_modules/.bin/jest
SRC_DIR := ./src
DIST_DIR := ./dist
ES6_DIR := ./es6
BABEL_CMD := ./node_modules/.bin/babel --ignore '__tests__' $(SRC_DIR)
BUILD_DIST_CMD :=  $(BABEL_CMD) --presets es2015,react -d $(DIST_DIR)
BUILD_ES6_CMD := $(BABEL_CMD) --presets react -d $(ES6_DIR)

$(DIST_DIR): $(shell find ${SRC_DIR} -type f)
	@$(BUILD_DIST_CMD)
	@touch $(DIST_DIR)

$(ES6_DIR): $(shell find ${SRC_DIR} -type f)
	@$(BUILD_ES6_CMD)
	@touch $(ES6_DIR)

build: $(DIST_DIR) $(ES6_DIR)

clean:
	@rm -rf $(DIST_DIR)
	@rm -rf $(ES6_DIR)

lint:
	@./node_modules/.bin/eslint $(SRC_DIR)

test:
	@$(TEST_CMD)

ci:
	@$(TEST_CMD) --watch

major:
	npm version major

minor:
	npm version minor

patch:
	npm version patch

changelog.template.ejs:
	@echo "## x.x.x\n\n<% commits.forEach(function(commit) { -%>\n* <%= commit.title %>\n<% }) -%>" > changelog.template.ejs

changelog: changelog.template.ejs
	@touch CHANGELOG.md
	@git-release-notes $$(git describe --abbrev=0)..HEAD $< | cat - CHANGELOG.md >> CHANGELOG.md.new
	@mv CHANGELOG.md{.new,}
	@rm changelog.template.ejs
	@echo "Added changes since $$(git describe --abbrev=0) to CHANGELOG.md"

.PHONY: clean lint test ci major minor patch
