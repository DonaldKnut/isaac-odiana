"use client";

import { deleteEpisode, toggleEpisodePublished } from "@/app/actions/podcast";

export function AdminPodcastRowActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => toggleEpisodePublished(id)}
        className="text-[0.65rem] uppercase tracking-[0.16em] text-amber hover:text-amber-bright"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={() => {
          if (confirm("Delete this episode?")) deleteEpisode(id);
        }}
        className="text-[0.65rem] uppercase tracking-[0.16em] text-smoke hover:text-parchment"
      >
        Delete
      </button>
    </div>
  );
}
