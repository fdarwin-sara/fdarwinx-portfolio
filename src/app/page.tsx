import { Hero } from "@/features/hero/hero";
import { PortfolioSections } from "@/features/portfolio/portfolio-sections";

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <PortfolioSections />
    </main>
  );
}
