# FDARWINX project instructions

- Work only inside `fdarwinx-portfolio`. Do not inspect or modify sibling projects.
- FDARWINX is Darwin Sara’s personal site at `https://fdarwinx.me/`. Use English and publish only supplied or confirmed facts, links, authorship, and contributions.
- Follow Monochrome Cosmos. Use black, white, and gray, editorial typography, generous spacing, and restrained astronomical details. Projects may retain their own colors.
- Keep primary navigation to Home, Work, About, and Contact. Defer Fragments, Bookshelf, Somewhere on Earth, GitHub activity, and additional experiments until authorized.
- Use Node.js 24 LTS, npm, Next.js App Router, React, strict TypeScript, Tailwind CSS, Motion, Lucide, and ESLint. Verify stable versions and compatibility before changing dependencies.
- Use Server Components by default. Scope client code to interaction and animation. Keep routes and metadata in `src/app`, reusable UI in `src/components`, features in `src/features`, typed content in `src/content`, and static assets in `public`. Add `src/lib` when shared utilities are needed.
- Keep Phase 2 frontend-only. Reserve a future NestJS integration boundary outside page components when real integrations are commissioned. Defer API and database implementation.
- Keep Gravity decorative and independent of reading and navigation. Provide a static fallback, honor reduced motion, pause in hidden tabs, and clean up animation and input handling.
- Verify lint, typecheck, production build, and local preview before handoff. Check keyboard focus and responsive behavior.

## Git ownership

Darwin performs commits and pushes after review. Never run `git init`, `git add`, `git commit`, or `git push`. Do not create branches or remote repositories, change configuration, authors, or history, or add automated attribution, tool signatures, or `Co-authored-by` trailers. Use Git only for inspection.

