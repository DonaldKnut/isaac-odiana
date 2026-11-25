export const brandLogo =
  "https://res.cloudinary.com/duhpqf0ax/image/upload/v1795557531/Isaac_Odiana_Luxury_Gold_Wordmark_i8tcn1.png";

export const brandMonogram =
  "https://res.cloudinary.com/duhpqf0ax/image/upload/v1795558047/Metallic_Gold_IO_Monogram_Logo_uj6bha.png";

/** Demo preview clips until Cloudinary samples are uploaded in admin. */
export const demoSamples = {
  midnight:
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  brass:
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  beats:
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
} as const;

export const studioMedia = {
  logo: brandLogo,
  monogram: brandMonogram,
  jazzStage:
    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1800&q=80",
  vinyl:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80",
  studio:
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
  headphones:
    "https://images.unsplash.com/photo-1483412033650-1015dcb7a1fb?auto=format&fit=crop&w=1600&q=80",
  writing:
    "https://images.unsplash.com/photo-1456513080867-f4b11be855b0?auto=format&fit=crop&w=1600&q=80",
  mentorship:
    "https://images.unsplash.com/photo-1516280440614-6697288d5f18?auto=format&fit=crop&w=1600&q=80",
  nightCity:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=80",
  mic:
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
  piano:
    "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1600&q=80",
  drums:
    "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=1600&q=80",
  portrait:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  gift:
    "https://images.unsplash.com/photo-1513201099705-ce9226a76f90?auto=format&fit=crop&w=1600&q=80",
};

export const sessionCovers: Record<string, string> = {
  "one-to-one-craft": studioMedia.studio,
  "jazz-vocals-lab": studioMedia.mic,
  "beats-arrangement": studioMedia.drums,
};

export type MusicWork = {
  id: string;
  title: string;
  kind: string;
  image: string;
  span?: string;
  year: string;
  emphasis: string;
  description: string;
  highlights: string[];
};

export const musicPortfolio: MusicWork[] = [
  {
    id: "midnight-standards",
    title: "Midnight Standards",
    kind: "Single",
    image: studioMedia.jazzStage,
    span: "lg:col-span-2 lg:row-span-2",
    year: "2025",
    emphasis: "A late-hour jazz single built on restraint and glow.",
    description:
      "Midnight Standards is a polished single release — intimate brass phrasing over a quiet pulse. It sits at the centre of Isaac’s current listening room: elegant, nocturnal, and precise.",
    highlights: [
      "Lead single from the night cycle",
      "Jazz-forward vocal / instrumental colour",
      "Ideal entry point for new listeners",
    ],
  },
  {
    id: "brass-after-dark",
    title: "Brass After Dark",
    kind: "Live set",
    image: studioMedia.nightCity,
    span: "",
    year: "2024",
    emphasis: "Stage heat, crowd breath, and brass that refuses to sit still.",
    description:
      "A captured live set where improvisation meets arrangement. Brass After Dark is about presence — the room, the risk, and the finish that only happens in front of people.",
    highlights: [
      "Documented live performance",
      "Extended improvisational passages",
      "High-energy closer material",
    ],
  },
  {
    id: "pocket-studies",
    title: "Pocket Studies",
    kind: "Beats",
    image: studioMedia.drums,
    span: "",
    year: "2025",
    emphasis: "Beat architecture — pocket first, ornament second.",
    description:
      "Pocket Studies is a beat-focused body of work: drums, space, and arrangement decisions that teach as much as they move. Built for producers, listeners, and session students alike.",
    highlights: [
      "Rhythm-led sketches and finished loops",
      "Arrangement lessons in feel",
      "Bridge between beats and jazz phrasing",
    ],
  },
  {
    id: "keys-and-smoke",
    title: "Keys & Smoke",
    kind: "Visual",
    image: studioMedia.piano,
    span: "lg:col-span-2",
    year: "2024",
    emphasis: "A visual essay on keys, haze, and quiet drama.",
    description:
      "Keys & Smoke is a photographic / visual chapter — piano silhouettes, low light, and the atmosphere around the instrument. It frames the music without saying a word.",
    highlights: [
      "Editorial stills and mood frames",
      "Piano as subject and symbol",
      "Pairs with late-night listening",
    ],
  },
  {
    id: "studio-reels",
    title: "Studio Reels",
    kind: "Process",
    image: studioMedia.studio,
    span: "",
    year: "2025",
    emphasis: "Behind the glass — process over polish.",
    description:
      "Studio Reels shows the craft mid-flight: takes, revisions, headphone checks, and the unglamorous hours that make the release feel inevitable.",
    highlights: [
      "Process documentation",
      "Session snapshots",
      "Useful for mentoring narratives",
    ],
  },
  {
    id: "ear-for-space",
    title: "Ear for Space",
    kind: "Gallery",
    image: studioMedia.headphones,
    span: "",
    year: "2023",
    emphasis: "Listening as design — space, silence, and attention.",
    description:
      "Ear for Space is a gallery of listening itself: headphones, rooms, and the discipline of leaving air in the mix. A quieter work with lasting instructional value.",
    highlights: [
      "Curated gallery series",
      "Focus on silence and dynamics",
      "Complements tutoring themes",
    ],
  },
];
