"use client";

import { useActionState, useEffect, useState } from "react";
import { Mic2, PenLine } from "lucide-react";
import {
  createEpisode,
  updateEpisode,
  type PodcastActionState,
} from "@/app/actions/podcast";
import { MediaUploader } from "@/components/media-uploader";
import { useLocale } from "@/components/locale-provider";
import { UiButton } from "@/components/ui-button";

const initial: PodcastActionState = { ok: false, message: "" };

export type AdminPodcastFormValues = {
  id: string;
  title: string;
  titleFr: string | null;
  slug: string;
  description: string;
  descriptionFr: string | null;
  category: string | null;
  categoryFr: string | null;
  durationSec: number | null;
  published: boolean;
  coverUrl: string | null;
  audioUrl: string;
};

export function AdminPodcastForm({
  episode,
  onCancelEdit,
}: {
  episode?: AdminPodcastFormValues | null;
  onCancelEdit?: () => void;
}) {
  const editing = Boolean(episode);
  const [state, action, pending] = useActionState(
    editing ? updateEpisode : createEpisode,
    initial,
  );
  const [coverUrl, setCoverUrl] = useState(episode?.coverUrl ?? "");
  const [audioUrl, setAudioUrl] = useState(episode?.audioUrl ?? "");
  const { t } = useLocale();
  const a = t.admin.common;

  useEffect(() => {
    setCoverUrl(episode?.coverUrl ?? "");
    setAudioUrl(episode?.audioUrl ?? "");
  }, [episode]);

  useEffect(() => {
    if (state.ok && editing) onCancelEdit?.();
  }, [state, editing, onCancelEdit]);

  return (
    <form
      id="admin-podcast-form"
      action={action}
      className="mt-10 space-y-5 border border-line p-6"
    >
      {episode ? <input type="hidden" name="id" value={episode.id} /> : null}
      <div>
        <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
          {editing ? (
            <PenLine className="h-3.5 w-3.5" strokeWidth={1.6} />
          ) : (
            <Mic2 className="h-3.5 w-3.5" strokeWidth={1.6} />
          )}
          Studio
        </p>
        <h2 className="mt-3 font-display text-2xl text-parchment">
          {editing ? a.editEpisode : a.newEpisode}
        </h2>
      </div>

      <input type="hidden" name="coverUrl" value={coverUrl} />
      <input type="hidden" name="audioUrl" value={audioUrl} />

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label={a.titleEn}
          name="title"
          required
          defaultValue={episode?.title}
        />
        <Field
          label={a.titleFr}
          name="titleFr"
          defaultValue={episode?.titleFr ?? ""}
        />
        <Field
          label={a.slug}
          name="slug"
          defaultValue={episode?.slug}
        />
        <label className="block text-sm text-smoke md:col-span-2">
          {a.descriptionEn}
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={episode?.description}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke md:col-span-2">
          {a.descriptionFr}
          <textarea
            name="descriptionFr"
            rows={4}
            defaultValue={episode?.descriptionFr ?? ""}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <Field
          label={a.category}
          name="category"
          placeholder="Process"
          defaultValue={episode?.category ?? ""}
        />
        <Field
          label={a.categoryFr}
          name="categoryFr"
          defaultValue={episode?.categoryFr ?? ""}
        />
        <Field
          label={a.durationSec}
          name="durationSec"
          type="number"
          defaultValue={
            episode?.durationSec != null ? String(episode.durationSec) : undefined
          }
        />
        <label className="flex items-center gap-3 text-sm text-smoke md:col-span-2">
          <input
            type="checkbox"
            name="published"
            className="accent-amber"
            defaultChecked={episode?.published ?? false}
          />
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

      <div className="flex flex-wrap gap-3">
        <UiButton
          type="submit"
          tone="amber"
          loading={pending}
          disabled={!audioUrl}
          icon={editing ? PenLine : Mic2}
        >
          {pending
            ? a.saving
            : editing
              ? a.saveEpisode
              : a.createEpisode}
        </UiButton>
        {editing ? (
          <UiButton type="button" tone="line" onClick={onCancelEdit}>
            {t.close}
          </UiButton>
        ) : null}
      </div>

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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm text-smoke">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
      />
    </label>
  );
}
