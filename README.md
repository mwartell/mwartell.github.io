# mwartell.github.io

A personal blog built with [blag](https://github.com/mwartell/blag) static site generator and hosted on GitHub Pages.

## About

This repository contains the source code for [mwartell.github.io](https://mwartell.github.io), a personal blog featuring technical writing on Python, software development, and other programming topics.

The site is built using:
- **[blag](https://github.com/mwartell/blag)** - A minimal Python-based static site generator (forked from [venthur/blag](https://github.com/venthur/blag) with added markdown tables extension support)
- **GitHub Pages** - For hosting the generated site
- **Python 3.12+** - For running the build process

## Repository Structure

```
├── config.ini          # Site configuration (title, description, author)
├── justfile            # Build automation
├── pyproject.toml      # Python project dependencies
├── content/            # Blog posts and pages (Markdown)
├── docs/               # Generated HTML files (published to GitHub Pages)
├── templates/          # HTML templates for site layout
├── static/             # CSS and static assets
└── favicon/            # Site favicon files
```

## GitHub Pages Integration

This repository uses GitHub Pages with the following setup:

- **Source**: Deploy from the `/docs` folder on the `main` branch
- **Custom Domain**: None (uses default `mwartell.github.io`)
- **Build Process**: Manual builds using `blag` (not GitHub Actions)

The workflow is:
1. Write content in `content/` directory
2. Run build command to generate HTML in `docs/`
3. Commit and push both source and generated files
4. GitHub Pages automatically serves the content from `docs/`

## Getting Started

### Prerequisites

- Python 3.12 or later
- [uv](https://docs.astral.sh/uv/) package manager
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mwartell/mwartell.github.io.git
   cd mwartell.github.io
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

3. Build the site:
   ```bash
   just build
   ```

The generated site will be in the `docs/` directory and can be viewed by opening `docs/index.html` in a browser.

## Adding New Content

### Blog Posts

1. Create a new Markdown file in the `content/` directory:
   ```bash
   touch content/my-new-post.md
   ```

2. Add frontmatter and content:
   ```markdown
   ---
   title: My New Blog Post
   date: 2026-01-26
   tags: python, tutorial
   ---

   Your blog post content here...
   ```

3. Build the site:
   ```bash
   just build
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "Add new blog post: My New Blog Post"
   git push origin main
   ```

### Pages

Static pages (like the About page) are also created in the `content/` directory using the same Markdown format. They don't require a date but should include a title in the frontmatter.

### Frontmatter Fields

- `title`: The page/post title (required)
- `date`: Publication date in YYYY-MM-DD format (required for blog posts)
- `tags`: Comma-separated list of tags for categorization

## Development

### Local Preview

After running `just build`, you can preview the site locally by opening `docs/index.html` in your browser, or by serving the site with:

```bash
just serve
```

Then visit [http://localhost:8000](http://localhost:8000)

### Configuration

Site-wide settings can be modified in [config.ini](config.ini):

```ini
[main]
base_url = https://mwartell.github.io
title = mwartell maladies
description = the fourth most influential blog in the galaxy…
author = matt wartell
```

### Templates and Styling

- **Templates**: HTML templates in `templates/` control the site structure and layout
- **Styles**: CSS files in `static/` control the visual appearance
- **Assets**: The `static/` directory is copied to the output during build

## Build Process

The build process is automated through the [justfile](justfile):

```bash
just build    # Generate the site from content/ to docs/
just serve    # Serve the site locally on http://localhost:8000
```

The `build` command runs `blag build --output-dir docs` which:
1. Processes Markdown files in `content/`
2. Applies templates from `templates/`
3. Copies static assets from `static/`
4. Generates HTML files in `docs/`

## Deployment

Deployment is automatic once changes are pushed to the `main` branch:

1. Make your changes (add content, modify templates, etc.)
2. Run `just build` to generate updated HTML
3. Commit both source files and generated `docs/` content
4. Push to GitHub
5. GitHub Pages will automatically serve the updated content from `docs/`

The site typically updates within a few minutes of pushing changes.

## About the blag Fork

This project uses a fork of blag ([mwartell/blag](https://github.com/mwartell/blag)) instead of the upstream version. The fork adds support for markdown tables through the `tables` extension, which is not available in the upstream version.

**Key difference**: The fork adds `"tables"` to the markdown extensions list in `blag/markdown.py`, enabling proper rendering of markdown tables as HTML `<table>` elements.

## License

This is a personal blog repository. Content and code are provided as-is for reference and learning purposes.
