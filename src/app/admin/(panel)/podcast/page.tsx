import { Mic2 } from "lucide-react";
import { AdminPageHeading } from "@/components/admin-page-heading";
import { AdminPodcastForm } from "@/components/admin-podcast-form";
import { AdminPodcastRowActions } from "@/components/admin-podcast-row-actions";
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
        description="Compose episodes, attach audio/cover media, and publish to the archive."
      />

      <div className="mt-10 overflow-x-auto border border-line">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-ink-soft text-[0.65rem] uppercase tracking-[0.16em] text-smoke">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {episodes.map((episode) => (
              <tr key={episode.id} className="border-b border-line/70">
                <td className="px-4 py-4 text-parchment">{episode.title}</td>
                <td className="px-4 py-4 text-smoke">
                  {episode.category ?? "—"}
                </td>
                <td className="px-4 py-4 text-smoke">
                  {episode.published ? "Published" : "Draft"}
                </td>
                <td className="px-4 py-4">
                  <AdminPodcastRowActions
                    id={episode.id}
                    published={episode.published}
                  />
                </td>
              </tr>
            ))}
            {episodes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-smoke">
                  No episodes yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <AdminPodcastForm />
    </div>
  );
}
