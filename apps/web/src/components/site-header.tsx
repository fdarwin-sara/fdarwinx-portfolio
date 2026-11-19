import Link from "next/link";
import { navigation, site } from "@/content/site";

export function SiteHeader() {
  return (
    <header id="home" className="site-header shell">
      <Link className="wordmark" href="/#home" aria-label="fdarwinx home" prefetch={false}>
        <svg viewBox="0 0 32 32" width="27" height="27" fill="none" aria-hidden="true">
          <ellipse cx="16" cy="16" rx="14" ry="7" transform="rotate(-35 16 16)" stroke="currentColor" />
          <circle cx="16" cy="16" r="4" fill="currentColor" />
          <circle cx="27" cy="12" r="1.6" fill="currentColor" />
        </svg>
        {site.brand}
      </Link>
      <nav aria-label="Primary">
        <ul className="nav-links">
          {navigation.map(({ id, label }) => <li key={id}><Link href={`/#${id}`} prefetch={false}>{label}</Link></li>)}
        </ul>
      </nav>
    </header>
  );
}
