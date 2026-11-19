# FDARWINX

Darwin Sara’s personal site at `https://fdarwinx.me/`. Monochrome Cosmos pairs “Just me.” and “I like the stars.” with an interactive Canvas 2D orbital field. Work covers Austral Group, GastoSmart, and El Rincón de Coco.

## Workspaces

| Path | Responsibility |
| --- | --- |
| `apps/web` | Next.js App Router, existing static Work routes and metadata, Gravity, Tailwind styles, and public assets. |
| `apps/api` | NestJS with Express, validated startup configuration, common HTTP protections, and Health. Unit and integration tests use Node’s test runner. |
| `tests/e2e` | Playwright coverage for responsive layouts, navigation, Work routes, Gravity, and accessibility behavior. |

npm installs both workspaces from the root lockfile. Introduce `packages/shared` once the web and API need a common contract.

## Local development on Windows

Use Node.js 24 LTS and npm. From the repository root in PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open `http://localhost:3000` for the web and `http://localhost:4000/api/health` for the API. Health responds with `{"status":"ok"}` and sends `Cache-Control: no-store`. Both services bind to localhost. The web renders independently of the API in this phase.

Run `npm.cmd run dev:web` or `npm.cmd run dev:api` to start one workspace. To change a port for separate dev sessions:

```powershell
# Terminal 1
npm.cmd run dev:web -- --port 3005

# Terminal 2
$env:PORT = '4005'
$env:CORS_ORIGINS = 'http://localhost:3005'
npm.cmd run dev:api
```

Use `npm.cmd run build`, `npm.cmd run lint`, `npm.cmd run typecheck`, and `npm.cmd test` from the root. With Chrome installed and the web running, use `npm.cmd run test:e2e`. Set `$env:PREVIEW_URL` to target a different local web port. Screenshots and the browser report go in the ignored `test-results/phase-4.1/` directory. For a production preview after building, use `npm.cmd run start --workspace @fdarwinx/web` or `npm.cmd run start --workspace @fdarwinx/api`.

## Environment and API behavior

| Workspace | Variable | Default or purpose |
| --- | --- | --- |
| API | `PORT` | `4000`. Accepts integers from 1 through 65535. |
| API | `CORS_ORIGINS` | `http://localhost:3000`. Comma-separated, exact HTTP or HTTPS origins without paths or trailing slashes. |
| Web | `API_BASE_URL` | Example `http://localhost:4000/api`. Reserved for future server-to-server calls. |

The API reads environment variables and optionally `apps/api/.env`. Copy the matching `.env.example` to customize locally. The web uses `apps/web/.env.local` when future work requires it. Keep private values out of source control and out of `NEXT_PUBLIC_*`. Health requires no credentials.

Helmet applies headers to API responses. CORS grants browser access only to configured origins and carries no credentials. The API accepts JSON bodies up to 16 KiB and enables strict DTO validation for routes that accept input. Errors have generic public messages. The API logs startup and server failures without logging request headers, bodies, IPs, or credentials. Rate limiting is in memory for a single process at 60 requests per minute per client on Health. Counters reset on restart. The HTTP adapter uses the socket address and keeps proxy trust disabled.

## Approved roadmap

| Feature | Design for a later phase |
| --- | --- |
| GitHub Activity | Reserve `GET /api/github/activity`. Use the official GraphQL API, `GITHUB_USERNAME=fdarwin-sara`, and a server-side `GITHUB_TOKEN` with minimum privileges. Publish only authorized contribution-calendar data. Start with a 15-minute cache and define timeouts and error handling. |
| NASA Astronomy Picture of the Day | Reserve `GET /api/astronomy/apod`. Use the official API with server-side `NASA_API_KEY` and a daily cache policy. Handle image and video entries, retain source links and credits, and verify rights per entry. |
| Poems | Use static Markdown, MDX, or TypeScript and individual routes. Preserve stanzas and line breaks. Publish only supplied poems, with translations requiring authorization. Store the content in source. |
| Contact | Reserve `POST /api/contact`. Use Resend with server-only `RESEND_API_KEY`, `CONTACT_FROM`, and `CONTACT_TO`. Validate input and Reply-To, limit requests, protect against spam, and keep message content out of logs. |
| Advanced Gravity | Iterate on Canvas 2D physics and visuals, adapt performance to device capabilities, and preserve the accessible static and reduced-motion modes. Revisit WebGL or Three.js only if there is a demonstrated need. |

The future variables listed above are optional in Phase 4.1.

## Tooling notes

- ESLint 9 is out of support. Keep it until the React, import, and JSX accessibility plugins used by the Next.js configuration support a compatible migration.
- Chrome can report a Next.js script with CDP reason `csp` when Playwright disables JavaScript. Local web HTML has no CSP header or meta directive, and the script loads with JavaScript active. The static content and SVG remain available with scripting disabled.

Darwin manages Git and GitHub. The designated repository is `https://github.com/fdarwin-sara/fdarwinx-portfolio.git`.
