import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: `${site.name} — FDARWINX`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — FDARWINX`,
    description: site.description,
    url: "/",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <footer className="shell site-footer"><span>{site.brand}</span><a href="#home">Back to top</a></footer>
      </body>
    </html>
  );
}
