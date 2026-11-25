import { Megaphone } from "lucide-react";
import { AdminAnnouncementsEditor } from "@/components/admin-announcements-editor";
import { AdminPageHeading } from "@/components/admin-page-heading";
import {
  ensureCmsDefaults,
  getAnnouncementsContent,
} from "@/lib/cms/content";

export default async function AdminAnnouncementsPage() {
  await ensureCmsDefaults();
  const announcements = await getAnnouncementsContent();

  return (
    <div>
      <AdminPageHeading
        icon={Megaphone}
        title="Announcements"
        description="Publish mixtapes, episode teases, song drops and restocks. They appear on the homepage strip and /announcements."
      />
      <AdminAnnouncementsEditor initialValue={announcements} />
    </div>
  );
}
