import { site } from "@/content/site";

export function PortfolioSections() {
  return (
    <div className="shell portfolio">
      <section id="work" className="portfolio-row" aria-labelledby="work-title">
        <h2 id="work-title">Work</h2>
        <p>Projects and case studies will be published here.</p>
      </section>
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
