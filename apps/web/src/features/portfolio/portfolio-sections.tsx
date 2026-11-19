import { site } from "@/content/site";
import { WorkSection } from "./work-section";

export function PortfolioSections() {
  return (
    <div className="shell portfolio">
      <WorkSection />
      <section id="about" className="portfolio-row" aria-labelledby="about-title">
        <h2 id="about-title">About</h2>
        <p>{site.about}</p>
      </section>
      <section id="contact" className="portfolio-row" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact</h2>
        {site.contactLinks.length ? (
          <ul>{site.contactLinks.map(({ label, href }) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        ) : <p>Contact links will be added here.</p>}
      </section>
    </div>
  );
}
