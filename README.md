# navedsayyed.me

Personal portfolio and blog. Statically generated — no database, no runtime data layer beyond
one cached GitHub API call.

![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?logo=tailwindcss&logoColor=white)
![MDX](https://img.shields.io/badge/MDX-FCB32C?logo=mdx&logoColor=black)

## How it works

Content lives in typed constants under `src/dev-constants/` and MDX files in `blog-content/`.
Every route is pre-rendered at build time via `generateStaticParams`, so the deployed site is
static HTML on a CDN.

- **Blog** — MDX with Shiki syntax highlighting baked in at build time, Mermaid diagrams via
  lazy dynamic import, reading time from frontmatter
- **SEO** — JSON-LD (`Person`, `Article`, `SoftwareSourceCode`, `BreadcrumbList`), generated
  sitemap and robots, RSS feed, per-project Open Graph cards
- **Contributions** — GitHub GraphQL, cached server-side for an hour
- **Chatbot** — Gemini with a static knowledge base and in-memory IP rate limiting
- **Theming** — OKLCH tokens with a tinted neutral ramp, light and dark

## Layout

```
src/
├── app/              routes, sitemap, robots, feed, API handlers
├── components/       layouts, page sections, UI primitives
├── dev-constants/    projects, experience, stack, profile — edit content here
└── lib/              MDX pipeline, SEO helpers, project utilities
blog-content/         posts as .mdx (a leading _ marks a draft)
```

## Development

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm lint        # biome
pnpm typecheck   # tsc --noEmit
pnpm build       # production build
```

## Adding content

Projects, experience and stack entries are typed objects in `src/dev-constants/` — add one and
it appears everywhere it belongs, including the sitemap. Blog posts are `.mdx` files in
`blog-content/` with YAML frontmatter; prefix a filename with `_` or set `published: false` to
keep it out of production builds.
