import {
  MusicPageChrome,
} from "@/components/music-page-chrome";
import { MusicListeningRoom } from "@/components/music-listening-room";
import { MusicPortfolio } from "@/components/music-portfolio";
import { PageHero } from "@/components/page-hero";
import {
  ensureCmsDefaults,
  getMusicPageContent,
  getMusicWorksContent,
} from "@/lib/cms/content";
import { studioMedia } from "@/lib/media";

export const metadata = { title: "Music" };

export default async function MusicPage() {
  await ensureCmsDefaults();
  const [works, musicPage] = await Promise.all([
    getMusicWorksContent(),
    getMusicPageContent(),
  ]);

  return (
    <>
      <PageHero page="music" image={studioMedia.jazzStage} />

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <MusicPageChrome />
        <MusicPortfolio works={works} />
      </section>

      <MusicListeningRoom content={musicPage.listening} />
    </>
  );
}
