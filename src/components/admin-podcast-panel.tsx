"use client";

import { useState } from "react";
import {
  AdminPodcastForm,
  type AdminPodcastFormValues,
} from "@/components/admin-podcast-form";
import { AdminPodcastRowActions } from "@/components/admin-podcast-row-actions";
import { useLocale } from "@/components/locale-provider";

export function AdminPodcastPanel({
  episodes,
}: {
  episodes: AdminPodcastFormValues[];
}) {
  const { t } = useLocale();
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = episodes.find((episode) => episode.id === editingId) ?? null;

  return (
    <>
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
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(episode.id);
                        window.requestAnimationFrame(() => {
                          document
                            .getElementById("admin-podcast-form")
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        });
                      }}
                      className="cursor-pointer text-[0.65rem] uppercase tracking-[0.16em] text-parchment hover:text-amber-bright"
                    >
                      {t.admin.common.editEpisode}
                    </button>
                    <AdminPodcastRowActions
                      id={episode.id}
                      published={episode.published}
                    />
                  </div>
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

      <AdminPodcastForm
        key={editing?.id ?? "create"}
        episode={editing}
        onCancelEdit={() => setEditingId(null)}
      />
    </>
  );
}
