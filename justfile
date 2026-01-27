# Build the static site
build:
    hugo --minify

# Serve the site locally with live reload
serve:
    hugo server -D --port 8220

# Clean build output
clean:
    rm -rf docs/*
