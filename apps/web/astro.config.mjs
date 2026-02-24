import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  site: "https://marginalia.londonchaim.com",
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer" ]}]
    ],
    shikiConfig: {
      theme: "github-light"
    }
  }
});
