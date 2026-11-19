import Link from "next/link";
import { projects } from "@/content/projects";

export function WorkSection() {
  return (
    <section id="work" className="portfolio-row work-section" aria-labelledby="work-title">
      <h2 id="work-title">Work</h2>
      <ul className="project-index">
        {projects.map((project) => (
          <li key={project.slug}>
            <p className="project-status">{project.status}</p>
            <h3><Link href={`/work/${project.slug}`} prefetch={false}>{project.name}</Link></h3>
            <p>{project.description}</p>
            <p className="project-stack">{project.stack.join(" · ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
