import { site } from "@/content/site";
import { Gravity } from "./gravity";
import { ScrollCue } from "./scroll-cue";

export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden="true" />{site.name}</p>
          <h1 id="hero-title">{site.headline}</h1>
          <p className="hero-description">{site.description}</p>
          <a href="#work" className="work-link">Explore work</a>
        </div>
        <Gravity />
      </div>
      <div className="hero-footer">
        <ScrollCue />
        <span className="figure-label">Gravity <span aria-hidden="true">/</span> Orbital study</span>
      </div>
    </section>
  );
}
