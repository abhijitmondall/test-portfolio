import { HeroSection } from "@/components/sections/hero-section";
import { AboutSnapshot } from "@/components/sections/about-snapshot";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { CTASection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSnapshot />
      <FeaturedProjects />
      <SkillsSection />
      <ExperienceSection />
      <CTASection />
    </>
  );
}
