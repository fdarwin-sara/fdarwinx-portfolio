import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { Hero } from "@/features/hero/hero";
import { PortfolioSections } from "@/features/portfolio/portfolio-sections";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <PortfolioSections />
      </main>
      <footer className="shell site-footer"><span>{site.brand}</span><a href="#home">Back to top</a></footer>
    </>
  );
}
