# Build the static site
build:
    hugo --minify

# Serve the site locally with live reload
serve:
    hugo server -D --port 8220

# Clean build output
clean:
    rm -rf docs/*

# Install test dependencies
install:
    npm install
    npx playwright install chromium

# Run Playwright tests (headless)
test: install
    npx playwright test --reporter=line

# Run Playwright tests with UI
test-ui: install
    npx playwright test --ui

# Run Playwright tests with visible browser
test-headed: install
    npx playwright test --headed

# Run Playwright tests and show HTML report
test-report: install
    npx playwright test && npx playwright show-report
