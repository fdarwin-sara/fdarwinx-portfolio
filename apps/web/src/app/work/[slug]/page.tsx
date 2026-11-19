import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

async function getProject(params: Props["params"]) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) notFound();
  return project;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params);
  const title = `${project.name} — FDARWINX`;
  const url = `/work/${project.slug}`;
  return {
    title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: { title, description: project.description, url, type: "website" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params);

  return (
    <main id="main-content" className="shell project-page" tabIndex={-1}>
      <article>
        <header className="project-intro">
          <Link className="project-return" href="/#work" prefetch={false}>Back to work</Link>
          <p className="project-status">{project.status}</p>
          <h1>{project.name}</h1>
          <p className="project-lede">{project.description}</p>
          <ul className="project-technologies" aria-label="Technologies">
            {project.stack.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
          {(project.repository || project.demo) && (
            <ul className="project-links">
              {project.repository && <li><a href={project.repository}>GitHub repository</a></li>}
              {project.demo && <li><a href={project.demo}>Live demo</a></li>}
            </ul>
          )}
        </header>
        <section className="project-detail" aria-labelledby="features-title">
          <h2 id="features-title">Features</h2>
          <ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        </section>
        <section className="project-detail" aria-labelledby="architecture-title">
          <h2 id="architecture-title">Architecture</h2>
          <p>{project.architecture}</p>
        </section>
        <section className="project-detail" aria-labelledby="development-title">
          <h2 id="development-title">Development status</h2>
          <p>{project.development}</p>
        </section>
      </article>
    </main>
  );
}
