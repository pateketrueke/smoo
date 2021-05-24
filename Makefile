browser ?= chrome

help: Makefile
	@awk -F':.*?##' '/^[a-z0-9\\%!:-]+:.*##/{gsub("%","*",$$1);gsub("\\\\",":*",$$1);printf "\033[36m%8s\033[0m %s\n",$$1,$$2}' $<

ci: src deps ## Run CI scripts
	@npm run test -- --color

dev: src deps ## Start dev tasks
	@npm run dev & npm run serve

e2e: src deps ## Run E2E tests locally
	@BROWSER=$(browser) npm run test

deps: package*.json
	@(((ls node_modules | grep .) > /dev/null 2>&1) || npm i) || true
