import { PageHero } from "@/components/page-hero";
import { TutoringStudio } from "@/components/tutoring-studio";
import { studioMedia } from "@/lib/media";
import {
  getPublishedSessionsWithSlots,
  toSessionCards,
} from "@/lib/tutoring";

export const metadata = { title: "Tutoring" };

type PageProps = {
  searchParams: Promise<{ booked?: string; cancelled?: string }>;
};

export default async function TutoringPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessions = toSessionCards(await getPublishedSessionsWithSlots());

  return (
    <>
      <PageHero page="tutoring" image={studioMedia.mentorship} />
      <TutoringStudio
        sessions={sessions}
        bookedId={params.booked}
        cancelled={params.cancelled === "1"}
      />
    </>
  );
}
