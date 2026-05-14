.PHONY: dev build test release

dev:
	npm run dev

build:
	npm run build

test:
	npm test

# Tag HEAD with the version in manifest.json and push it. The push triggers
# the release workflow on GitHub, which builds, attests, and publishes.
release:
	@VERSION=$$(node -p "require('./manifest.json').version"); \
	if [ -n "$$(git status --porcelain)" ]; then \
	  echo "working tree not clean — commit or stash first" >&2; exit 1; \
	fi; \
	if git rev-parse "$$VERSION" >/dev/null 2>&1; then \
	  echo "tag $$VERSION already exists" >&2; exit 1; \
	fi; \
	echo "Pushing HEAD and tagging $$VERSION at $$(git rev-parse --short HEAD)..."; \
	git push origin HEAD && \
	git tag -a "$$VERSION" -m "Release $$VERSION" && \
	git push origin "$$VERSION"
