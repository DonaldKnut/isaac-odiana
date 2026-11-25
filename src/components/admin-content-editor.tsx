"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Disc3,
  Film,
  HelpCircle,
  LayoutGrid,
  Sparkles,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  saveHomepageAction,
  saveMusicPageAction,
  saveMusicWorksAction,
  saveSiteSettingsAction,
  type CmsActionState,
} from "@/app/actions/cms";
import { MediaUploader } from "@/components/media-uploader";
import { useToast } from "@/components/toast-provider";
import { UiButton } from "@/components/ui-button";
import type {
  HomepageBundle,
  HomeStudioFeedContent,
  LocalizedString,
  MusicPageContent,
  MusicPlatformLink,
  MusicTrackSample,
  MusicWorkContent,
  SiteSettings,
} from "@/lib/cms/types";

const initial: CmsActionState = { ok: false, message: "" };

type Tab = "homepage" | "music" | "settings";

export function AdminContentEditor({
  homepage,
  musicWorks,
  musicPage,
  settings,
}: {
  homepage: HomepageBundle;
  musicWorks: MusicWorkContent[];
  musicPage: MusicPageContent;
  settings: SiteSettings;
}) {
  const [tab, setTab] = useState<Tab>("homepage");
  const [home, setHome] = useState(homepage);
  const [works, setWorks] = useState(musicWorks);
  const [page, setPage] = useState(musicPage);
  const [site, setSite] = useState(settings);
  const toast = useToast();

  const [homeState, homeAction, homePending] = useActionState(
    saveHomepageAction,
    initial,
  );
  const [musicState, musicAction, musicPending] = useActionState(
    saveMusicWorksAction,
    initial,
  );
  const [musicPageState, musicPageAction, musicPagePending] = useActionState(
    saveMusicPageAction,
    initial,
  );
  const [settingsState, settingsAction, settingsPending] = useActionState(
    saveSiteSettingsAction,
    initial,
  );

  useEffect(() => {
    notify(homeState, toast);
  }, [homeState, toast]);
  useEffect(() => {
    notify(musicState, toast);
  }, [musicState, toast]);
  useEffect(() => {
    notify(musicPageState, toast);
  }, [musicPageState, toast]);
  useEffect(() => {
    notify(settingsState, toast);
  }, [settingsState, toast]);

  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-line pb-4">
        {(
          [
            ["homepage", "Homepage"],
            ["music", "Music works"],
            ["settings", "WhatsApp & brand"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`cursor-pointer px-4 py-2 text-[0.65rem] uppercase tracking-[0.18em] transition ${
              tab === id
                ? "bg-amber text-ink"
                : "border border-line text-smoke hover:text-parchment"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "homepage" ? (
        <form action={homeAction} className="space-y-10">
          <input type="hidden" name="payload" value={JSON.stringify(home)} />
          <HeroEditor value={home.hero} onChange={(hero) => setHome({ ...home, hero })} />
          <FeaturedEditor
            value={home.featured}
            onChange={(featured) => setHome({ ...home, featured })}
          />
          <AboutEditor
            value={home.about}
            onChange={(about) => setHome({ ...home, about })}
          />
          <WorldEditor
            value={home.world}
            onChange={(world) => setHome({ ...home, world })}
          />
          <StudioFeedEditor
            value={home.studioFeed}
            onChange={(studioFeed) => setHome({ ...home, studioFeed })}
          />
          <FaqEditor value={home.faq} onChange={(faq) => setHome({ ...home, faq })} />
          <UiButton type="submit" tone="amber" loading={homePending}>
            {homePending ? "Saving…" : "Save homepage"}
          </UiButton>
        </form>
      ) : null}

      {tab === "music" ? (
        <div className="space-y-10">
        <form action={musicPageAction} className="space-y-5 border border-line p-6">
          <input type="hidden" name="payload" value={JSON.stringify(page)} />
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center border border-amber/35 bg-amber/10 text-amber-bright">
              <Disc3 className="h-4 w-4" strokeWidth={1.6} />
            </span>
            <h2 className="font-display text-2xl text-parchment">
              Listening room slider
            </h2>
          </div>
          <BilingualField
            label="Eyebrow"
            value={page.listening.eyebrow}
            onChange={(eyebrow) =>
              setPage({
                ...page,
                listening: { ...page.listening, eyebrow },
              })
            }
          />
          <BilingualField
            label="Title"
            value={page.listening.title}
            onChange={(title) =>
              setPage({
                ...page,
                listening: { ...page.listening, title },
              })
            }
            multiline
          />
          <MediaUploader
            label="Slider images"
            accept="image/*"
            values={page.listening.images}
            onChange={(images) =>
              setPage({
                ...page,
                listening: { ...page.listening, images },
              })
            }
          />
          <UiButton type="submit" tone="amber" loading={musicPagePending}>
            {musicPagePending ? "Saving…" : "Save listening room"}
          </UiButton>
        </form>

        <form action={musicAction} className="space-y-8">
          <input type="hidden" name="payload" value={JSON.stringify(works)} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-smoke">
              Edit titles, bilingual copy, images and layout spans.
            </p>
            <UiButton
              type="button"
              tone="line"
              onClick={() =>
                setWorks([
                  ...works,
                  {
                    id: `work-${Date.now()}`,
                    title: "New work",
                    kind: { en: "Mixtape", fr: "Mixtape" },
                    image: "",
                    year: String(new Date().getFullYear()),
                    emphasis: { en: "", fr: "" },
                    description: { en: "", fr: "" },
                    highlights: [],
                    images: [],
                    sampleAudioUrl: "",
                    platformLinks: [
                      { label: "Spotify", url: "" },
                      { label: "Apple Music", url: "" },
                      { label: "YouTube", url: "" },
                    ],
                    tracks: [],
                  },
                ])
              }
            >
              Add work
            </UiButton>
          </div>
          {works.map((work, index) => (
            <div key={work.id} className="space-y-4 border border-line p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl text-parchment">
                  {work.title || `Work ${index + 1}`}
                </h3>
                <UiButton
                  type="button"
                  tone="ghost"
                  onClick={() => setWorks(works.filter((_, i) => i !== index))}
                >
                  Remove
                </UiButton>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="ID"
                  value={work.id}
                  onChange={(id) =>
                    setWorks(works.map((w, i) => (i === index ? { ...w, id } : w)))
                  }
                />
                <TextField
                  label="Title"
                  value={work.title}
                  onChange={(title) =>
                    setWorks(
                      works.map((w, i) => (i === index ? { ...w, title } : w)),
                    )
                  }
                />
                <TextField
                  label="Year"
                  value={work.year}
                  onChange={(year) =>
                    setWorks(
                      works.map((w, i) => (i === index ? { ...w, year } : w)),
                    )
                  }
                />
                <TextField
                  label="Grid span (Tailwind classes)"
                  value={work.span || ""}
                  onChange={(span) =>
                    setWorks(
                      works.map((w, i) =>
                        i === index ? { ...w, span: span || undefined } : w,
                      ),
                    )
                  }
                />
              </div>
              <BilingualField
                label="Kind"
                value={work.kind}
                onChange={(kind) =>
                  setWorks(
                    works.map((w, i) => (i === index ? { ...w, kind } : w)),
                  )
                }
              />
              <BilingualField
                label="Emphasis"
                value={work.emphasis}
                onChange={(emphasis) =>
                  setWorks(
                    works.map((w, i) => (i === index ? { ...w, emphasis } : w)),
                  )
                }
                multiline
              />
              <BilingualField
                label="Description"
                value={work.description}
                onChange={(description) =>
                  setWorks(
                    works.map((w, i) =>
                      i === index ? { ...w, description } : w,
                    ),
                  )
                }
                multiline
              />
              <HighlightsEditor
                value={work.highlights}
                onChange={(highlights) =>
                  setWorks(
                    works.map((w, i) =>
                      i === index ? { ...w, highlights } : w,
                    ),
                  )
                }
              />
              <MediaUploader
                label="Gallery images (slider in work modal — first is cover)"
                accept="image/*"
                multiple
                values={
                  work.images?.length
                    ? work.images
                    : work.image
                      ? [work.image]
                      : []
                }
                onChange={(urls) =>
                  setWorks(
                    works.map((w, i) =>
                      i === index
                        ? {
                            ...w,
                            images: urls,
                            image: urls[0] || "",
                          }
                        : w,
                    ),
                  )
                }
              />
              <MediaUploader
                label="Main sample / preview audio"
                accept="audio/*"
                multiple={false}
                values={work.sampleAudioUrl ? [work.sampleAudioUrl] : []}
                onChange={(urls) =>
                  setWorks(
                    works.map((w, i) =>
                      i === index
                        ? { ...w, sampleAudioUrl: urls[0] || "" }
                        : w,
                    ),
                  )
                }
              />
              <PlatformLinksEditor
                value={work.platformLinks || []}
                onChange={(platformLinks) =>
                  setWorks(
                    works.map((w, i) =>
                      i === index ? { ...w, platformLinks } : w,
                    ),
                  )
                }
              />
              <TracksEditor
                value={work.tracks || []}
                onChange={(tracks) =>
                  setWorks(
                    works.map((w, i) => (i === index ? { ...w, tracks } : w)),
                  )
                }
              />
            </div>
          ))}
          <UiButton type="submit" tone="amber" loading={musicPending}>
            {musicPending ? "Saving…" : "Save music works"}
          </UiButton>
        </form>
        </div>
      ) : null}

      {tab === "settings" ? (
        <form action={settingsAction} className="space-y-6 border border-line p-6">
          <input type="hidden" name="payload" value={JSON.stringify(site)} />
          <TextField
            label="WhatsApp number (digits, country code, no +)"
            value={site.whatsappNumber}
            onChange={(whatsappNumber) => setSite({ ...site, whatsappNumber })}
          />
          <BilingualField
            label="WhatsApp prefilled message"
            value={site.whatsappMessage}
            onChange={(whatsappMessage) => setSite({ ...site, whatsappMessage })}
            multiline
          />
          <BilingualField
            label="Brand tagline"
            value={site.brandTagline}
            onChange={(brandTagline) => setSite({ ...site, brandTagline })}
          />
          <UiButton type="submit" tone="amber" loading={settingsPending}>
            {settingsPending ? "Saving…" : "Save settings"}
          </UiButton>
        </form>
      ) : null}
    </div>
  );
}

function notify(
  state: CmsActionState,
  toast: { success: (t: string, m: string) => void; error: (t: string, m: string) => void },
) {
  if (!state.message) return;
  if (state.ok) toast.success("Saved", state.message);
  else toast.error("Error", state.message);
}

function HeroEditor({
  value,
  onChange,
}: {
  value: HomepageBundle["hero"];
  onChange: (value: HomepageBundle["hero"]) => void;
}) {
  return (
    <Section title="Hero" icon={Sparkles}>
      <BilingualField
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
      />
      <BilingualField
        label="Title line 1"
        value={value.titleLine1}
        onChange={(titleLine1) => onChange({ ...value, titleLine1 })}
      />
      <BilingualField
        label="Title line 2"
        value={value.titleLine2}
        onChange={(titleLine2) => onChange({ ...value, titleLine2 })}
      />
      <BilingualField
        label="Description"
        value={value.description}
        onChange={(description) => onChange({ ...value, description })}
        multiline
      />
      <div className="grid gap-4 md:grid-cols-2">
        <BilingualField
          label="Primary CTA"
          value={value.primaryCta}
          onChange={(primaryCta) => onChange({ ...value, primaryCta })}
        />
        <TextField
          label="Primary href"
          value={value.primaryHref}
          onChange={(primaryHref) => onChange({ ...value, primaryHref })}
        />
        <BilingualField
          label="Secondary CTA"
          value={value.secondaryCta}
          onChange={(secondaryCta) => onChange({ ...value, secondaryCta })}
        />
        <TextField
          label="Secondary href"
          value={value.secondaryHref}
          onChange={(secondaryHref) => onChange({ ...value, secondaryHref })}
        />
      </div>
    </Section>
  );
}

function FeaturedEditor({
  value,
  onChange,
}: {
  value: HomepageBundle["featured"];
  onChange: (value: HomepageBundle["featured"]) => void;
}) {
  return (
    <Section title="Featured strip" icon={Star}>
      <BilingualField
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
      />
      <BilingualField
        label="Title"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
      />
      {value.items.map((item, index) => (
        <div key={index} className="space-y-3 border border-line/70 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-amber">
            Item {index + 1}
          </p>
          <TextField
            label="Href"
            value={item.href}
            onChange={(href) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, href } : it,
                ),
              })
            }
          />
          <BilingualField
            label="Label"
            value={item.label}
            onChange={(label) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, label } : it,
                ),
              })
            }
          />
          <BilingualField
            label="Title"
            value={item.title}
            onChange={(title) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, title } : it,
                ),
              })
            }
          />
          <MediaUploader
            label="Image"
            accept="image/*"
            multiple={false}
            values={item.image ? [item.image] : []}
            onChange={(urls) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, image: urls[0] || "" } : it,
                ),
              })
            }
          />
        </div>
      ))}
    </Section>
  );
}

function AboutEditor({
  value,
  onChange,
}: {
  value: HomepageBundle["about"];
  onChange: (value: HomepageBundle["about"]) => void;
}) {
  return (
    <Section title="About" icon={UserRound}>
      <BilingualField
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
      />
      <BilingualField
        label="Title"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
        multiline
      />
      <BilingualField
        label="Body"
        value={value.body}
        onChange={(body) => onChange({ ...value, body })}
        multiline
      />
      <div className="grid gap-4 md:grid-cols-2">
        <BilingualField
          label="CTA"
          value={value.cta}
          onChange={(cta) => onChange({ ...value, cta })}
        />
        <TextField
          label="CTA href"
          value={value.ctaHref}
          onChange={(ctaHref) => onChange({ ...value, ctaHref })}
        />
      </div>
      <BilingualField
        label="Image caption"
        value={value.imageCaption}
        onChange={(imageCaption) => onChange({ ...value, imageCaption })}
      />
      <MediaUploader
        label="Side image"
        accept="image/*"
        multiple={false}
        values={value.image ? [value.image] : []}
        onChange={(urls) => onChange({ ...value, image: urls[0] || "" })}
      />
      {value.pillars.map((pillar, index) => (
        <div key={pillar.number} className="space-y-3 border border-line/70 p-4">
          <TextField
            label="Number"
            value={pillar.number}
            onChange={(number) =>
              onChange({
                ...value,
                pillars: value.pillars.map((p, i) =>
                  i === index ? { ...p, number } : p,
                ),
              })
            }
          />
          <BilingualField
            label="Title"
            value={pillar.title}
            onChange={(title) =>
              onChange({
                ...value,
                pillars: value.pillars.map((p, i) =>
                  i === index ? { ...p, title } : p,
                ),
              })
            }
          />
          <BilingualField
            label="Copy"
            value={pillar.copy}
            onChange={(copy) =>
              onChange({
                ...value,
                pillars: value.pillars.map((p, i) =>
                  i === index ? { ...p, copy } : p,
                ),
              })
            }
            multiline
          />
        </div>
      ))}
    </Section>
  );
}

function WorldEditor({
  value,
  onChange,
}: {
  value: HomepageBundle["world"];
  onChange: (value: HomepageBundle["world"]) => void;
}) {
  return (
    <Section title="World / rooms" icon={LayoutGrid}>
      <BilingualField
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
      />
      <BilingualField
        label="Title"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
        multiline
      />
      <BilingualField
        label="Body"
        value={value.body}
        onChange={(body) => onChange({ ...value, body })}
        multiline
      />
      <MediaUploader
        label="Side image"
        accept="image/*"
        multiple={false}
        values={value.sideImage ? [value.sideImage] : []}
        onChange={(urls) => onChange({ ...value, sideImage: urls[0] || "" })}
      />
      {value.rooms.map((room, index) => (
        <div key={index} className="space-y-3 border border-line/70 p-4">
          <TextField
            label="Href"
            value={room.href}
            onChange={(href) =>
              onChange({
                ...value,
                rooms: value.rooms.map((r, i) =>
                  i === index ? { ...r, href } : r,
                ),
              })
            }
          />
          <BilingualField
            label="Title"
            value={room.title}
            onChange={(title) =>
              onChange({
                ...value,
                rooms: value.rooms.map((r, i) =>
                  i === index ? { ...r, title } : r,
                ),
              })
            }
          />
          <BilingualField
            label="Copy"
            value={room.copy}
            onChange={(copy) =>
              onChange({
                ...value,
                rooms: value.rooms.map((r, i) =>
                  i === index ? { ...r, copy } : r,
                ),
              })
            }
            multiline
          />
          <MediaUploader
            label="Image"
            accept="image/*"
            multiple={false}
            values={room.image ? [room.image] : []}
            onChange={(urls) =>
              onChange({
                ...value,
                rooms: value.rooms.map((r, i) =>
                  i === index ? { ...r, image: urls[0] || "" } : r,
                ),
              })
            }
          />
        </div>
      ))}
    </Section>
  );
}

function StudioFeedEditor({
  value,
  onChange,
}: {
  value: HomeStudioFeedContent;
  onChange: (value: HomeStudioFeedContent) => void;
}) {
  return (
    <Section title="Studio feed (video / Instagram)" icon={Film}>
      <p className="text-sm text-smoke">
        Upload clips or stills for the homepage. Instagram items can link out to
        the post while hosting the media on Cloudinary.
      </p>
      <BilingualField
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
      />
      <BilingualField
        label="Title"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
        multiline
      />
      <BilingualField
        label="Body"
        value={value.body}
        onChange={(body) => onChange({ ...value, body })}
        multiline
      />
      <div className="flex justify-end">
        <UiButton
          type="button"
          tone="line"
          onClick={() =>
            onChange({
              ...value,
              items: [
                {
                  id: `reel-${Date.now()}`,
                  kind: "video",
                  title: { en: "New clip", fr: "Nouveau clip" },
                  mediaUrl: "",
                  posterUrl: "",
                  externalUrl: "",
                  published: true,
                },
                ...value.items,
              ],
            })
          }
        >
          Add clip
        </UiButton>
      </div>
      {value.items.map((item, index) => (
        <div key={item.id} className="space-y-3 border border-line/70 p-4">
          <div className="flex justify-between gap-3">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-amber">
              Clip {index + 1}
            </p>
            <UiButton
              type="button"
              tone="ghost"
              onClick={() =>
                onChange({
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
                  onChange({
                    ...value,
                    items: value.items.map((it, i) =>
                      i === index
                        ? {
                            ...it,
                            kind: event.target.value as "video" | "instagram",
                          }
                        : it,
                    ),
                  })
                }
                className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
              >
                <option value="video">Video snippet</option>
                <option value="instagram">Instagram / social</option>
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm text-smoke">
              <input
                type="checkbox"
                checked={item.published}
                onChange={(event) =>
                  onChange({
                    ...value,
                    items: value.items.map((it, i) =>
                      i === index
                        ? { ...it, published: event.target.checked }
                        : it,
                    ),
                  })
                }
                className="accent-amber"
              />
              Published on homepage
            </label>
          </div>
          <BilingualField
            label="Title"
            value={item.title}
            onChange={(title) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, title } : it,
                ),
              })
            }
          />
          <TextField
            label="Instagram / external URL (optional)"
            value={item.externalUrl || ""}
            onChange={(externalUrl) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, externalUrl } : it,
                ),
              })
            }
          />
          <MediaUploader
            label="Video or still"
            accept="video/*,image/*"
            multiple={false}
            values={item.mediaUrl ? [item.mediaUrl] : []}
            onChange={(urls) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, mediaUrl: urls[0] || "" } : it,
                ),
              })
            }
          />
          <MediaUploader
            label="Poster image (optional for video)"
            accept="image/*"
            multiple={false}
            values={item.posterUrl ? [item.posterUrl] : []}
            onChange={(urls) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, posterUrl: urls[0] || "" } : it,
                ),
              })
            }
          />
        </div>
      ))}
    </Section>
  );
}

function PlatformLinksEditor({
  value,
  onChange,
}: {
  value: MusicPlatformLink[];
  onChange: (value: MusicPlatformLink[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-smoke">
          Platform links (Spotify, Apple Music, YouTube…)
        </p>
        <UiButton
          type="button"
          tone="line"
          onClick={() => onChange([...value, { label: "", url: "" }])}
        >
          Add link
        </UiButton>
      </div>
      {value.map((link, index) => (
        <div key={index} className="grid gap-3 md:grid-cols-[0.4fr_1fr_auto]">
          <input
            value={link.label}
            placeholder="Spotify"
            onChange={(event) =>
              onChange(
                value.map((item, i) =>
                  i === index ? { ...item, label: event.target.value } : item,
                ),
              )
            }
            className="border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
          <input
            value={link.url}
            placeholder="https://"
            onChange={(event) =>
              onChange(
                value.map((item, i) =>
                  i === index ? { ...item, url: event.target.value } : item,
                ),
              )
            }
            className="border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
          <UiButton
            type="button"
            tone="ghost"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            ×
          </UiButton>
        </div>
      ))}
    </div>
  );
}

function TracksEditor({
  value,
  onChange,
}: {
  value: MusicTrackSample[];
  onChange: (value: MusicTrackSample[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-smoke">Track samples (optional)</p>
        <UiButton
          type="button"
          tone="line"
          onClick={() =>
            onChange([...value, { title: "Track", sampleAudioUrl: "" }])
          }
        >
          Add track
        </UiButton>
      </div>
      {value.map((track, index) => (
        <div key={index} className="space-y-3 border border-line/60 p-3">
          <div className="flex gap-3">
            <input
              value={track.title}
              onChange={(event) =>
                onChange(
                  value.map((item, i) =>
                    i === index ? { ...item, title: event.target.value } : item,
                  ),
                )
              }
              className="flex-1 border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
              placeholder="Track title"
            />
            <UiButton
              type="button"
              tone="ghost"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              ×
            </UiButton>
          </div>
          <MediaUploader
            label="Track sample audio"
            accept="audio/*"
            multiple={false}
            values={track.sampleAudioUrl ? [track.sampleAudioUrl] : []}
            onChange={(urls) =>
              onChange(
                value.map((item, i) =>
                  i === index
                    ? { ...item, sampleAudioUrl: urls[0] || "" }
                    : item,
                ),
              )
            }
          />
        </div>
      ))}
    </div>
  );
}

function FaqEditor({
  value,
  onChange,
}: {
  value: HomepageBundle["faq"];
  onChange: (value: HomepageBundle["faq"]) => void;
}) {
  return (
    <Section title="FAQ" icon={HelpCircle}>
      <BilingualField
        label="Eyebrow"
        value={value.eyebrow}
        onChange={(eyebrow) => onChange({ ...value, eyebrow })}
      />
      <BilingualField
        label="Title"
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
      />
      <BilingualField
        label="Body"
        value={value.body}
        onChange={(body) => onChange({ ...value, body })}
        multiline
      />
      <BilingualField
        label="Side caption"
        value={value.sideCaption}
        onChange={(sideCaption) => onChange({ ...value, sideCaption })}
      />
      <MediaUploader
        label="Side image"
        accept="image/*"
        multiple={false}
        values={value.sideImage ? [value.sideImage] : []}
        onChange={(urls) => onChange({ ...value, sideImage: urls[0] || "" })}
      />
      <div className="flex justify-end">
        <UiButton
          type="button"
          tone="line"
          onClick={() =>
            onChange({
              ...value,
              items: [
                ...value.items,
                {
                  question: { en: "", fr: "" },
                  answer: { en: "", fr: "" },
                },
              ],
            })
          }
        >
          Add FAQ
        </UiButton>
      </div>
      {value.items.map((item, index) => (
        <div key={index} className="space-y-3 border border-line/70 p-4">
          <div className="flex justify-between">
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-amber">
              FAQ {index + 1}
            </p>
            <UiButton
              type="button"
              tone="ghost"
              onClick={() =>
                onChange({
                  ...value,
                  items: value.items.filter((_, i) => i !== index),
                })
              }
            >
              Remove
            </UiButton>
          </div>
          <BilingualField
            label="Question"
            value={item.question}
            onChange={(question) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, question } : it,
                ),
              })
            }
          />
          <BilingualField
            label="Answer"
            value={item.answer}
            onChange={(answer) =>
              onChange({
                ...value,
                items: value.items.map((it, i) =>
                  i === index ? { ...it, answer } : it,
                ),
              })
            }
            multiline
          />
        </div>
      ))}
    </Section>
  );
}

function HighlightsEditor({
  value,
  onChange,
}: {
  value: LocalizedString[];
  onChange: (value: LocalizedString[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-smoke">Highlights</p>
        <UiButton
          type="button"
          tone="line"
          onClick={() => onChange([...value, { en: "", fr: "" }])}
        >
          Add highlight
        </UiButton>
      </div>
      {value.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex-1">
            <BilingualField
              label={`Highlight ${index + 1}`}
              value={item}
              onChange={(next) =>
                onChange(value.map((v, i) => (i === index ? next : v)))
              }
            />
          </div>
          <UiButton
            type="button"
            tone="ghost"
            className="mt-7"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            ×
          </UiButton>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  icon: Icon = Disc3,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border border-line p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center border border-amber/35 bg-amber/10 text-amber-bright">
          <Icon className="h-4 w-4" strokeWidth={1.6} />
        </span>
        <h2 className="font-display text-2xl text-parchment">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm text-smoke">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
      />
    </label>
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
