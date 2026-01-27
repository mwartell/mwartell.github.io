# Build the static site
build:
    uv run blag build --output-dir docs

# Serve the site locally on port 8000
serve:
    cd docs && python -m http.server 8220
