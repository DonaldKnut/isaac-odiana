import { PageHero } from "@/components/page-hero";
import { PodcastArchive } from "@/components/podcast-archive";
import { PodcastPromo } from "@/components/podcast-promo";
import { studioMedia } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Podcast",
  description:
    "Episodes on process, jazz phrasing, beat architecture and studio discipline — streamed from Isaac Odiana’s archive.",
  path: "/podcast",
  image: studioMedia.mic,
});

export default async function PodcastPage() {
  const episodes = await prisma.podcastEpisode.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero page="podcast" image={studioMedia.mic} />
      <PodcastPromo />
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <PodcastArchive episodes={episodes} />
      </section>
    </>
  );
}
