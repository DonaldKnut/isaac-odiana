"use client";

import { useTransition } from "react";
import { deleteEpisode, toggleEpisodePublished } from "@/app/actions/podcast";
import { useToast } from "@/components/toast-provider";

export function AdminPodcastRowActions({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>, success: string) {
    startTransition(async () => {
      try {
        await action();
        toast.success(success);
      } catch {
        toast.error("Podcast error", "Couldn’t update this episode.");
      }
    });
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          run(
            () => toggleEpisodePublished(id),
            published ? "Unpublished" : "Published",
          )
        }
        className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-amber hover:text-amber-bright disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this episode?")) return;
          run(() => deleteEpisode(id), "Episode deleted");
        }}
        className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-smoke hover:text-parchment disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
