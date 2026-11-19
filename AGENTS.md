# FDARWINX project instructions

- Make changes only inside `fdarwinx-portfolio`. Inspect other repositories only when explicitly authorized and use read-only access. Exclude real environment files, credentials, databases, and private client information.
- FDARWINX is Darwin Sara’s personal site at `https://fdarwinx.me/`. Use English and publish only supplied or confirmed facts, links, authorship, and contributions.
- Follow Monochrome Cosmos. Use black, white, and gray, editorial typography, generous spacing, and restrained astronomical details. Projects may retain their own colors.
- Keep primary navigation to Home, Work, About, and Contact. Preserve “Just me.”, “I like the stars.”, and Monochrome Cosmos.
- Use Node.js 24 LTS, npm, Next.js App Router, React, strict TypeScript, Tailwind CSS, Motion, Lucide, and ESLint. Verify stable versions and compatibility before changing dependencies.
- Use npm Workspaces with one root lockfile. Keep the existing Next.js app in `apps/web` and NestJS in `apps/api`. Add `packages/shared` when both apps have a real shared contract.
- Use Server Components by default and scope client code to interaction and animation. Keep web routes and metadata in `apps/web/src/app`, reusable UI in `src/components`, features in `src/features`, typed content in `src/content`, and assets in the web workspace's `public`.
- Health is the only API feature in Phase 4.1. GitHub Activity, NASA APOD, Poems, Contact, and Advanced Gravity are approved for subsequent phases. Follow the design notes in README.md and wait for authorization to implement each phase.
- Keep API credentials and third-party calls server-side. Validate configuration at startup, use exact CORS origins, and keep private values and user content out of logs. Leave proxy trust disabled until a specific deployment requires it.
- Keep Work facts in `apps/web/src/content/projects.ts`. Verify features and development status against source, confirm public access to repositories and demos, and avoid claims about roles, metrics, or clients without evidence.
- Keep Gravity decorative and independent of reading and navigation. Provide a static fallback, honor reduced motion, pause in hidden tabs, and clean up animation and input handling.
- Verify lint, typecheck, both production builds, backend tests, and local preview before handoff. Keep browser assertions in `tests/e2e` and generated artifacts in the ignored `test-results/` directory.
- Keep ESLint 9 until the React, import, and JSX accessibility plugins used by the Next.js config support the migration.

## Git ownership

Darwin performs commits and pushes after review. Never run `git init`, `git add`, `git commit`, or `git push`. Do not create branches or remote repositories, change configuration, authors, or history, or add automated attribution, tool signatures, or `Co-authored-by` trailers. Use Git only for inspection.

