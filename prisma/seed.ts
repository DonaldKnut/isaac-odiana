import { PrismaClient, ProductType } from "@prisma/client";
import { addDays, atHour } from "../src/lib/date";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      slug: "letters-from-the-studio",
      title: "Letters from the Studio",
      description:
        "A collection of essays on craft, discipline and the quiet work behind public art.",
      type: ProductType.BOOK_PHYSICAL,
      priceCents: 2400,
      coverUrl:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",
      ],
      stock: 40,
      published: true,
    },
    {
      slug: "night-rehearsals",
      title: "Night Rehearsals",
      description:
        "Digital edition — intimate notes from late sessions, written for working creatives.",
      type: ProductType.BOOK_DIGITAL,
      priceCents: 1200,
      coverUrl:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1456513080867-f4b11be855b0?auto=format&fit=crop&w=1200&q=80",
      ],
      digitalUrl: "https://example.com/downloads/night-rehearsals.pdf",
      published: true,
    },
    {
      slug: "studio-tote",
      title: "Studio Tote",
      description: "Heavyweight canvas tote with embossed mark. Limited run.",
      type: ProductType.MERCH,
      priceCents: 3200,
      coverUrl:
        "https://images.unsplash.com/photo-1590874103328-eac38a67478a?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a67478a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
      ],
      stock: 25,
      variants: { sizes: ["One size"] },
      published: true,
    },
    {
      slug: "amber-cap",
      title: "Amber Cap",
      description: "Structured cap in ink black with amber stitch detail.",
      type: ProductType.MERCH,
      priceCents: 2800,
      coverUrl:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80",
      ],
      stock: 18,
      variants: { sizes: ["S/M", "L/XL"] },
      published: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  const sessions = [
    {
      slug: "one-to-one-craft",
      title: "One-to-one craft session",
      titleFr: "Session craft en individuel",
      description:
        "A focused 60-minute session on music production, writing craft or creative process.",
      descriptionFr:
        "Une session concentrée de 60 minutes sur la production musicale, l’écriture ou le processus créatif.",
      priceCents: 7500,
      durationMin: 60,
      meetingType: "ZOOM",
    },
    {
      slug: "jazz-vocals-lab",
      title: "Jazz vocals lab",
      titleFr: "Labo de voix jazz",
      description:
        "Phrase, feel and improvisation — a private jazz-focused coaching hour.",
      descriptionFr:
        "Phrasé, feel et improvisation — une heure de coaching jazz en privé.",
      priceCents: 9000,
      durationMin: 60,
      meetingType: "ZOOM",
    },
    {
      slug: "beats-arrangement",
      title: "Beats & arrangement",
      titleFr: "Beats & arrangement",
      description:
        "Structure, pocket and arrangement decisions for beat-driven tracks.",
      descriptionFr:
        "Structure, pocket et choix d’arrangement pour des tracks rythmiques.",
      priceCents: 8500,
      durationMin: 60,
      meetingType: "GOOGLE_MEET",
    },
  ];

  for (const session of sessions) {
    await prisma.tutoringSession.upsert({
      where: { slug: session.slug },
      update: {
        title: session.title,
        titleFr: session.titleFr,
        description: session.description,
        descriptionFr: session.descriptionFr,
        priceCents: session.priceCents,
        durationMin: session.durationMin,
        meetingType: session.meetingType,
        published: true,
      },
      create: { ...session, published: true },
    });
  }

  const dbSessions = await prisma.tutoringSession.findMany();
  const today = new Date();

  for (const session of dbSessions) {
    await prisma.availabilitySlot.deleteMany({
      where: { sessionId: session.id, isBooked: false },
    });

    const slotStarts = [
      atHour(addDays(today, 1), 10),
      atHour(addDays(today, 1), 15),
      atHour(addDays(today, 2), 11),
      atHour(addDays(today, 3), 17),
      atHour(addDays(today, 5), 14),
      atHour(addDays(today, 7), 16),
    ];

    for (const startsAt of slotStarts) {
      const endsAt = new Date(startsAt);
      endsAt.setMinutes(endsAt.getMinutes() + session.durationMin);

      await prisma.availabilitySlot.create({
        data: {
          sessionId: session.id,
          startsAt,
          endsAt,
          isBooked: false,
        },
      });
    }
  }

  await prisma.podcastEpisode.upsert({
    where: { slug: "episode-01-begin-again" },
    update: {
      titleFr: "Recommencer",
      descriptionFr:
        "Sur le redémarrage du travail créatif quand l’élan se casse.",
      categoryFr: "Processus",
    },
    create: {
      slug: "episode-01-begin-again",
      title: "Begin Again",
      titleFr: "Recommencer",
      description: "On restarting creative work when momentum breaks.",
      descriptionFr:
        "Sur le redémarrage du travail créatif quand l’élan se casse.",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverUrl:
        "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80",
      durationSec: 1840,
      category: "Process",
      categoryFr: "Processus",
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log("Seed complete with multi-image products + tutoring slots.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
