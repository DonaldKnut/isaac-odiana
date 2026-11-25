"use client";

import { useActionState, useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import {
  saveAnnouncementsAction,
  type CmsActionState,
} from "@/app/actions/cms";
import { MediaUploader } from "@/components/media-uploader";
import { useToast } from "@/components/toast-provider";
import { UiButton } from "@/components/ui-button";
import type {
  AnnouncementItem,
  AnnouncementsBundle,
  LocalizedString,
} from "@/lib/cms/types";

const initial: CmsActionState = { ok: false, message: "" };

const kinds: AnnouncementItem["kind"][] = [
  "mixtape",
  "episode",
  "song",
  "drop",
  "general",
];

export function AdminAnnouncementsEditor({
  initialValue,
}: {
  initialValue: AnnouncementsBundle;
}) {
  const [value, setValue] = useState(initialValue);
  const [state, action, pending] = useActionState(
    saveAnnouncementsAction,
    initial,
  );
  const toast = useToast();

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success("Saved", state.message);
    else toast.error("Error", state.message);
  }, [state, toast]);

  function updateItem(index: number, next: AnnouncementItem) {
    setValue({
      ...value,
      items: value.items.map((item, i) => (i === index ? next : item)),
    });
  }

  return (
    <form action={action} className="mt-10 space-y-8">
      <input type="hidden" name="payload" value={JSON.stringify(value)} />

      <div className="space-y-4 border border-line p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center border border-amber/35 bg-amber/10 text-amber-bright">
            <Megaphone className="h-4 w-4" strokeWidth={1.6} />
          </span>
          <h2 className="font-display text-2xl text-parchment">Board copy</h2>
        </div>
        <BilingualField
          label="Eyebrow"
          value={value.eyebrow}
          onChange={(eyebrow) => setValue({ ...value, eyebrow })}
        />
        <BilingualField
          label="Title"
          value={value.title}
          onChange={(title) => setValue({ ...value, title })}
        />
        <BilingualField
          label="Body"
          value={value.body}
          onChange={(body) => setValue({ ...value, body })}
          multiline
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-smoke">
          Mixtapes, episodes, songs and drops appear on the homepage and
          /announcements.
        </p>
        <UiButton
          type="button"
          tone="line"
          onClick={() =>
            setValue({
              ...value,
              items: [
                {
                  id: `ann-${Date.now()}`,
                  kind: "general",
                  title: { en: "New announcement", fr: "Nouvelle annonce" },
                  excerpt: { en: "", fr: "" },
                  body: { en: "", fr: "" },
                  image: "",
                  href: "/music",
                  published: true,
                  publishedAt: new Date().toISOString(),
                },
                ...value.items,
              ],
            })
          }
        >
          Add announcement
        </UiButton>
      </div>

      {value.items.map((item, index) => (
        <div key={item.id} className="space-y-4 border border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-2xl text-parchment">
              {item.title.en || `Announcement ${index + 1}`}
            </h3>
            <UiButton
              type="button"
              tone="ghost"
              onClick={() =>
                setValue({
                  ...value,
                  items: value.items.filter((_, i) => i !== index),
                })
              }
            >
              Remove
            </UiButton>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-smoke">
              Kind
              <select
                value={item.kind}
                onChange={(event) =>
                  updateItem(index, {
                    ...item,
                    kind: event.target.value as AnnouncementItem["kind"],
                  })
                }
                className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
              >
                {kinds.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-smoke">
              Link href
              <input
                value={item.href ?? ""}
                onChange={(event) =>
                  updateItem(index, {
                    ...item,
                    href: event.target.value || undefined,
                  })
                }
                className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
              />
            </label>
            <label className="flex items-center gap-3 text-sm text-smoke">
              <input
                type="checkbox"
                checked={item.published}
                onChange={(event) =>
                  updateItem(index, {
                    ...item,
                    published: event.target.checked,
                  })
                }
                className="accent-amber"
              />
              Published
            </label>
            <label className="flex items-center gap-3 text-sm text-smoke">
              <input
                type="checkbox"
                checked={Boolean(item.pinned)}
                onChange={(event) =>
                  updateItem(index, {
                    ...item,
                    pinned: event.target.checked,
                  })
                }
                className="accent-amber"
              />
              Pin to top
            </label>
          </div>

          <BilingualField
            label="Title"
            value={item.title}
            onChange={(title) => updateItem(index, { ...item, title })}
          />
          <BilingualField
            label="Excerpt"
            value={item.excerpt}
            onChange={(excerpt) => updateItem(index, { ...item, excerpt })}
            multiline
          />
          <BilingualField
            label="Body"
            value={item.body}
            onChange={(body) => updateItem(index, { ...item, body })}
            multiline
          />
          <MediaUploader
            label="Cover image"
            accept="image/*"
            multiple={false}
            values={item.image ? [item.image] : []}
            onChange={(urls) =>
              updateItem(index, { ...item, image: urls[0] || "" })
            }
          />
        </div>
      ))}

      <UiButton type="submit" tone="amber" loading={pending}>
        {pending ? "Saving…" : "Save announcements"}
      </UiButton>
    </form>
  );
}

function BilingualField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: LocalizedString;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
}) {
  const fieldClass =
    "mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber";
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="block text-sm text-smoke">
        {label} (EN)
        {multiline ? (
          <textarea
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            rows={3}
            className={fieldClass}
          />
        ) : (
          <input
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            className={fieldClass}
          />
        )}
      </label>
      <label className="block text-sm text-smoke">
        {label} (FR)
        {multiline ? (
          <textarea
            value={value.fr}
            onChange={(e) => onChange({ ...value, fr: e.target.value })}
            rows={3}
            className={fieldClass}
          />
        ) : (
          <input
            value={value.fr}
            onChange={(e) => onChange({ ...value, fr: e.target.value })}
            className={fieldClass}
          />
        )}
      </label>
    </div>
  );
}
