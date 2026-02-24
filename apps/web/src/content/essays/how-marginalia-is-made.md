---
title: "How Marginalia Is Made"
description: "A brief tour of the tools and choices behind this static site."
pubDate: 2026-02-24
tags: ["about", "build", "infrastructure"]
---

Marginalia is built to be simple: Markdown in, static pages out. Each essay
lives in the repository as a Markdown file with a small frontmatter header.
[Astro](https://astro.build/) turns that content into fast, pre-rendered HTML pages with an RSS feed
and sitemap for search engines.

The site ships as a static bundle. A minimal AWS CDK stack deploys it to an
S3 bucket behind CloudFront, keeping the origin private while the CDN serves
clean URLs over HTTPS.

Everything lives in one monorepo: `apps/web` for the site and `apps/cdk` for
infrastructure. If you want the full build recipe, the source is here:

https://github.com/londonbrown/marginalia
