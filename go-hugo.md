# Migration Plan: blag → Hugo

## Migration Status

**Phases Completed: 1-7** ✅ (2026-01-26)
- Hugo v0.154.5 installed and configured
- All Jinja2 templates converted to Hugo Go templates
- All content migrated with updated frontmatter
- Static assets consolidated (14 files in static/)
- Build process updated (justfile + .gitignore)
- Site successfully builds (22 pages, 14 static files)
- No warnings or errors

**Next Steps:** Phase 8-9 (cleanup, final verification)

---

## Overview

This document outlines the complete migration from **blag** (Python static site generator) to **Hugo** (Go-based static site generator). The migration preserves all existing content, styling, and site structure while gaining Hugo's rich Markdown support (including bulleted lists!).

---

## Current State Analysis

### Site Configuration
- **config.ini** contains:
  - `base_url`: https://mwartell.github.io
  - `title`: mwartell maladies
  - `description`: the fourth most influential blog in the galaxy…
  - `author`: matt wartell

### Content Structure
- **5 content files** in `content/`:
  - `about.md` - No frontmatter (raw markdown)
  - `a-clear-shortcut.md`, `collaborative-development-docs.md`, `modern-python-packages.md`, `plea-for-better-docs.md` - With YAML frontmatter

### Frontmatter Format (blag)
```yaml
---
title: collaborative development documentation
subtitle: a new methodology for ai-assisted technical investigation
date: 2026-01-26
tags: agentic development
---
```

### Templates
- Jinja2 templates in `templates/`: `archive.html`, `article.html`, `base.html`, `index.html`, `page.html`, `tag.html`, `tags.html`

### Static Assets
- CSS files in `static/`: `code-dark.css`, `code-light.css`, `style.css`
- Favicon files in `favicon/`

### Build Output
- Outputs to `docs/` (for GitHub Pages)

---

## Migration Steps

### Phase 1: Install and Initialize Hugo ✅

> **Completed 2026-01-26**: Installed Hugo v0.154.5 via Homebrew. Created `layouts/_default/`, `layouts/partials/`, and `archetypes/` directories.

- [x] **1.1** Install Hugo (if not already installed)
  ```bash
  brew install hugo
  ```

- [x] **1.2** Verify installation
  ```bash
  hugo version
  ```

- [x] **1.3** Create Hugo directory structure (in-place migration)
  ```bash
  mkdir -p layouts/_default layouts/partials archetypes
  ```

---

### Phase 2: Configure Hugo ✅

> **Completed 2026-01-26**: Created `hugo.toml` with site config, taxonomy support, and publishDir=docs. Removed `config.ini`.

- [x] **2.1** Create `hugo.toml` configuration
  ```toml
  baseURL = "https://mwartell.github.io/"
  languageCode = "en-us"
  title = "mwartell maladies"

  [params]
    description = "the fourth most influential blog in the galaxy…"
    author = "matt wartell"

  [outputs]
    home = ["HTML", "RSS"]

  # Output to docs/ for GitHub Pages
  publishDir = "docs"

  [markup]
    [markup.goldmark]
      [markup.goldmark.renderer]
        unsafe = true

  [taxonomies]
    tag = "tags"
  ```

- [x] **2.2** Remove old `config.ini`

---

### Phase 3: Set Up Theme/Layouts ✅

> **Completed 2026-01-26**: Converted all Jinja2 templates to Hugo Go templates. Created `baseof.html`, `index.html`, `single.html`, `list.html`, `terms.html`, and `term.html` in layouts/.

Hugo requires either a theme or custom layouts. We'll create minimal custom layouts that match the current design.

- [x] **3.1** Create layouts directory structure
  ```
  layouts/
  ├── _default/
  │   ├── baseof.html      # Base template (from templates/base.html)
  │   ├── list.html        # List pages (archive, tags)
  │   ├── single.html      # Single posts (from templates/article.html)
  │   ├── terms.html       # Taxonomy terms (tags index)
  │   └── term.html        # Individual tag pages
  └── index.html           # Homepage (from templates/index.html)
  ```

- [x] **3.2** Convert Jinja2 templates to Hugo Go templates

  Key syntax conversions:
  | blag (Jinja2)              | Hugo (Go templates)              |
  |----------------------------|----------------------------------|
  | `{{ site.title }}`         | `{{ .Site.Title }}`              |
  | `{{ site.description }}`   | `{{ .Site.Params.description }}` |
  | `{% block content %}`      | `{{ block "main" . }}`           |
  | `{% for post in posts %}`  | `{{ range .Pages }}`             |
  | `{{ post.title }}`         | `{{ .Title }}`                   |
  | `{{ post.date }}`          | `{{ .Date.Format "2006-01-02" }}`|

- [ ] **3.3** Remove old `templates/` directory after conversion

---

### Phase 4: Migrate Content ✅

> **Completed 2026-01-26**: Moved all blog posts to `content/posts/`. Updated frontmatter for all posts (quoted strings, array-formatted tags, added draft: false). Added frontmatter to about.md.

- [x] **4.1** Reorganize content structure for Hugo
  ```
  content/
  ├── posts/           # Blog posts
  │   ├── a-clear-shortcut.md
  │   ├── collaborative-development-docs.md
  │   ├── modern-python-packages.md
  │   └── plea-for-better-docs.md
  └── about.md         # Static page (stays at root)
  ```

- [x] **4.2** Update frontmatter format for each post

  **Before (blag):**
  ```yaml
  ---
  title: collaborative development documentation
  subtitle: a new methodology for ai-assisted technical investigation
  date: 2026-01-26
  tags: agentic development
  ---
  ```

  **After (Hugo):**
  ```yaml
  ---
  title: "collaborative development documentation"
  subtitle: "a new methodology for ai-assisted technical investigation"
  date: 2026-01-26
  tags: ["agentic development"]
  draft: false
  ---
  ```

  Key changes:
  - Quote string values
  - Convert `tags` from space-separated string to array
  - Add `draft: false` to ensure posts are published

- [x] **4.3** Add frontmatter to `about.md`
  ```yaml
  ---
  title: "About Me"
  layout: "single"
  ---
  ```

---

### Phase 5: Migrate Static Assets ✅

> **Completed 2026-01-26**: CSS files already in correct location. Copied all favicon files from `favicon/` to `static/`. Hugo now serves 14 static files.

- [x] **5.1** Move CSS files
  - `static/style.css` → `static/style.css` (same location, Hugo uses same convention)
  - `static/code-dark.css` → `static/code-dark.css`
  - `static/code-light.css` → `static/code-light.css`

- [x] **5.2** Move favicon files
  - Move contents of `favicon/` to `static/`
  - Update paths in templates if needed

---

### Phase 6: Configure Taxonomies ✅

> **Completed 2026-01-26**: Taxonomy configuration was completed in Phase 2. Templates created in Phase 3.

- [x] **6.1** Add taxonomy configuration to `hugo.toml`
  ```toml
  [taxonomies]
    tag = "tags"
  ```

- [x] **6.2** Create taxonomy templates
  - `layouts/_default/terms.html` - Tags index page
  - `layouts/_default/term.html` - Individual tag page

---

### Phase 7: Update Build Process ✅

> **Completed 2026-01-26**: Updated `justfile` with Hugo commands (build, serve, clean). Added Hugo-specific entries to `.gitignore`. Fixed publishDir config warning.

- [x] **7.1** Update `justfile`
  ```makefile
  # Build the static site
  build:
      hugo --minify

  # Serve the site locally with live reload
  serve:
      hugo server -D --port 8220

  # Clean build output
  clean:
      rm -rf docs/*
  ```

- [x] **7.2** Update `.gitignore` (if needed)
  ```
  resources/
  .hugo_build.lock
  public/
  ```

---

### Phase 8: Cleanup

- [ ] **8.1** Remove blag-specific files
  - `config.ini`
  - `templates/` directory
  - `pyproject.toml` (if only used for blag)

- [ ] **8.2** Clear old `docs/` output
  ```bash
  rm -rf docs/*
  ```

- [ ] **8.3** Test build
  ```bash
  hugo --minify
  ```

- [ ] **8.4** Test locally
  ```bash
  hugo server -D --port 8220
  ```

---

### Phase 9: Verify Migration

- [ ] **9.1** Check all pages render correctly
  - [ ] Homepage with post list
  - [ ] Individual posts with proper formatting
  - [ ] **Bulleted lists work!** 🎉
  - [ ] About page
  - [ ] Tags index
  - [ ] Individual tag pages

- [ ] **9.2** Verify RSS feed (`/index.xml`)

- [ ] **9.3** Verify all links work

- [ ] **9.4** Commit and push to GitHub

---

## File Mapping Summary

| blag                    | Hugo                              |
|-------------------------|-----------------------------------|
| `config.ini`            | `hugo.toml`                       |
| `templates/base.html`   | `layouts/_default/baseof.html`    |
| `templates/article.html`| `layouts/_default/single.html`    |
| `templates/index.html`  | `layouts/index.html`              |
| `templates/archive.html`| `layouts/_default/list.html`      |
| `templates/tag.html`    | `layouts/_default/term.html`      |
| `templates/tags.html`   | `layouts/_default/terms.html`     |
| `static/*`              | `static/*` (same)                 |
| `content/*.md`          | `content/posts/*.md`              |
| `docs/` (output)        | `docs/` (configured via publishDir)|

---

## Estimated Time

- Phase 1-2: ~10 minutes
- Phase 3: ~30-45 minutes (template conversion)
- Phase 4: ~15 minutes (content migration)
- Phase 5-6: ~10 minutes
- Phase 7-9: ~15 minutes

**Total: ~1.5-2 hours**

---

## Rollback Plan

If migration fails:
1. Git reset to pre-migration commit
2. Restore `config.ini`, `templates/`, original `content/` structure
3. Rebuild with `uv run blag build --output-dir docs`

---

## References

- [Hugo Quick Start](https://gohugo.io/getting-started/quick-start/)
- [Hugo Directory Structure](https://gohugo.io/getting-started/directory-structure/)
- [Hugo Templates](https://gohugo.io/templates/)
- [Hugo Taxonomies](https://gohugo.io/content-management/taxonomies/)
- [GitHub Pages with Hugo](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
