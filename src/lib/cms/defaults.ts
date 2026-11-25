import { demoSamples, studioMedia } from "@/lib/media";
import type {
  AnnouncementsBundle,
  HomepageBundle,
  MusicPageContent,
  MusicWorkContent,
  SiteSettings,
} from "@/lib/cms/types";

const L = (en: string, fr: string) => ({ en, fr });

export const defaultSiteSettings: SiteSettings = {
  whatsappNumber: "33758544042",
  whatsappMessage: L(
    "Hello Isaac, I’d like to talk about your work.",
    "Bonjour Isaac, j’aimerais échanger au sujet de votre travail.",
  ),
  brandTagline: L("Beats · Jazz · Studio", "Beats · Jazz · Studio"),
};

export const defaultMusicPage: MusicPageContent = {
  listening: {
    eyebrow: L("Listening room", "Salon d’écoute"),
    title: L(
      "Jazz phrasing, beat architecture, and the quiet between notes.",
      "Phrasé jazz, architecture de beats, et le silence entre les notes.",
    ),
    images: [
      studioMedia.piano,
      studioMedia.jazzStage,
      studioMedia.headphones,
      studioMedia.studio,
    ],
  },
};

export const defaultHomepage: HomepageBundle = {
  hero: {
    eyebrow: L("Official studio", "Studio officiel"),
    titleLine1: L("Isaac", "Isaac"),
    titleLine2: L("Odiana", "Odiana"),
    description: L(
      "Music, books, conversations and mentorship — a single destination for the work and the craft behind it.",
      "Musique, livres, conversations et mentorat — une seule destination pour l’œuvre et le métier.",
    ),
    primaryCta: L("Enter the bookstore", "Entrer dans la librairie"),
    primaryHref: "/books",
    secondaryCta: L("Listen now", "Écouter maintenant"),
    secondaryHref: "/podcast",
  },
  featured: {
    eyebrow: L("In rotation", "En rotation"),
    title: L(
      "What’s live in the studio right now.",
      "Ce qui vit dans le studio en ce moment.",
    ),
    items: [
      {
        href: "/shop",
        label: L("Limited drop", "Drop limité"),
        title: L("Studio merch", "Merch du studio"),
        image: studioMedia.gift,
      },
      {
        href: "/podcast",
        label: L("Now streaming", "En écoute"),
        title: L("Begin Again", "Begin Again"),
        image: studioMedia.mic,
      },
      {
        href: "/books",
        label: L("On the shelf", "En rayon"),
        title: L("Letters from the Studio", "Letters from the Studio"),
        image: studioMedia.writing,
      },
    ],
  },
  about: {
    eyebrow: L("What this is", "De quoi il s’agit"),
    title: L(
      "One destination for the work — and the people who want more of it.",
      "Une destination pour l’œuvre — et pour ceux qui en veulent davantage.",
    ),
    body: L(
      "Isaac Odiana’s digital studio gathers artist profile, bookstore, podcast library, merchandise and tutoring into a single premium experience.",
      "Le studio numérique d’Isaac Odiana réunit profil d’artiste, librairie, podcast, merchandising et tutorat dans une expérience premium.",
    ),
    cta: L("Start with a session", "Commencer par une session"),
    ctaHref: "/tutoring",
    image: studioMedia.portrait,
    imageCaption: L(
      "Craft that stays late with the lights low.",
      "Un craft qui veille tard, lumières baissées.",
    ),
    pillars: [
      {
        number: "01",
        title: L("A living studio", "Un studio vivant"),
        copy: L(
          "Not a brochure site — a working home for music, writing, voice and mentorship under one brand.",
          "Pas une brochure — une maison vivante pour la musique, l’écriture, la voix et le mentorat.",
        ),
      },
      {
        number: "02",
        title: L("Discover, then deepen", "Découvrir, puis approfondir"),
        copy: L(
          "Browse the work, stream the archive, then step into books, merch or a private tutoring session.",
          "Parcourez l’œuvre, écoutez l’archive, puis passez aux livres, au merch ou à une session privée.",
        ),
      },
      {
        number: "03",
        title: L("Built for presence", "Conçu pour la présence"),
        copy: L(
          "Fast pages, careful media and a calm checkout so the craft stays the loudest thing in the room.",
          "Pages rapides, médias soignés et paiement calme pour que le craft reste le plus fort dans la pièce.",
        ),
      },
    ],
  },
  world: {
    eyebrow: L("The world", "L’univers"),
    title: L(
      "One brand. Five living rooms of craft.",
      "Une marque. Cinq salons de craft.",
    ),
    body: L(
      "Explore the catalogue, stream the archive, shop limited pieces, and book private tutoring — a premium digital home, not a link tree.",
      "Explorez le catalogue, écoutez l’archive, achetez des pièces limitées et réservez un tutorat — une maison numérique premium, pas un linktree.",
    ),
    sideImage: studioMedia.headphones,
    rooms: [
      {
        href: "/music",
        title: L("Music & gallery", "Musique & galerie"),
        copy: L(
          "Releases, visuals and the creative trail.",
          "Sorties, visuels et parcours créatif.",
        ),
        image: studioMedia.jazzStage,
      },
      {
        href: "/books",
        title: L("Bookstore", "Librairie"),
        copy: L(
          "Physical editions and digital reads.",
          "Éditions physiques et lectures numériques.",
        ),
        image: studioMedia.writing,
      },
      {
        href: "/podcast",
        title: L("Podcast", "Podcast"),
        copy: L(
          "Episodes streamed with archival care.",
          "Épisodes diffusés avec soin d’archive.",
        ),
        image: studioMedia.mic,
      },
      {
        href: "/tutoring",
        title: L("Tutoring", "Tutorat"),
        copy: L(
          "Book a session. Pay. Meet online.",
          "Réservez. Payez. Rencontrez en ligne.",
        ),
        image: studioMedia.mentorship,
      },
    ],
  },
  studioFeed: {
    eyebrow: L("On set", "Sur le tournage"),
    title: L(
      "Snippets from the room.",
      "Extraits depuis la salle.",
    ),
    body: L(
      "Video cuts and Instagram moments — uploaded from the studio and shown here first.",
      "Coupes vidéo et moments Instagram — publiés depuis le studio et visibles ici d’abord.",
    ),
    items: [],
  },
  faq: {
    eyebrow: L("FAQ", "FAQ"),
    title: L(
      "Questions, answered with clarity.",
      "Des réponses claires.",
    ),
    body: L(
      "A short guide to how the studio works — shopping, listening and booking without the noise.",
      "Un guide court sur le fonctionnement du studio — achat, écoute et réservation, sans bruit.",
    ),
    sideImage: studioMedia.nightCity,
    sideCaption: L(
      "Answers before the encore.",
      "Les réponses avant le rappel.",
    ),
    items: [
      {
        question: L(
          "What can I do on this site?",
          "Que puis-je faire sur ce site ?",
        ),
        answer: L(
          "Explore Isaac’s music and gallery, buy books, stream podcast episodes, shop merchandise, and book paid tutoring sessions with online meeting links.",
          "Explorez la musique et la galerie d’Isaac, achetez des livres, écoutez le podcast, shoppez le merch et réservez des sessions de tutorat payantes avec lien de réunion.",
        ),
      },
      {
        question: L(
          "Are books physical, digital, or both?",
          "Les livres sont-ils physiques, numériques, ou les deux ?",
        ),
        answer: L(
          "Both formats are supported. Each title shows whether you are ordering a physical edition or unlocking a digital download after payment.",
          "Les deux formats sont pris en charge. Chaque titre indique s’il s’agit d’une édition physique ou d’un téléchargement numérique après paiement.",
        ),
      },
      {
        question: L(
          "How does tutoring booking work?",
          "Comment fonctionne la réservation de tutorat ?",
        ),
        answer: L(
          "Choose a session, pick an open time, complete Stripe checkout, then receive confirmation and a Zoom or Google Meet link for the appointment.",
          "Choisissez une session, un créneau, payez via Stripe, puis recevez la confirmation et un lien Zoom ou Google Meet.",
        ),
      },
      {
        question: L(
          "How are payments handled?",
          "Comment les paiements sont-ils gérés ?",
        ),
        answer: L(
          "Checkout runs through Stripe for eligible cards and local methods. Orders and bookings appear in the admin dashboard for fulfilment and follow-up.",
          "Le paiement passe par Stripe (cartes et moyens locaux éligibles). Commandes et réservations apparaissent dans l’admin pour le suivi.",
        ),
      },
    ],
  },
};

export const defaultMusicWorks: MusicWorkContent[] = [
  {
    id: "midnight-standards",
    title: "Midnight Standards",
    kind: L("Single", "Single"),
    image: studioMedia.jazzStage,
    images: [
      studioMedia.jazzStage,
      studioMedia.mic,
      studioMedia.nightCity,
      studioMedia.vinyl,
    ],
    span: "lg:col-span-2 lg:row-span-2",
    year: "2025",
    emphasis: L(
      "A late-hour jazz single built on restraint and glow.",
      "Un single jazz de nuit, entre retenue et lumière.",
    ),
    description: L(
      "Midnight Standards is a polished single release — intimate brass phrasing over a quiet pulse.",
      "Midnight Standards est un single soigné — phrasé de cuivres intime sur une pulsation douce.",
    ),
    highlights: [
      L("Lead single from the night cycle", "Single phare du cycle nocturne"),
      L("Jazz-forward colour", "Couleur jazz affirmée"),
      L("Ideal entry point for new listeners", "Parfait point d’entrée"),
    ],
    sampleAudioUrl: demoSamples.midnight,
    platformLinks: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/search/Midnight%20Standards%20Isaac%20Odiana",
      },
      {
        label: "Apple Music",
        url: "https://music.apple.com/search?term=Midnight%20Standards%20Isaac%20Odiana",
      },
      {
        label: "YouTube",
        url: "https://www.youtube.com/results?search_query=Midnight+Standards+Isaac+Odiana",
      },
    ],
    tracks: [
      {
        title: "Midnight Standards",
        sampleAudioUrl: demoSamples.midnight,
      },
      {
        title: "Afterglow Cut",
        sampleAudioUrl: demoSamples.brass,
      },
    ],
  },
  {
    id: "brass-after-dark",
    title: "Brass After Dark",
    kind: L("Live set", "Set live"),
    image: studioMedia.nightCity,
    year: "2024",
    emphasis: L(
      "Stage heat, crowd breath, and brass that refuses to sit still.",
      "Chaleur de scène, souffle du public, cuivres en mouvement.",
    ),
    description: L(
      "A captured live set where improvisation meets arrangement.",
      "Un set live capturé, entre improvisation et arrangement.",
    ),
    highlights: [
      L("Documented live performance", "Performance live documentée"),
      L("Extended improvisational passages", "Passages improvisés étendus"),
      L("High-energy closer material", "Matériau de clôture intense"),
    ],
    sampleAudioUrl: demoSamples.brass,
    platformLinks: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/search/Brass%20After%20Dark%20Isaac%20Odiana",
      },
      {
        label: "YouTube",
        url: "https://www.youtube.com/results?search_query=Brass+After+Dark+Isaac+Odiana",
      },
    ],
    tracks: [
      {
        title: "Brass After Dark — live cut",
        sampleAudioUrl: demoSamples.brass,
      },
    ],
  },
  {
    id: "pocket-studies",
    title: "Pocket Studies",
    kind: L("Beats", "Beats"),
    image: studioMedia.drums,
    year: "2025",
    emphasis: L(
      "Beat architecture — pocket first, ornament second.",
      "Architecture de beat — le pocket d’abord.",
    ),
    description: L(
      "Pocket Studies is a beat-focused body of work: drums, space, and arrangement decisions.",
      "Pocket Studies est un corpus centré sur le beat : batterie, espace et choix d’arrangement.",
    ),
    highlights: [
      L("Rhythm-led sketches", "Esquisses rythmiques"),
      L("Arrangement lessons in feel", "Leçons d’arrangement et de feel"),
      L("Bridge between beats and jazz", "Pont entre beats et jazz"),
    ],
    sampleAudioUrl: demoSamples.beats,
    platformLinks: [
      {
        label: "Spotify",
        url: "https://open.spotify.com/search/Pocket%20Studies%20Isaac%20Odiana",
      },
      {
        label: "YouTube",
        url: "https://www.youtube.com/results?search_query=Pocket+Studies+Isaac+Odiana",
      },
    ],
    tracks: [
      {
        title: "Pocket Studies — sketch A",
        sampleAudioUrl: demoSamples.beats,
      },
    ],
  },
  {
    id: "keys-and-smoke",
    title: "Keys & Smoke",
    kind: L("Visual", "Visuel"),
    image: studioMedia.piano,
    span: "lg:col-span-2",
    year: "2024",
    emphasis: L(
      "A visual essay on keys, haze, and quiet drama.",
      "Un essai visuel sur les touches, la brume et le drama calme.",
    ),
    description: L(
      "Keys & Smoke is a photographic / visual chapter — piano silhouettes and low light.",
      "Keys & Smoke est un chapitre photographique — silhouettes de piano et lumière basse.",
    ),
    highlights: [
      L("Editorial stills", "Images éditoriales"),
      L("Piano as subject and symbol", "Le piano comme sujet et symbole"),
      L("Pairs with late-night listening", "À assortir à l’écoute nocturne"),
    ],
  },
  {
    id: "studio-reels",
    title: "Studio Reels",
    kind: L("Process", "Processus"),
    image: studioMedia.studio,
    year: "2025",
    emphasis: L(
      "Behind the glass — process over polish.",
      "Derrière la vitre — le processus avant le vernis.",
    ),
    description: L(
      "Studio Reels shows the craft mid-flight: takes, revisions, headphone checks.",
      "Studio Reels montre le craft en cours : prises, révisions, checks casque.",
    ),
    highlights: [
      L("Process documentation", "Documentation du processus"),
      L("Session snapshots", "Instantanés de session"),
      L("Useful for mentoring narratives", "Utile pour le mentorat"),
    ],
  },
  {
    id: "ear-for-space",
    title: "Ear for Space",
    kind: L("Gallery", "Galerie"),
    image: studioMedia.headphones,
    year: "2023",
    emphasis: L(
      "Listening as design — space, silence, and attention.",
      "Écouter comme on conçoit — espace, silence, attention.",
    ),
    description: L(
      "Ear for Space is a gallery of listening itself: headphones, rooms, and air in the mix.",
      "Ear for Space est une galerie de l’écoute : casques, pièces, et air dans le mix.",
    ),
    highlights: [
      L("Curated gallery series", "Série de galerie curatée"),
      L("Focus on silence and dynamics", "Focus silence et dynamique"),
      L("Complements tutoring themes", "Complète les thèmes de tutorat"),
    ],
  },
];

export const defaultAnnouncements: AnnouncementsBundle = {
  eyebrow: L("Studio board", "Tableau du studio"),
  title: L("Announcements", "Annonces"),
  body: L(
    "Upcoming episodes, song drops, mixtapes and new releases from the studio.",
    "Épisodes à venir, sorties, mixtapes et nouveautés du studio.",
  ),
  items: [
    {
      id: "ann-midnight-standards",
      kind: "mixtape",
      title: L("Midnight Standards mixtape", "Mixtape Midnight Standards"),
      excerpt: L(
        "A late-night selection of jazz phrasing and beat architecture.",
        "Une sélection nocturne de phrasé jazz et d’architecture de beats.",
      ),
      body: L(
        "The Midnight Standards mixtape is live — stream it from the music room and catch the visuals in the gallery.",
        "La mixtape Midnight Standards est en ligne — écoutez-la dans le salon musique et retrouvez les visuels en galerie.",
      ),
      image: studioMedia.vinyl,
      href: "/music",
      published: true,
      pinned: true,
      publishedAt: new Date().toISOString(),
    },
    {
      id: "ann-podcast-drop",
      kind: "episode",
      title: L("New podcast episode soon", "Nouvel épisode podcast bientôt"),
      excerpt: L(
        "Archive notes on process, restarting, and keeping a practice alive.",
        "Notes d’archive sur le processus, les redémarrages et la pratique.",
      ),
      body: L(
        "A new conversation lands in the podcast archive shortly. Follow the studio board for the exact drop time.",
        "Une nouvelle conversation arrive bientôt dans l’archive podcast. Suivez le tableau du studio pour l’horaire exact.",
      ),
      image: studioMedia.mic,
      href: "/podcast",
      published: true,
      publishedAt: new Date().toISOString(),
    },
    {
      id: "ann-letters-drop",
      kind: "drop",
      title: L("Letters from the Studio — restock", "Letters from the Studio — réassort"),
      excerpt: L(
        "Physical editions are back on the shelf.",
        "Les éditions physiques sont de retour.",
      ),
      body: L(
        "A limited restock of Letters from the Studio is available in the bookstore while stock lasts.",
        "Un réassort limité de Letters from the Studio est disponible en librairie tant que le stock dure.",
      ),
      image: studioMedia.writing,
      href: "/books",
      published: true,
      publishedAt: new Date().toISOString(),
    },
  ],
};
