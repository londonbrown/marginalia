# Marginalia

A quiet, markdown-driven publishing site for marginalia.londonchaim.com.

## Monorepo layout

- `apps/web` — Astro static site (Markdown content, SEO pages, RSS, sitemap)
- `apps/cdk` — AWS CDK stack for S3 + CloudFront + Route53 hosting

## Stack decisions

- **Web:** Astro (content collections + static output, minimal JS, great SEO)
- **Infra:** AWS CDK (TypeScript) deploying a private S3 bucket behind CloudFront

## Local development

```bash
npm install
npm run dev:web
```

## Build

```bash
npm run build:web
```

## Deploy (AWS CDK)

1) Ensure `apps/web/dist` exists:

```bash
npm run build:web
```

2) Configure AWS credentials for the target account.

3) (Optional) Update `apps/cdk/cdk.json` with your domain + hosted zone.

4) Deploy:

```bash
npm run deploy:cdk
```

## Content

Markdown essays live in `apps/web/src/content/essays`.

Each file uses frontmatter like:

```yaml
title: "Field Notes on Reading"
description: "Why slow reading creates better thinking."
pubDate: 2026-01-22
tags: ["reading", "attention"]
featured: true
```
