import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const essays = (await getCollection("essays"))
    .filter((entry) => !entry.data.draft)
    .sort(
      (a, b) =>
        b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
    );

  return rss({
    title: "Marginalia",
    description: "Short essays on reading, software, and attention.",
    site: context.site,
    items: essays.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.pubDate,
      description: entry.data.description,
      link: `/essays/${entry.slug}/`
    }))
  });
}
