# FDARWINX

Darwin Sara’s personal space on the internet for software, curiosity, and creative exploration. The site is written in English and designed for `https://fdarwinx.me/`.

**Monochrome Cosmos** pairs editorial typography and a black-and-white palette with Gravity, an original stylized orbital field. Move the pointer over the field to bend nearby tracks, or activate the field to send a pulse. Gravity is an artistic interpretation of orbital motion.

## Local development

Use Node.js 24 LTS and npm.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run lint`, `npm run typecheck`, and `npm run build` to validate changes.

## Architecture

- `src/app` contains the App Router layout, home page, metadata, and Tailwind design tokens.
- `src/components` contains the shared navigation and wordmark.
- `src/features` contains the Hero, Gravity canvas, and portfolio sections. Server Components render content and navigation. Gravity owns its browser animation lifecycle and Motion handles the scroll cue.
- `src/content/site.ts` holds the editable introduction, interests, and verified contact links.
- `public` contains the original static Gravity fallback. Add shared utilities under `src/lib` when they have callers.

## Scope and roadmap

Phase 2 establishes Home, Work, About, and Contact. About uses Darwin’s supplied interests. Work and Contact show provisional states until verified projects and contact channels are available. Future case studies should reflect actual authorship and contributions.

Fragments, Bookshelf, Somewhere on Earth, GitHub activity, and additional experiments are future ideas. A NestJS API may support real integrations in a later phase. The present site runs without a backend or database.

Darwin manages Git and GitHub. The designated repository is `https://github.com/fdarwin-sara/fdarwinx-portfolio.git`.
