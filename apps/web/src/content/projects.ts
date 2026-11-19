type Project = {
  slug: string;
  name: string;
  description: string;
  status: string;
  stack: readonly string[];
  features: readonly string[];
  architecture: string;
  development: string;
  repository?: `https://github.com/${string}`;
  demo?: `https://${string}`;
};

export const projects: readonly Project[] = [
  {
    slug: "austral-group",
    name: "Austral Group",
    description: "An independent site prototype with a seafood catalog and an illustrative vessel refrigeration study.",
    status: "Functional prototype",
    stack: ["Angular", "TypeScript", "Java 25", "Spring Boot", "PostgreSQL", "Flyway"],
    features: [
      "Filter the seafood catalog and open product datasheets. A bundled catalog loads first while the site checks for updates.",
      "Read an illustrative refrigerated seawater (RSW) modernization study and print its datasheets.",
      "Send a contact request through a form backed by a validated REST endpoint.",
    ],
    architecture: "Angular routes load standalone pages. Frontend services handle catalog and contact requests. The Spring Boot API separates controllers, services, and data access, with PostgreSQL migrations managed by Flyway.",
    development: "The catalog, study, and contact flow are implemented in the source. The prototype is independent of Austral Group’s official site. The refrigeration study describes an illustrative scenario.",
  },
  {
    slug: "gastosmart",
    name: "GastoSmart",
    description: "A personal finance app in development, starting with account access and a protected dashboard.",
    status: "Authentication foundation",
    stack: ["Angular", "TypeScript", "NestJS", "Supabase Auth", "PostgreSQL", "Prisma"],
    features: [
      "Register, sign in and out, recover a password, and see guidance for email confirmation.",
      "Keep a session across page reloads and restrict access to the dashboard to signed-in users.",
      "Verify Supabase access tokens in the API and expose the signed-in identity through a protected endpoint.",
    ],
    architecture: "An Angular frontend handles authentication and routing. A modular NestJS REST API verifies Supabase-issued tokens. The repository includes a PostgreSQL profile migration with row-level security and a Prisma schema that models the profile.",
    development: "The account flows, protected dashboard, and API authentication are implemented. Expense tracking and financial reporting are outside the current implementation.",
    repository: "https://github.com/fdarwin-sara/gastosmart",
  },
  {
    slug: "rincon-de-coco",
    name: "El Rincón de Coco",
    description: "A daily menu platform with a public menu and tools for managing dishes, prices, and availability.",
    status: "Menu workflow implemented",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "Prisma", "PostgreSQL"],
    features: [
      "View the published menu for the current day in Lima, including dishes, meal offers, and availability.",
      "Manage dishes, draft daily menus, set stock and prices, then publish or close a menu.",
      "Sign in to the admin area and revoke the current session or all sessions on the account.",
    ],
    architecture: "An npm workspace separates the Next.js web app, a NestJS API, and a shared Prisma package. PostgreSQL stores menus and sessions. Its schema also models orders, payments, and inventory reservations.",
    development: "The public menu and admin workflow are implemented. Checkout and payment review are modeled in the database and documented for later service work.",
  },
];
