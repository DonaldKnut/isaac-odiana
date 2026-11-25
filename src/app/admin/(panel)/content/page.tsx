import { PenLine } from "lucide-react";
import { AdminContentEditor } from "@/components/admin-content-editor";
import { AdminPageHeading } from "@/components/admin-page-heading";
import {
  ensureCmsDefaults,
  getHomepageContent,
  getMusicPageContent,
  getMusicWorksContent,
  getSiteSettings,
} from "@/lib/cms/content";

export default async function AdminContentPage() {
  await ensureCmsDefaults();
  const [homepage, musicWorks, musicPage, settings] = await Promise.all([
    getHomepageContent(),
    getMusicWorksContent(),
    getMusicPageContent(),
    getSiteSettings(),
  ]);

  return (
    <div>
      <AdminPageHeading
        icon={PenLine}
        title="Content"
        description="Edit homepage sections, music works / listening room, and WhatsApp settings in English and French."
      />
      <AdminContentEditor
        homepage={homepage}
        musicWorks={musicWorks}
        musicPage={musicPage}
        settings={settings}
      />
    </div>
  );
}
