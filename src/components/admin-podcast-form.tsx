"use client";

import { useActionState, useState } from "react";
import { Mic2 } from "lucide-react";
import {
  createEpisode,
  type PodcastActionState,
} from "@/app/actions/podcast";
import { MediaUploader } from "@/components/media-uploader";
import { useLocale } from "@/components/locale-provider";

const initial: PodcastActionState = { ok: false, message: "" };

export function AdminPodcastForm() {
  const [state, action, pending] = useActionState(createEpisode, initial);
  const [coverUrl, setCoverUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const { t } = useLocale();
  const a = t.admin.common;

  return (
    <form action={action} className="mt-10 space-y-5 border border-line p-6">
      <div>
        <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
          <Mic2 className="h-3.5 w-3.5" strokeWidth={1.6} />
          Studio
        </p>
        <h2 className="mt-3 font-display text-2xl text-parchment">{a.newEpisode}</h2>
      </div>

      <input type="hidden" name="coverUrl" value={coverUrl} />
      <input type="hidden" name="audioUrl" value={audioUrl} />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label={a.titleEn} name="title" required />
        <Field label={a.titleFr} name="titleFr" />
        <Field label={a.slug} name="slug" />
        <label className="block text-sm text-smoke md:col-span-2">
          {a.descriptionEn}
          <textarea
            name="description"
            required
            rows={4}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke md:col-span-2">
          {a.descriptionFr}
          <textarea
            name="descriptionFr"
            rows={4}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <Field label={a.category} name="category" placeholder="Process" />
        <Field label={a.categoryFr} name="categoryFr" />
        <Field label={a.durationSec} name="durationSec" type="number" />
        <label className="flex items-center gap-3 text-sm text-smoke md:col-span-2">
          <input type="checkbox" name="published" className="accent-amber" />
          {a.publish}
        </label>
      </div>

      <MediaUploader
        label={a.coverImage}
        multiple={false}
        accept="image/*"
        values={coverUrl ? [coverUrl] : []}
        onChange={(urls) => setCoverUrl(urls[0] ?? "")}
      />

      <MediaUploader
        label={a.audio}
        multiple={false}
        accept="audio/*"
        values={audioUrl ? [audioUrl] : []}
        onChange={(urls) => setAudioUrl(urls[0] ?? "")}
      />

      <button
        type="submit"
        disabled={pending || !audioUrl}
        className="cursor-pointer bg-amber px-5 py-3 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-ink disabled:opacity-50"
      >
        {pending ? a.saving : a.createEpisode}
      </button>

      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-amber-bright" : "text-sand"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm text-smoke">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
      />
    </label>
  );
}
