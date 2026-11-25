import { HomeAbout } from "@/components/home-about";
import { HomeAnnouncements } from "@/components/home-announcements";
import { HomeFaq } from "@/components/home-faq";
import { HomeFeaturedStrip } from "@/components/home-featured-strip";
import { HomeHero } from "@/components/home-hero";
import { HomeStudioFeed } from "@/components/home-studio-feed";
import { HomeWorld } from "@/components/home-world";
import {
  ensureCmsDefaults,
  getHomepageContent,
  getPublishedAnnouncements,
} from "@/lib/cms/content";

export default async function HomePage() {
  await ensureCmsDefaults();
  const [homepage, announcements] = await Promise.all([
    getHomepageContent(),
    getPublishedAnnouncements(),
  ]);

  return (
    <>
      <HomeHero content={homepage.hero} />
      <HomeAnnouncements content={announcements} />
      <HomeStudioFeed content={homepage.studioFeed} />
      <HomeFeaturedStrip content={homepage.featured} />
      <HomeAbout content={homepage.about} />
      <HomeWorld content={homepage.world} />
      <HomeFaq content={homepage.faq} />
    </>
  );
}
