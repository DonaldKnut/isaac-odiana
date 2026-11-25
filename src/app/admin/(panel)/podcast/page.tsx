import { Mic2 } from "lucide-react";
import { AdminPageHeading } from "@/components/admin-page-heading";
import { AdminPodcastPanel } from "@/components/admin-podcast-panel";
import { prisma } from "@/lib/prisma";

export default async function AdminPodcastPage() {
  const episodes = await prisma.podcastEpisode.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <AdminPageHeading
        icon={Mic2}
        title="Podcast"
        description="Create or edit episodes, attach audio/cover media, and publish to the archive."
      />
      <AdminPodcastPanel
        episodes={episodes.map((episode) => ({
          id: episode.id,
          title: episode.title,
          titleFr: episode.titleFr,
          slug: episode.slug,
          description: episode.description,
          descriptionFr: episode.descriptionFr,
          category: episode.category,
          categoryFr: episode.categoryFr,
          durationSec: episode.durationSec,
          published: episode.published,
          coverUrl: episode.coverUrl,
          audioUrl: episode.audioUrl,
        }))}
      />
    </div>
  );
}
