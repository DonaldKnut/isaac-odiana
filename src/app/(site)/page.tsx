import { HomeAbout } from "@/components/home-about";
import { HomeFaq } from "@/components/home-faq";
import { HomeFeaturedStrip } from "@/components/home-featured-strip";
import { HomeHero } from "@/components/home-hero";
import { HomeWorld } from "@/components/home-world";
import { ensureCmsDefaults, getHomepageContent } from "@/lib/cms/content";

export default async function HomePage() {
  await ensureCmsDefaults();
  const homepage = await getHomepageContent();

  return (
    <>
      <HomeHero content={homepage.hero} />
      <HomeFeaturedStrip content={homepage.featured} />
      <HomeAbout content={homepage.about} />
      <HomeWorld content={homepage.world} />
      <HomeFaq content={homepage.faq} />
    </>
  );
}
