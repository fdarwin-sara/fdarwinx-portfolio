type ContactLink = { label: string; href: string };

export const site = {
  brand: "fdarwinx",
  name: "Darwin Sara",
  domain: "https://fdarwinx.me/",
  headline: "Always exploring.",
  description: "Building things, exploring ideas, and staying curious about what lies beyond.",
  about: "I’m Darwin Sara. I’m curious about software and space, and I make time for travel, reading, learning, and writing poems.",
  contactLinks: [] as readonly ContactLink[],
};

export const navigation = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;
