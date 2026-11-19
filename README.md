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

With Chrome installed and the local server running, use `npm run test:e2e`. Set `PREVIEW_URL` to test another local port or a production build. Playwright writes screenshots and its JSON report to `test-results/phase-3/`, which is ignored by Git.

## Known tooling behavior

- ESLint 9 is out of support. The React, import, and JSX accessibility plugins in the current Next.js setup declare peer compatibility through v9. Upgrade once that dependency chain supports the newer release.
- Chrome can report a Next.js script with CDP reason `csp` when Playwright disables JavaScript. Local HTML has no CSP header or meta directive, and the same script loads with JavaScript enabled. The browser still delivers the static content and SVG in the disabled mode.

## Architecture

- `src/app` contains the App Router layout, home page, metadata, and Tailwind design tokens.
- `src/components` contains the shared navigation and wordmark.
- `src/features` contains the Hero, Gravity canvas, and portfolio sections. Server Components render content and navigation. Gravity owns its browser animation lifecycle and Motion handles the scroll cue.
- `src/content/site.ts` holds the editable introduction, interests, and verified contact links.
- `src/content/projects.ts` contains the case studies and verified public links rendered at `/work/[slug]`.
- `public` contains the original static Gravity fallback. Add shared utilities under `src/lib` when they have callers.

## Scope and roadmap

Work covers Austral Group, GastoSmart, and El Rincón de Coco. The descriptions distinguish source-verified features from planned work. Contact is provisional until verified channels are supplied.

Fragments, Bookshelf, Somewhere on Earth, GitHub activity, and additional experiments are future ideas. A NestJS API may support real integrations in a later phase. The present site runs without a backend or database.

Darwin manages Git and GitHub. The designated repository is `https://github.com/fdarwin-sara/fdarwinx-portfolio.git`.
