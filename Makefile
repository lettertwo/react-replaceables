TEST_CMD := ./node_modules/.bin/jest
SRC_DIR := ./src
UMD_DIR := ./umd
ESM_DIR := ./esm
BABEL_CMD := ./node_modules/.bin/babel $(SRC_DIR)
BUILD_UMD_CMD := BABEL_ENV=umd $(BABEL_CMD) -d $(UMD_DIR)
BUILD_ESM_CMD := BABEL_ENV=esm $(BABEL_CMD) -d $(ESM_DIR)

$(UMD_DIR): $(shell find ${SRC_DIR} -type f)
	@$(BUILD_UMD_CMD)
	@touch $(UMD_DIR)

$(ESM_DIR): $(shell find ${SRC_DIR} -type f)
	@$(BUILD_ESM_CMD)
	@touch $(ESM_DIR)

build: $(UMD_DIR) $(ESM_DIR)

clean:
	@rm -rf $(UMD_DIR)
	@rm -rf $(ESM_DIR)

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
