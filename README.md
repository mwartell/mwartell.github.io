# mwartell.github.io

A personal blog built with [Hugo](https://gohugo.io) static site generator and hosted on GitHub Pages.

## About

This repository contains the source code for [mwartell.github.io](https://mwartell.github.io), a personal blog featuring technical writing on Python, software development, and other programming topics.

The site is built using:
- **[Hugo](https://gohugo.io)** - A fast, flexible static site generator written in Go
- **GitHub Pages** - For hosting the generated site
- **[just](https://github.com/casey/just)** - Command runner for build automation

**Note:** This site was migrated from [blag](https://github.com/mwartell/blag) to Hugo in January 2026 to gain better Markdown support, including proper rendering of bulleted lists.

## Repository Structure

```
├── hugo.toml           # Site configuration (title, description, author)
├── justfile            # Build automation commands
├── content/            # Blog posts and pages (Markdown)
│   ├── posts/          # Blog posts with YAML frontmatter
│   └── about.md        # Static pages
├── layouts/            # Hugo template files
│   ├── _default/       # Default layouts (baseof, single, list, etc.)
│   └── index.html      # Homepage template
├── static/             # CSS, images, and static assets
├── docs/               # Generated HTML files (published to GitHub Pages)
└── archetypes/         # Content templates for new posts
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

- [Hugo](https://gohugo.io/installation/) v0.154.5 or later
- [just](https://github.com/casey/just) command runner (optional, but recommended)
- Git

### Installation

**macOS (via Homebrew):**
```bash
brew install hugo just
```

**Other platforms:** See [Hugo installation guide](https://gohugo.io/installation/)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mwartell/mwartell.github.io.git
   cd mwartell.github.io
   ```

2. Build the site:
   ```bash
   just build
   ```

   Or without `just`:
   ```bash
   hugo --minify
   ```

3. View locally:
   ```bash
   just serve
   ```

The generated site will be in the `docs/` directory, ready for GitHub Pages deployment.

## Build Commands

Using `just` (recommended):
```bash
just build   # Build the site with minification
just serve   # Start local development server with live reload
just clean   # Clean the output directory
```
## Adding New Content

### Blog Posts

1. Create a new post using Hugo:
   ```bash
   hugo new posts/my-new-post.md
   ```

2. Edit `content/posts/my-new-post.md` with frontmatter and content:
   ```markdown
   ---
   title: "My New Blog Post"
   date: 2026-01-26
   tags: ["python", "tutorial"]
   draft: false
   ---

   Your blog post content here with **full Markdown support**:
   - Bulleted lists work!
   - So do numbered lists
   - And all other Markdown features
   ```

3. Preview locally:
   ```bash
   just serve
   ```

4. Build and deploy:
   ```bash
   just build
   git add .
   git commit -m "Add new blog post: My New Blog Post"
   git push origin main
   ```

### Pages

Static pages (like the About page) are created in the `content/` directory:

```bash
# Create a new page
hugo new about.md
```

Edit with appropriate frontmatter and content.

### Frontmatter Fields

Required/recommended fields for blog posts:

```yaml
---
title: "Your Post Title"        # Required: Post title (quoted)
subtitle: "Optional subtitle"   # Optional: Appears on listing pages
date: 2026-01-26                # Required: Publication date
tags: ["tag1", "tag2"]          # Optional: Array of tags for categorization
draft: false                    # Required: Set to false to publish
---
```

## Development

### Local Preview with Live Reload

Hugo includes a development server with live reload:

```bash
just serve
# Or: hugo server -D --port 8220
```

Then visit [http://localhost:8220](http://localhost:8220). Changes to content, templates, or styles automatically refresh the browser.

### Configuration

Site-wide settings are in [hugo.toml](hugo.toml):

```toml
baseURL = "https://mwartell.github.io/"
languageCode = "en-us"
title = "mwartell maladies"
publishDir = "docs"

[params]
  description = "the fourth most influential blog in the galaxy…"
  author = "matt wartell"

[taxonomies]
  tag = "tags"
```

### Templates and Styling

- **Templates**: Hugo Go templates in `layouts/` control site structure
  - `layouts/_default/baseof.html` - Base template
  - `layouts/index.html` - Homepage
  - `layouts/_default/single.html` - Individual posts
  - `layouts/_default/list.html` - Archive/list pages
  - `layouts/_default/terms.html` - Tags index
- **Styles**: CSS files in `static/` (automatically copied to output)
- **Static assets**: Images, fonts, etc. in `static/`

## Build Process

The build process is automated through the [justfile](justfile):

```bash
just build    # Generate the site from content/ to docs/
just serve    # Serve locally at http://localhost:8220 with live reload
just clean    # Remove all generated files from docs/
```

Hugo's build process:
1. Reads configuration from `hugo.toml`
2. Processes Markdown files in `content/posts/`
3. Applies Go templates from `layouts/`
4. Copies static assets from `static/`
5. Generates optimized HTML files in `docs/`
6. Creates RSS feed (`docs/index.xml`) and sitemap

Build times are typically 15-40ms for the full site.

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
