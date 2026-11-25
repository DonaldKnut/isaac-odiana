import { AnnouncementsArchive } from "@/components/announcements-archive";
import { PageHero } from "@/components/page-hero";
import {
  ensureCmsDefaults,
  getPublishedAnnouncements,
} from "@/lib/cms/content";

export const metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  await ensureCmsDefaults();
  const content = await getPublishedAnnouncements();

  return (
    <>
      <PageHero page="announcements" />
      <AnnouncementsArchive content={content} />
    </>
  );
}
