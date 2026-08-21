# TECHNICAL DEEP DIVE: navedsayyed.me Portfolio

**Project:** Personal Portfolio & Blog Website  
**Developer:** Naved A. Sayyed  
**Tech Stack:** Next.js 16.1.6, React 19.2.4, TypeScript 5.9.3, Tailwind CSS 4.2.0  
**Repository Structure:** App Router (Next.js 15+), Server Components, Static Generation  

---

## 1. Project Overview

This is a statically-generated portfolio website built with Next.js 16 (App Router). It showcases projects, work experience, education, a GitHub contribution graph, and a technical blog powered by MDX. The site is fully static — no database, no runtime API except one GitHub GraphQL endpoint for the contribution calendar.

### Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                         │
│  - Static HTML + hydrated React components                     │
│  - Theme switcher (client-side state via next-themes)          │
│  - Contribution graph (fetches /api/github-contributions)      │
│  - AI Chatbot UI (fetches /api/chat)                           │
└─────────────────────────────────────────────────────────────────┘
                             ▲
                             │ Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js App Router                         │
│  - Server Components (default, RSC)                            │
│  - Static page generation (build time)                         │
│  - API routes (/api/github-contributions, /api/chat, /feed.xml)│
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Sources (Build Time)                    │
│  - /blog-content/*.mdx → gray-matter → BlogPost[]              │
│  - /src/dev-constants/*.ts → Static TypeScript objects         │
│  - /src/lib/chatbot/knowledge-base.ts → Static portfolio data  │
│  - /public/tech-icon/, /public/projects/, etc. → Static assets │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               External APIs (Runtime, Client-Side)              │
│  - GitHub GraphQL API → Contribution calendar data             │
│  - Google Gemini API → AI chatbot responses (via server route) │
└─────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- No runtime database — all content is file-based (TypeScript constants + MDX files)
- Static Site Generation (SSG) for all pages at build time
- Two API routes: `/api/github-contributions` (fetches live GitHub data), `/api/chat` (AI chatbot powered by Google Gemini)
- RSS feed generated as a route handler (`/feed.xml/route.ts`)
- Dark/light theme toggling via `next-themes` (client-side localStorage)
- AI-powered chatbot with rate limiting and structured knowledge base


---

## 2. Tech Stack & Why

Every dependency from `package.json` explained with actual usage in this codebase.

### Core Framework

**next@16.1.6**  
- **What:** React metaframework with App Router, Server Components, and static generation.  
- **Where:** Root application structure in `/src/app/`, all pages use App Router conventions.  
- **Why:** Provides file-based routing, built-in SEO (metadata API), static generation, and React Server Components. The App Router eliminates need for separate API layer for static content.  
- **How it's used:** Every page.tsx file is a route. `layout.tsx` (src/app/layout.tsx) wraps all pages with header/footer. `generateStaticParams()` in `src/app/blog/[slug]/page.tsx` and `src/app/projects/[slug]/page.tsx` pre-renders dynamic routes at build time.

**react@19.2.4** & **react-dom@19.2.4**  
- **What:** UI library (latest stable release with concurrent features).  
- **Where:** All components in `/src/components/`.  
- **Why:** React 19 includes improvements to Server Components and automatic batching. The project uses both Server Components (default) and Client Components (marked with `"use client"`).  
- **How it's used:** Server Components: all page routes, layout, static blog rendering. Client Components: `ThemeSwitcher` (src/components/ui/extended/theme-switcher.tsx), `DeveloperGitContribution` (fetches API client-side), `CopyButton`, `MermaidDiagram`.

### Styling & Design System

**tailwindcss@4.2.0**  
- **What:** Utility-first CSS framework.  
- **Where:** Configured in `src/app/globals.css` with `@import "tailwindcss"` (Tailwind v4 syntax).  
- **Why:** Rapid UI prototyping with consistent spacing/colors. v4 uses CSS-first configuration instead of JS config.  
- **How it's used:** All components use Tailwind classes (e.g., `className="flex items-center gap-2"`). Custom theme defined via CSS variables in `globals.css` (lines 14-79), supporting light/dark modes with OKLCH color space.


**@tailwindcss/typography@0.5.16**  
- **What:** Plugin for styling prose content (blog posts).  
- **Where:** MDX blog content in `src/app/blog/[slug]/page.tsx`.  
- **Why:** Provides pre-styled typography for articles without manual CSS.  
- **How it's used:** Applied via `@plugin "@tailwindcss/typography"` in globals.css (line 3). MDX content wrapped in `<article className="p-2 text-justify">` but prose classes not explicitly applied — custom MDX components in `mdx-components.tsx` handle styling instead.

**@tailwindcss/postcss@4.2.0**  
- **What:** PostCSS plugin for Tailwind v4.  
- **Where:** Referenced in `postcss.config.mjs` (file read but content not shown in exploration).  
- **Why:** Required for Tailwind v4 CSS processing.

**tw-animate-css@1.4.0**  
- **What:** Additional animation utilities for Tailwind.  
- **Where:** Imported in `globals.css` (line 2).  
- **Why:** Extends Tailwind with pre-built CSS animation classes.  
- **How it's used:** Likely for subtle transitions/animations, though no explicit usage found in component code — may be used via arbitrary values.

**tailwind-merge@3.5.0** & **clsx@2.1.1**  
- **What:** Utilities for merging Tailwind classes without conflicts.  
- **Where:** `src/lib/utils.ts` exports `cn()` function combining both.  
- **Why:** `clsx` conditionally joins class names, `twMerge` deduplicates conflicting Tailwind classes.  
- **How it's used:** Every component uses `cn()` to merge conditional classes: `cn("base-class", condition && "conditional-class", className)`.

**class-variance-authority@0.7.1**  
- **What:** Variant-based component API builder.  
- **Where:** `src/components/ui/button.tsx` defines `buttonVariants` using `cva()`.  
- **Why:** Type-safe variant props (size, variant) for shadcn-style components.  
- **How it's used:** Button component has variants (default, outline, ghost) and sizes (sm, default, lg, icon) defined via cva, providing IntelliSense for props.


### UI Component Library (shadcn/ui)

**@radix-ui/react-avatar@1.1.11**, **@radix-ui/react-slot@1.2.4**, **@radix-ui/react-tooltip@1.2.8**  
- **What:** Unstyled, accessible React primitives from Radix UI.  
- **Where:** Wrapped in shadcn components: `avatar.tsx`, `button.tsx` (Slot), `tooltip.tsx`.  
- **Why:** Provides accessible behavior (keyboard nav, ARIA) without opinionated styling.  
- **How it's used:**  
  - Avatar: Blog cards and blog headers show author avatar (DeveloperDetails.avatar).  
  - Slot: Button's `asChild` prop uses Radix Slot to render button styling on Link components.  
  - Tooltip: GitHub contribution graph hover tooltips (`developer-git-contribution.tsx` lines 103-112).

**lucide-react@0.575.0**  
- **What:** Icon library (MIT-licensed, tree-shakable).  
- **Where:** All over the UI: `Mail`, `FileText`, `Calendar`, `Clock`, `Github`, `ExternalLink`, `Download`, `ArrowUpRight`, `Sun`, `Moon`, etc.  
- **Why:** Consistent icon set, small bundle size (only imports used icons).  
- **How it's used:** Icons imported directly in components, e.g., `import { Mail } from "lucide-react"`, then rendered as `<Mail className="size-4" />`.

### MDX & Content Processing

**next-mdx-remote@6.0.0**  
- **What:** MDX rendering library for Next.js (supports Server Components).  
- **Where:** `src/app/blog/[slug]/page.tsx` line 103: `<MDXRemote source={post.content} components={components} options={mdxOptions} />`.  
- **Why:** Allows rendering MDX files as React components with custom component overrides.  
- **How it's used:** Reads compiled MDX content string from `getBlogPostBySlug()`, renders it with custom components defined in `mdx-components.tsx` (headings, links, code blocks, images).

**gray-matter@4.0.3**  
- **What:** YAML frontmatter parser for Markdown files.  
- **Where:** `src/lib/markdown/mdx.ts` line 57: `const { data, content } = matter(fileContents)`.  
- **Why:** Extracts metadata (title, date, description, tags) from MDX files.  
- **How it's used:** All blog posts have YAML frontmatter (e.g., `react-native-setup-windows.mdx` lines 1-8). `gray-matter` splits frontmatter into `data` object and `content` string.


**remark-gfm@4.0.1**  
- **What:** Remark plugin for GitHub Flavored Markdown (tables, strikethrough, task lists).  
- **Where:** `src/lib/markdown/mdx.ts` lines 18-22, passed to `<MDXRemote>` via `mdxOptions`.  
- **Why:** Enables table syntax in MDX (e.g., the tables in `react-native-setup-windows.mdx`).  
- **How it's used:** MDX options exported as `{ mdxOptions: { remarkPlugins: [remarkGfm] } }`, enabling GFM features during compilation.

**reading-time@1.5.0**  
- **What:** Calculates reading time estimate from text.  
- **Where:** `src/lib/markdown/mdx.ts` line 60: `const readingTimeResult = readingTime(content)`.  
- **Why:** Shows "X min read" in blog headers for better UX.  
- **How it's used:** Called on MDX content string, returns `{ text: "5 min read" }`, displayed in `BlogHeader` component.

### Code Syntax Highlighting

**shiki@3.22.0**  
- **What:** Syntax highlighter using VS Code themes (TextMate grammars).  
- **Where:** `src/lib/markdown/code-block.tsx` line 81: `await codeToHtml(normalizedCode, { lang, themes: THEMES })`.  
- **Why:** Produces beautiful, accessible code blocks with dual light/dark theme support.  
- **How it's used:**  
  - Pre-generates HTML with syntax highlighting at build time (Server Component).  
  - Supports 40+ languages (defined in `LANGUAGE_ALIASES` mapping, lines 17-46).  
  - Dual themes: `github-light-default` and `github-dark-default` (line 8-11).  
  - Rendered HTML injected via `dangerouslySetInnerHTML` with theme-switching CSS in `globals.css` (lines 94-111).

### Diagrams & Visualization

**mermaid@11.12.3**  
- **What:** Diagram rendering library (flowcharts, sequence diagrams, etc.).  
- **Where:** `src/lib/markdown/mermaid-diagram.tsx` lines 32-39, client-side only (`"use client"`).  
- **Why:** Allows inline diagrams in blog posts using mermaid syntax.  
- **How it's used:**  
  - MDX code blocks with `language="mermaid"` trigger MermaidDiagram component.  
  - Component dynamically imports mermaid library, initializes with theme based on `resolvedTheme`.  
  - Renders diagram to SVG, re-renders on theme change via useEffect (line 42).


### Animation & Theme

**motion@12.34.3**  
- **What:** Animation library (formerly Framer Motion, rebranded).  
- **Where:** `src/components/main/developer-experience.tsx` lines 8, 58-69.  
- **Why:** Adds animated pulsing effect to "current job" indicator.  
- **How it's used:**  
  - Imported as `import { motion } from "motion/react"`.  
  - `<motion.span>` animates scale and opacity in infinite loop (lines 60-67).  
  - Applied only when `experience.isCurrent === true` (green pulsing dot next to job title).

**next-themes@0.4.6**  
- **What:** Theme management for Next.js (light/dark mode with localStorage persistence).  
- **Where:**  
  - Provider: `src/app/layout.tsx` lines 128-134 wraps app with `<ThemeProvider>`.  
  - Consumer: `src/components/ui/extended/theme-switcher.tsx` uses `useTheme()` hook.  
- **Why:** Handles theme state, localStorage persistence, system preference detection, prevents flash of unstyled content.  
- **How it's used:**  
  - ThemeProvider configured with `attribute="class"`, `defaultTheme="system"`, `enableSystem`.  
  - Theme switcher toggles between light/dark via `setTheme()`.  
  - CSS in globals.css uses `.dark` class selector for dark mode styles (lines 69-86).

### Date & Utilities

**date-fns@4.1.0**  
- **What:** Modern date utility library (tree-shakable).  
- **Where:** `src/components/main/developer-git-contribution.tsx` line 2: `import { format, parseISO } from "date-fns"`.  
- **Why:** Formats dates in contribution graph tooltips.  
- **How it's used:** `format(parseISO(activity.date), "MMM d, yyyy")` converts ISO date string to "Jan 15, 2026".

### AI & Machine Learning

**@google/generative-ai@0.24.1**  
- **What:** Google's official Gemini AI SDK for TypeScript/JavaScript.  
- **Where:** `src/app/api/chat/route.ts` line 1.  
- **Why:** Powers the portfolio chatbot with conversational AI capabilities.  
- **How it's used:**  
  - Initializes Gemini client: `const genAI = new GoogleGenerativeAI(apiKey)`.  
  - Creates model instance: `genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig })`.  
  - Generates responses: `await model.generateContent(prompt)`.  
  - Upgraded from `gemini-2.5-flash-lite` to `gemini-2.5-flash` (March 2026) for improved stability after Google reduced free tier limits in December 2025.  
  - Free tier limits: 250 requests/day, 10 requests/minute, 250K tokens/minute.  
  - Handles rate limiting and quota errors with user-friendly fallbacks.

### Development Tools

**@biomejs/biome@2.4.4**  
- **What:** Linter + formatter (Rust-based, fast alternative to ESLint + Prettier).  
- **Where:** Configured in `biome.json`, runs via `npm run lint` and `npm run lint:fix`.  
- **Why:** Single tool for both linting and formatting, significantly faster than ESLint.  
- **How it's used:**  
  - Linter rules: relaxed a11y rules (lines 17-25), disabled some style checks.  
  - Formatter: 2-space indent, 100 char line width, semicolons always, double quotes (lines 25-32).  
  - Auto-organizes imports (lines 33-39).


**typescript@5.9.3**  
- **What:** TypeScript compiler (latest stable).  
- **Where:** All `.ts` and `.tsx` files; config in `tsconfig.json`.  
- **Why:** Type safety, IntelliSense, catches errors at compile time.  
- **How it's used:**  
  - Strict mode enabled (`"strict": true` in tsconfig.json).  
  - Path alias `@/*` maps to `./src/*` for cleaner imports (line 20).  
  - Types defined in `src/types/index.ts`: `DeveloperConfig`, `Projects`, `Experience`, `TechStack`, `BlogFrontmatter`, `BlogPost`.

---

## 3. Screen-by-Screen / Component-by-Component Breakdown

### Homepage (`src/app/page.tsx`)

**Purpose:** Main landing page showcasing all portfolio sections.

**What it renders:**
1. Intro section (photo, bio, email/resume buttons)
2. Projects grid
3. Work experience timeline
4. Education timeline
5. GitHub contribution graph
6. Tech stack grid
7. Recent blog posts (max 4)
8. Connect section (social links)

**State:** None (Server Component, all data static).

**Data sources:**
- `DeveloperDetails` from `src/dev-constants/details.ts` (personal info, contact, education)
- `ProjectsData` from `src/dev-constants/projects.ts` (project list)
- `getRecentPosts()` from `src/lib/markdown/index.ts` (blog posts)

**Key function:**
- Lines 12-51: Generates JSON-LD structured data for SEO (ProfilePage schema, projects as SoftwareSourceCode).
- Line 63: Filters tech stack into programming languages vs. platforms using hardcoded Set (lines 53-60).

**What it imports:**
- All section components from `src/components/main/*`
- `BlogsGrid` from blog components
- `PageShellWrapper` layout component

**How data flows:**
- Static constants → props → child components (all Server Components)
- No API calls, no client state


### Blog Listing (`src/app/blog/page.tsx`)

**Purpose:** Lists all published blog posts.

**What it renders:**
- Header section (BlogIntroduction)
- Grid of blog post cards (BlogsGrid)
- "No more blogs" footer

**State:** None (Server Component).

**Data sources:**
- `getAllBlogPosts()` from `src/lib/markdown/mdx.ts` (reads all .mdx files at build time)

**SEO:**
- Lines 14-54: Generates BreadcrumbList and CollectionPage JSON-LD schemas.
- Metadata generated via `blogMetadata()` helper (src/lib/seo-utils.ts lines 76-111).

**How it works:**
- Next.js calls this at build time
- `getAllBlogPosts()` scans `/blog-content/*.mdx`, parses frontmatter, filters unpublished, sorts by date descending
- Returns array of `BlogPost` objects (slug, frontmatter, content, readingTime)
- BlogsGrid maps over posts and renders BlogCard for each

### Blog Post Detail (`src/app/blog/[slug]/page.tsx`)

**Purpose:** Individual blog post page with full MDX content.

**What it renders:**
- BlogHeader (title, description, author, date, reading time)
- Cover image (if frontmatter.image exists)
- MDX content rendered with custom components

**State:** None (Server Component).

**Data sources:**
- `getBlogPostBySlug(slug)` from `src/lib/markdown/mdx.ts`

**Key functions:**
- `generateStaticParams()` (lines 14-18): Tells Next.js which slugs to pre-render at build time.
- `generateMetadata()` (lines 21-61): Generates page-specific Open Graph tags, Twitter cards, canonical URLs.
- Lines 68-103: JSON-LD structured data (Article schema + breadcrumbs).

**How MDX rendering works (line 115):**
```tsx
<MDXRemote source={post.content} components={components} options={mdxOptions} />
```
- `post.content`: Raw MDX string
- `components`: Custom React components for h1, h2, code, pre, img, etc. (from `mdx-components.tsx`)
- `options`: Remark plugins (remark-gfm for tables)

**Result:** MDX compiled to React components at build time, custom styling applied via component overrides.


### Project Detail Page (`src/app/projects/[slug]/page.tsx`)

**Purpose:** Individual project showcase with screenshots, description, tech stack.

**What it renders:**
- Header with project icon, title, tagline
- Action buttons (GitHub, Live Demo, APK Download, Docs)
- Screenshots gallery (if screenshots exist)
- About section (bullet points from project.description array)
- Tech stack badges
- Back to portfolio link

**State:** None (Server Component).

**Data sources:**
- `ProjectsData` from `src/dev-constants/projects.ts` (hardcoded TypeScript array)

**Key functions:**
- `toSlug()` (lines 13-18): Converts project title to URL-safe slug (e.g., "LokalMusic" → "lokalmusic").
- `filterExistingScreenshots()` (lines 20-26): Checks if screenshot files actually exist in `/public/` using `fs.existsSync()` to avoid 404s.
- `generateStaticParams()` (line 28): Pre-generates all project detail pages at build time.

**How it finds projects:**
- Line 63: `ProjectsData.find((p) => toSlug(p.title) === slug)`
- If not found, calls `notFound()` (Next.js 404 handler)

**Screenshots component (line 83):**
- `<ScreenshotLightbox>` from extended UI components
- Displays grid of thumbnails, opens lightbox on click (component code not fully explored, but usage clear)

**Weak spot:**
- Slug generation is based on title string transformation, not a stable ID. If a project title changes, URLs break. No redirect logic.

### Root Layout (`src/app/layout.tsx`)

**Purpose:** Wraps all pages with site-wide chrome (header, footer, theme, metadata).

**What it renders:**
- HTML boilerplate
- JSON-LD structured data (Person, Website schemas)
- ThemeProvider wrapper
- Skip-to-content link (accessibility)
- SiteHeader (sticky nav)
- Main content area
- SiteFooter

**Global metadata (lines 14-51):**
- Base URL, title template, description, keywords
- Open Graph tags
- Twitter card
- RSS feed link (`/feed.xml`)
- Canonical URL

**Font loading (line 86):**
- Space Grotesk from Google Fonts via `next/font/google`
- Applied as CSS variable `--font-space-grotesk`


### Homepage Sections (src/components/main/)

**DeveloperIntro** (`developer-intro.tsx`)
- Displays profile photo, name, designation, bio
- Email + Resume buttons
- Uses Image from next/image for avatar (128x128px, priority loading)
- Bio text: `text-justify` alignment

**DeveloperProjects** (`developer-projects.tsx`)
- Maps over `ProjectsData` array
- Each project: icon, title, tagline, arrow → link to `/projects/[slug]`
- Uses ExpandableSection component (collapsible UI pattern)
- Slug generation: same `toSlug()` function as project detail page

**DeveloperExperience** (`developer-experience.tsx`)
- Timeline of work experience (ExperienceData array)
- Each item: company logo, title, dates, description bullets, tech stack badges
- Collapsible details via ExpandableSection
- **Client Component** (`"use client"`) because it uses `motion` for animation
- Lines 48-55: Connecting vertical line between timeline items (CSS absolute positioning)
- Lines 56-69: Animated pulsing green dot for current role (`isCurrent === true`)

**DeveloperEducation** (`developer-education.tsx`)
- Similar timeline structure to experience
- Displays degree, institution, location, dates
- No collapsible behavior (simpler than experience)

**DeveloperGitContribution** (`developer-git-contribution.tsx`)
- **Client Component** (fetches API data)
- useEffect hook (lines 32-58): Fetches `/api/github-contributions` on mount
- Displays loading skeleton while fetching
- Shows error state if fetch fails (red hatched border div)
- Renders `<ContributionGraph>` component (contribution-graph.tsx in extended UI)
- Tooltips show contribution count + date on hover
- Color levels: 5 shades based on GitHub's contribution intensity (NONE to FOURTH_QUARTILE)

**DeveloperStack** (`developer-stack.tsx`)
- Grid of tech icons + names (TechStacksList array)
- CSS grid: `gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))"`
- Each cell: icon + label, hover effect (color transition)
- Uses ThemedIcon component to swap light/dark icon variants

**DeveloperConnect** (`developer-connect.tsx`)
- Social links grid (LinkedIn, GitHub, X, Instagram)
- Email + Resume buttons
- Uses ThemedIcon for social icons (some have dark variants)


### Blog Components (src/components/blog/)

**BlogHeader** (`blog-header.tsx`)
- Displays post title, description, author info, publish date, reading time
- Avatar component with fallback to initials
- Date formatted via native `Date.toLocaleDateString()`
- Reading time from reading-time package

**BlogIntroduction** (`blog-introduction.tsx`)
- Static intro text for /blog page
- Mentions "not generated by AI" (developer's personal note)

**BlogsGrid** (`blogs-grid.tsx`)
- Takes `posts` array + optional `maxPosts` limit
- Maps over posts, renders BlogCard for each
- Each card: cover image, title, description, author avatar, date, "Read More" link
- Uses next/image for cover images (lazy loading except first post with `priority`)

**BlogCard** (`blogs-card.tsx`)
- Compound component pattern (BlogCard, BlogCardImage, BlogCardTitle, etc.)
- Wraps content in Link to `/blog/[slug]`
- Hover effects: underline on title, color shift on "Read More"

**NoMoreBlogs** (from index.ts export, component not read but usage implies end-of-list message)

### Layout Components (src/components/layouts/)

**SiteHeader** (`site-header.tsx`)
- **Client Component** (scroll listener for sticky border)
- useEffect + requestAnimationFrame for optimized scroll detection
- Sticky header with backdrop blur
- Navigation: Home logo, Blog link, GitHub button, Theme switcher
- Border appears only when scrolled (`isScrolled` state)

**SiteFooter** (`site-footer.tsx`)
- Simple centered footer
- "Built by navedsayyed" with GitHub link

**PageShellWrapper** (`page-shell.tsx`)
- Decorative grid layout with diagonal hatch pattern borders
- CSS Grid: 5 columns, 5 rows (complex layout for visual effect)
- Main content in center column
- Side columns render decorative hatched borders

**ShellWrapper** (`shell-wrapper.tsx`)
- Wraps individual sections
- Adds top/bottom horizontal lines via pseudo-elements
- Max-width 2xl (Tailwind breakpoint)


### UI Components (src/components/ui/)

**Button** (`button.tsx`)
- shadcn/ui button with class-variance-authority variants
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon, icon-sm, icon-lg
- `asChild` prop uses Radix Slot to render button styles on child element (used for Link buttons)

**Avatar** (`avatar.tsx`)
- Radix UI Avatar primitive (Root, Image, Fallback)
- Shows image or falls back to initials
- Used in blog cards and headers

**Tooltip** (`tooltip.tsx`)
- Radix UI Tooltip primitive
- Zero delay (`delayDuration = 0` in TooltipProvider)
- Used in contribution graph to show date + count on hover

### Extended UI Components (src/components/ui/extended/)

**ThemeSwitcher** (`theme-switcher.tsx`)
- **Client Component**
- Uses `useTheme()` from next-themes
- Button toggles between light/dark mode
- Sun icon visible in light mode, Moon in dark (CSS display toggle)

**ThemedIcon** (`themed-icon.tsx`)
- Displays two Image components: one for light, one for dark
- If `hasDarkVariant` true: light icon has `dark:hidden`, dark icon has `hidden dark:block`
- Used for GitHub, shadcn, and other tech icons with dark variants

**StackBadge** (`stack-badge.tsx`)
- Pill-shaped badge with icon + label
- Used in tech stack grid, project tech stacks, experience skills

**GitHubButtons** (`github-buttons.tsx`)
- **Client Component**
- Button with GitHub icon that opens profile in new tab
- Hardcoded to `DeveloperDetails.socialLinks[1].url` (assumes GitHub is second item)

**ContributionGraph** (file not fully read, but usage in developer-git-contribution.tsx shows):
- Renders GitHub-style heatmap calendar
- Takes `data` array of `{ date, count, level }` objects
- Children: `ContributionGraphCalendar`, `ContributionGraphBlock`, `ContributionGraphFooter`, `ContributionGraphLegend`, `ContributionGraphTotalCount`
- Scrolls to most recent date (scrollToEnd prop)

**ExpandableSection** (file not read, inferred from usage):
- Collapsible section with header/content pattern
- Used in Projects, Experience sections
- Components: Header, Label, Title, Description, List, Item, Trigger, Content

**ScreenshotLightbox** (file not read, inferred from usage):
- Gallery component for project screenshots
- Likely uses dialog/modal for full-size view


---

## 4. Backend & Data Layer

### No Traditional Backend

This project has **no runtime database**. All data is stored in:
1. **TypeScript constant files** (`/src/dev-constants/`)
2. **MDX files** (`/blog-content/`)
3. **Static assets** (`/public/`)

### Data Sources

**DeveloperDetails** (`src/dev-constants/details.ts`)
- Type: `DeveloperConfig` (src/types/index.ts lines 1-37)
- Contains: name, email, bio, avatar, social links, location, SEO metadata, education
- Used in: layout metadata, homepage intro, footer, blog author info

**ProjectsData** (`src/dev-constants/projects.ts`)
- Type: `Projects[]` (src/types/index.ts lines 38-47)
- Array of 6 projects: Snap2Fix, LokalMusic, Grievance Resolver, MenuForge, COSA-Website, Blood-O
- Each project has: icon, title, tagline, date, description (string array), optional links (repo, liveLink, apkLink, docsLink), techStack, screenshots
- Used in: homepage projects section, project detail pages

**ExperienceData** (`src/dev-constants/experience.ts`)
- Type: `Experience[]` (src/types/index.ts lines 54-62)
- Array of 2 work experiences: Indian Air Force internship, COSA-GCOERC technical head
- Each has: company, logo, designation, type (Internship/Part-time/etc.), dates, isCurrent flag, description bullets, skills
- Used in: homepage experience section

**TechStacksList** (`src/dev-constants/stack.ts`)
- Type: `TechStack[]` (src/types/index.ts lines 49-53)
- Array of 25 technologies with name, icon path, optional hasDarkIcon flag
- Used in: homepage stack grid

**Blog Posts** (`/blog-content/*.mdx`)
- Format: MDX with YAML frontmatter
- Frontmatter fields: title, description, developer, date, updatedDate (optional), image, published (boolean), tags (array)
- Content: GitHub Flavored Markdown with JSX components
- Parsed via: `gray-matter` (frontmatter) + `next-mdx-remote` (content rendering)
- Reading time calculated via `reading-time` package


### API Routes

**GitHub Contributions API** (`src/app/api/github-contributions/route.ts`)

**Purpose:** Fetch live contribution data from GitHub GraphQL API.

**How it works:**
1. Reads `GITHUB_TOKEN` from environment variables (required in `.env`)
2. Calculates date range (last 12 months)
3. Sends GraphQL query to `https://api.github.com/graphql`
4. Query structure:
   ```graphql
   user(login: "navedsayyed") {
     contributionsCollection(from: "...", to: "...") {
       contributionCalendar {
         weeks {
           contributionDays {
             date
             contributionCount
             contributionLevel
           }
         }
       }
     }
   }
   ```
5. Maps GitHub's `contributionLevel` enum (NONE, FIRST_QUARTILE, etc.) to 0-4 scale
6. Returns JSON: `{ data: [{ date, count, level }], total: number }`
7. Response cached with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

**Authentication:**
- Requires GitHub Personal Access Token with `read:user` scope
- Token stored in `.env` (not committed)
- `.env.example` shows required format

**Weak spots:**
- If token is missing or invalid, API returns 500 error
- No fallback data — contribution graph component shows error state
- Token not validated at build time, only at runtime when API is called

**RSS Feed** (`src/app/feed.xml/route.ts`)

**Purpose:** Generate RSS 2.0 feed for blog posts.

**How it works:**
1. Calls `getAllBlogPosts()` at request time (but since this is SSG, effectively at build time)
2. Maps each post to RSS `<item>` with title, link, GUID, description, pubDate, author, categories (tags)
3. Returns XML string with `Content-Type: application/rss+xml`
4. Cached with `s-maxage=3600, stale-while-revalidate`

**Key details:**
- Uses `escapeXml()` helper to prevent XML injection (line 4-11)
- Feed URL: `https://navedsayyed.me/feed.xml`
- Each post GUID uses permalink (isPermaLink="true")
- Author format: `email (name)` as per RSS spec

**AI Chatbot API** (`src/app/api/chat/route.ts`)

**Purpose:** Conversational AI assistant that answers questions about Naved's portfolio using Google's Gemini API.

**Architecture:**
```
Client Request → Rate Limiter → Gemini API → Response
                     ↓
              Knowledge Base (static data)
```

**How it works:**
1. **Rate Limiting (In-Memory):**
   - Tracks requests per IP address via `Map<string, { count, resetAt }>`
   - Limit: 10 requests per minute per IP
   - Window resets every 60 seconds
   - Returns 429 if limit exceeded
   - IP extracted from `x-forwarded-for` or `x-real-ip` headers

2. **Gemini API Integration:**
   - Model: `gemini-2.5-flash` (upgraded from `flash-lite` for stability)
   - Configuration:
     - Temperature: 0.7 (balanced creativity)
     - Top-K: 40, Top-P: 0.95 (nucleus sampling)
     - Max output: 500 tokens (~2-4 sentence responses)
   - Reads `GEMINI_API_KEY` from environment variables

3. **Knowledge Base (`src/lib/chatbot/knowledge-base.ts`):**
   - Static text containing all portfolio data:
     - Personal info (name, role, location, education)
     - Projects (Snap2Fix, LokalMusic, Grievance Resolver, etc.)
     - Experience (Air Force internship, COSA-GCOERC)
     - Skills (React, Next.js, React Native, Supabase, etc.)
     - Contact details (email, phone: +91 9356055279, WhatsApp, social links)
   - Injected into every prompt as context
   - Size: ~2,000 tokens (well within Gemini's 1M context window)

4. **Prompt Engineering:**
   ```
   You are Naved Sayyed's portfolio assistant. Answer questions about Naved 
   using ONLY the information below. Be concise (2-4 sentences), friendly, 
   and professional. If the answer isn't in the info, suggest contacting 
   Naved directly at navedas9356@gmail.com.
   
   INFO ABOUT NAVED:
   {knowledgeBase}
   
   USER QUESTION: {message}
   ```
   - Scoped responses (only uses knowledge base)
   - Concise output (reduces token costs)
   - Fallback to direct contact for unknown questions

5. **Retry Logic:**
   - 3 retry attempts for 503 errors (model overload)
   - 1-second delay between retries
   - Fails gracefully if all retries exhausted

6. **Error Handling:**
   - 429 errors → "I'm getting a lot of questions right now! Please try again in a bit, or reach out directly at navedas9356@gmail.com."
   - Quota/limit errors → "Daily limit reached. Please contact Naved directly at navedas9356@gmail.com or +91 9356055279."
   - Generic errors → "Something went wrong. Please try again."

**API Rate Limits (Gemini Free Tier 2026):**
- **Requests per day (RPD):** 250
- **Requests per minute (RPM):** 10
- **Tokens per minute (TPM):** 250,000
- Cost: $0 (free tier)
- Upgrade path: Paid tier costs ~$0.02-0.05/month for typical portfolio traffic

**Frontend Component (`src/components/chatbot/portfolio-chatbot.tsx`):**

**UI Pattern:**
- Floating button (bottom-right) → Opens chat modal
- **Client Component** (`"use client"`) for interactivity
- Chat interface: message bubbles, input field, send button

**State Management:**
```tsx
const [isOpen, setIsOpen] = useState(false);        // Modal visibility
const [messages, setMessages] = useState([...]);    // Chat history
const [input, setInput] = useState("");             // Current message
const [loading, setLoading] = useState(false);      // Sending state
```

**Message Flow:**
1. User types message → clicks Send (or presses Enter)
2. Adds user message to chat history
3. Calls `POST /api/chat` with `{ message: input }`
4. Shows "Thinking..." indicator while waiting
5. Receives response → adds assistant message to chat history
6. Auto-scrolls to latest message via `useEffect` + `useRef`

**Error Handling:**
- Rate limit (429) → Shows friendly message from API response
- Network error → "Sorry, I couldn't connect. Please try again."
- Empty responses → "Sorry, something went wrong."

**UI Details:**
- Icons: `MessageCircle` (open button), `X` (close), `Send` (submit)
- Styling: Tailwind with theme-aware colors (supports light/dark mode)
- Accessibility:
  - `type="button"` on all buttons (prevents form submission)
  - `aria-label` for icon-only buttons
  - Enter key submits message
  - Disabled state while loading

**Integration (`src/app/layout.tsx`):**
- Added to root layout (line 153): `<PortfolioChatbot />`
- Renders on every page (global component)
- Exported from `src/components/chatbot/index.ts` barrel file

**Why This Implementation:**

**Chosen Stack:**
- ✅ **Gemini over OpenAI:** Free tier has generous limits (250 RPD vs OpenAI's $0.002/1K tokens)
- ✅ **In-memory rate limiting:** Simple, no Redis needed for portfolio-scale traffic
- ✅ **Static knowledge base:** No vector database overhead, instant responses, 100% accurate citations
- ✅ **Client-side UI:** Smooth UX without Server Components complexity for interactive chat

**Tradeoffs:**
- ❌ Rate limiter resets on server restart (acceptable for Vercel serverless functions)
- ❌ No conversation history persistence (each message is independent)
- ❌ Knowledge base must be manually updated when portfolio changes
- ❌ Reliant on Google's free tier stability (limits changed in Dec 2025)

**Production Considerations:**
1. **API Key Security:**
   - `GEMINI_API_KEY` stored in Vercel environment variables
   - Never exposed to client (API route is server-side)
   - Key included in `.env` (gitignored), example in `.env.example`

2. **Cost Monitoring:**
   - Free tier: 250 requests/day sufficient for typical portfolio traffic
   - Average conversation: 3-5 messages = 3-5 requests
   - Daily capacity: ~50 visitors with 5 messages each
   - Paid upgrade: $0.30/1M input tokens + $1.20/1M output tokens

3. **Scaling Strategy:**
   - If traffic exceeds 250 RPD: Switch to `gemini-2.5-flash-lite` (1,000 RPD)
   - If quality degrades: Upgrade to paid tier (minimal cost)
   - If abuse detected: Add IP-based daily limits (currently only per-minute)

4. **Monitoring:**
   - Watch Vercel function logs for 429 errors (quota exceeded)
   - Check Gemini API dashboard for usage trends
   - User complaints about "too many requests" = need to raise RPM limit

**Interview Talking Points:**
- "Added RAG-style chatbot without vector database by using structured knowledge base"
- "Implemented client-side rate limiting to protect free-tier API quota"
- "Chose Gemini 2.5 Flash for balance of quality, speed, and cost (free tier)"
- "Handles 250 daily conversations at zero cost vs. paid alternatives"
- "Graceful degradation: specific error messages guide users to direct contact"


### SEO Utilities (`src/lib/seo-utils.ts`)

**generateSitemap()**
- Called by `src/app/sitemap.ts` (Next.js convention for sitemap.xml)
- Returns array of URL objects with lastModified, changeFrequency, priority
- Static routes: `/` (priority 1.0, weekly), `/blog` (0.8, monthly)
- Dynamic routes: one entry per blog post (`/blog/[slug]`, priority 0.7, monthly)
- Blog listing lastModified = most recent post date
- If no posts exist, falls back to hardcoded `SITE_LAUNCH_DATE = "2024-01-01"`

**generateRobots()**
- Called by `src/app/robots.ts` (Next.js convention for robots.txt)
- Allows all crawlers by default
- **Blocks AI training bots:** GPTBot (OpenAI), ClaudeBot (Anthropic), CCBot (Common Crawl), Amazonbot, Bytespider (TikTok), meta-externalagent (Meta), Applebot-Extended
- **Does NOT block Google-Extended** (allows Gemini AI Overviews)
- Sitemap reference: points to `/sitemap.xml`

**blogMetadata()**
- Generates metadata object for `/blog` page
- Returns title, description, keywords, Open Graph, Twitter card, canonical URL, RSS feed link

### Markdown Processing (`src/lib/markdown/`)

**mdx.ts** — Core MDX utilities:

`getAllBlogSlugs()`
- Reads `/blog-content/` directory
- Filters for `.mdx` files
- Returns array of slugs (filename without extension)

`getBlogPostBySlug(slug)`
- Reads `blog-content/${slug}.mdx`
- Parses frontmatter with `gray-matter`
- Calculates reading time
- Returns `BlogPost` object (slug, frontmatter, content, readingTime)
- Returns null if file doesn't exist

`getAllBlogPosts()`
- Calls `getAllBlogSlugs()`, maps to `getBlogPostBySlug()`
- Filters out null results (missing files)
- Filters out posts with `published: false` in frontmatter
- Sorts by date descending (newest first)

`mdxOptions`
- Exported config object for `next-mdx-remote`
- Includes `remark-gfm` plugin for table support

**blog-utils.ts** — Higher-level helpers:

`getRecentPosts(count = 4)`
- Calls `getAllBlogPosts()`, slices first N posts
- Used on homepage to show recent articles

`searchPosts(query)`
- Filters posts by title/description match (case-insensitive)
- Not currently used in UI (no search feature implemented)


### MDX Component Overrides (`src/lib/markdown/mdx-components.tsx`)

**Purpose:** Customize how MDX elements render in blog posts.

**Key customizations:**

**Headings (h1-h6):**
- All have scroll margin (`scroll-m-20`) for smooth anchor navigation
- h2 and h3 auto-generate IDs from text content via `slugify()` helper (lines 33-42)
- h2 IDs enable linking to sections (e.g., `#introduction`)

**Links (`<a>`):**
- External links (start with "http", not navedsayyed.me) auto-get `target="_blank" rel="noopener noreferrer"`
- All links styled with primary color underline on hover

**Code blocks (`<pre>` and `<code>`):**
- Inline code: wrapped in styled `<code>` with border + bg-muted (lines 115-123)
- Block code: parsed for language, passed to `<CodeBlock>` component (lines 125-141)
- Mermaid diagrams: detected via `language="mermaid"`, rendered via `<MermaidDiagram>` (line 137)

**Images (`<img>`):**
- Converted to next/image for optimization (lines 143-158)
- Default size 800x400, auto-rounded corners, border
- Alt text displayed as caption below image

**Tables:**
- Wrapped in scrollable div with rounded border (line 87)
- Alternating row backgrounds via Tailwind

**Blockquotes:**
- Left border (4px), italic text, pl-5 indentation

**Lists:**
- Bullet/numbered with left margin, `[&>li]` selector for spacing

### Code Highlighting (`src/lib/markdown/code-block.tsx`)

**CodeBlock component:**
- Server Component (async, runs at build time)
- Takes `code`, `language`, `meta` (title, line numbers, etc.)
- Resolves language via `LANGUAGE_ALIASES` map (40+ languages supported)
- Extracts title from meta string (e.g., `title="example.ts"`)
- Calls `codeToHtml()` from shiki with dual themes (github-light-default, github-dark-default)
- Returns `<figure>` with language label, copy button, and syntax-highlighted HTML

**CopyButton component:**
- **Client Component** (needs clipboard API)
- Copies code to clipboard on click
- Shows checkmark for 2 seconds after copy
- Uses `navigator.clipboard.writeText()`


### Mermaid Diagrams (`src/lib/markdown/mermaid-diagram.tsx`)

**MermaidDiagram component:**
- **Client Component** (requires browser APIs + dynamic import)
- Imports mermaid library dynamically: `await import("mermaid")`
- Initializes with theme matching current mode (`resolvedTheme` from next-themes)
- Renders diagram via `mermaid.render()`, returns SVG string
- Re-renders when theme changes (useEffect dependency on `resolvedTheme`)
- Shows loading skeleton while rendering
- Shows error message if diagram syntax is invalid

**ID generation quirk:**
- React `useId()` returns IDs with colons (e.g., `:r1:`)
- Mermaid requires alphanumeric IDs
- Workaround: strip colons from ID (line 36: `safeId = "mermaid-${id.replace(/:/g, "")}"`)

---

## 5. Architecture Diagram

```mermaid
graph TB
    subgraph "Build Time"
        A[TypeScript Constants] --> B[Next.js Build Process]
        C[MDX Files] --> B
        D[Static Assets] --> B
        B --> E[Static HTML Pages]
        B --> F[Client JS Bundles]
    end

    subgraph "Runtime - Server"
        G[Vercel/CDN] --> E
        G --> F
        G --> H[API Routes]
        H --> I[/api/github-contributions]
        H --> J[/feed.xml]
        I --> K[GitHub GraphQL API]
    end

    subgraph "Runtime - Client"
        L[Browser] --> G
        L --> M[Client Components]
        M --> N[Theme State - localStorage]
        M --> O[Contribution Graph]
        O --> I
    end

    style B fill:#4ade80
    style E fill:#60a5fa
    style I fill:#f59e0b
    style M fill:#a78bfa
```

**Data Flow Explanation:**

1. **Build Time:**
   - Next.js reads TypeScript constants (`/src/dev-constants/`)
   - Reads MDX files from `/blog-content/` and parses with gray-matter
   - Compiles MDX to React components with Shiki syntax highlighting
   - Generates static HTML for all pages via Server Components
   - Creates sitemap.xml and robots.txt

2. **Static Pages (Zero Client-Side Data Fetching):**
   - `/` (homepage): All data from TypeScript constants
   - `/blog`: All posts from filesystem at build time
   - `/blog/[slug]`: MDX compiled to HTML at build time
   - `/projects/[slug]`: Project data from TypeScript constants

3. **Client-Side Interactivity (Minimal JavaScript):**
   - Theme switcher: toggles CSS class, saves to localStorage
   - Contribution graph: fetches `/api/github-contributions` on mount
   - Copy button: writes to clipboard
   - Scroll detection: adds border to header when scrolled
   - Mermaid diagrams: renders SVG from code block

4. **Runtime API Calls:**
   - `/api/github-contributions`: Proxies to GitHub GraphQL API with token auth
   - `/feed.xml`: Regenerates RSS feed (or serves cached version)


---

## 6. Honest Weak Spots

### No Error Boundaries
- If a Server Component fails (e.g., MDX parsing error), the entire page crashes
- No graceful degradation for individual sections
- `error.tsx` exists but only catches runtime errors in Client Components, not build-time failures

### GitHub Token Management
- API route returns generic 500 if token is missing/invalid
- No build-time validation — developer only finds out when contribution graph fails to load
- No fallback UI with cached data or placeholder
- Token must be manually added to `.env` — no setup script or clear onboarding docs

### Project Screenshot Validation
- `filterExistingScreenshots()` uses `fs.existsSync()` at runtime to check if files exist
- This happens server-side, so broken screenshot links caught before rendering
- But **no validation at build time** — if someone deletes a screenshot from `/public/`, builds still succeed
- Only fails silently (screenshot not shown) rather than breaking the page

### Blog Post Date Handling
- Dates in frontmatter are strings (e.g., "2026-03-15")
- No validation that date is valid ISO format
- If malformed, `new Date()` returns Invalid Date, which renders as "Invalid Date" in UI
- Should use Zod or similar schema validation

### Hardcoded Social Link Index
- `GitHubButtons` component accesses GitHub URL via `DeveloperDetails.socialLinks[1].url`
- Assumes GitHub is always second item in array
- If array order changes, button breaks
- Should use `.find(link => link.name === "GitHub")` instead

### No 404 for Missing Projects
- `/projects/[slug]` calls `notFound()` if project not found, which is correct
- But **no custom 404 page** for `/projects/non-existent-slug`
- Falls back to generic `not-found.tsx` which doesn't explain what went wrong

### Contribution Graph Error State
- If GitHub API fails, component renders a tiny red hatched border div
- No error message, no retry button, no explanation
- User has no idea what went wrong or how to fix it
- Should show "Failed to load GitHub activity. Try refreshing." with retry button


### Slug Stability Issue
- Project slugs generated from titles via `toSlug()` function
- If project title changes, URL changes (e.g., "LokalMusic" → "Lokal Music" breaks `/projects/lokalmusic`)
- No redirect logic for old URLs
- Should use stable IDs (e.g., `project.id` field) or maintain slug history

### No Search Functionality
- `searchPosts()` function exists in `blog-utils.ts` but is never used
- No search UI on `/blog` page
- Users must manually scroll through all posts
- Function implemented but abandoned — unclear why

### Biome Config Disables Many Lints
- `biome.json` disables critical accessibility rules:
  - `useValidAnchor: "off"` (allows links without href)
  - `useKeyWithClickEvents: "off"` (allows onClick without keyboard handler)
  - `useFocusableInteractive: "off"` (allows non-focusable interactive elements)
  - `noRedundantRoles: "off"` (allows unnecessary ARIA roles)
- These were likely disabled to pass existing code rather than fixing issues
- Accessibility debt accumulating

### MDX Component Override Gaps
- Custom `<img>` component converts to `next/image` (good)
- But hardcoded width/height (800x400) doesn't respect original dimensions
- If image is smaller, it gets stretched; if larger, it gets cut off
- Should extract actual dimensions from image file or use fill + aspect-ratio

### Theme Flash on Initial Load
- `suppressHydrationWarning` used in `<html>` and `<body>` tags
- This suppresses React's mismatch warning for theme class
- But if JavaScript loads slowly, user briefly sees wrong theme
- next-themes has `enableColorScheme` option to set `<meta name="color-scheme">` — not used here

### No Progressive Enhancement
- GitHub contribution graph requires JavaScript to load
- If JS fails/disabled, user sees loading skeleton forever
- Should detect JS-disabled state and show message or fallback content

### Inconsistent Date Formatting
- Blog header: `Date.toLocaleDateString("en-US", { ... })`
- Blog cards: `Date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })`
- RSS feed: `Date.toUTCString()`
- Should use date-fns consistently for all date formatting

### Empty Resume Route
- `/src/app/resume/` directory exists but is empty
- Likely a placeholder for future resume page
- Should either implement or delete


### No Sitemap for Projects
- Sitemap includes homepage, blog listing, and individual blog posts
- **Does NOT include project detail pages** (`/projects/[slug]`)
- `generateSitemap()` in `seo-utils.ts` only maps over blog posts
- Should also map over `ProjectsData` to include project URLs

### No Analytics or Monitoring
- No Google Analytics, Plausible, Vercel Analytics, or any tracking
- Developer has no visibility into:
  - Which pages get traffic
  - Which blog posts are popular
  - Where users drop off
  - Whether external links work
- Impossible to measure impact or improve based on data

### No Automated Tests
- No unit tests, integration tests, or E2E tests
- No way to verify:
  - MDX parsing doesn't break with edge cases
  - Project slug generation is consistent
  - API routes handle errors correctly
  - Dark mode works across all components
- Risk of regressions with every change

### No CI/CD Beyond Vercel Deploy
- GitHub Actions workflow exists (`.github/workflows/ci.yml`) but content not explored
- Likely just runs linter, no actual tests
- No automated checks for:
  - Broken links
  - Missing images
  - Invalid frontmatter
  - TypeScript errors

### No Content Validation
- Projects can have missing `icon`, `techStack`, or `description` fields
- Blog posts can have invalid `date` or missing `title`
- No Zod schemas or runtime validation
- If data is malformed, site breaks at build time with cryptic errors

### No Internationalization (i18n)
- All content hardcoded in English
- No `lang` attribute variants for multilingual support
- `<html lang="en">` in layout.tsx — hardcoded
- If developer wants to add Hindi/Marathi content, requires full rewrite

### TypeScript `any` Types Likely Present
- TypeScript strict mode enabled, but many external APIs return `any`
- GitHub GraphQL response typed as `GraphQLResponse` but structure manually defined
- If GitHub changes API shape, TypeScript won't catch it
- Should use GraphQL codegen or stricter type guards


---

## 7. Build & Deployment

### Build Process

**Commands:**
- `npm run dev` — Development server with Turbopack (Next.js 15+ fast refresh)
- `npm run build` — Production build with Turbopack (`next build --turbopack`)
- `npm start` — Runs production server (not used for static export)
- `npm run lint` — Runs Biome linter (check only)
- `npm run lint:fix` — Runs Biome with auto-fix
- `npm run typecheck` — Runs TypeScript compiler in check mode (no emit)

**Build Output:**
- Next.js generates static HTML files in `.next/` directory
- All pages are pre-rendered at build time (SSG)
- No server-side rendering (SSR) — pure static site
- `generateStaticParams()` in dynamic routes ensures all pages exist at build time

### Environment Variables

**Required:**
- `GITHUB_TOKEN` — GitHub personal access token with `read:user` scope
- Used by `/api/github-contributions` route to fetch contribution data
- Must be set in `.env` file (not committed)
- `.env.example` shows format

**Optional:**
- None — site works without GITHUB_TOKEN, but contribution graph fails

### Security Headers

Configured in `next.config.ts` (`async headers()` function, lines 31-60):

**Applied to all routes (`/(.*)`)**:
- `X-Frame-Options: DENY` — Prevents clickjacking
- `X-Content-Type-Options: nosniff` — Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` — Controls referrer leakage
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` — Forces HTTPS
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` — Blocks unnecessary APIs
- `Content-Security-Policy` — Restricts script sources, allows inline styles, images from HTTPS, fonts from Google Fonts, connects to GitHub API

**Static asset caching:**
- `/_next/static/(.*)` — Immutable, 1 year cache
- Images/fonts (`.webp, .png, .svg, .jpg, .jpeg, .ico, .woff2, .woff, .pdf`) — Immutable, 1 year cache

### Redirects

Configured in `next.config.ts` (`async redirects()` function, lines 6-29):

**www → non-www:**
- `www.navedsayyed.me/*` → `https://navedsayyed.me/*` (permanent)

**Legacy Blogger URL cleanup:**
- `/*?m=*` → `/*` (strips `?m=` query param from old Blogger mobile URLs)
- `/YYYY/MM/slug.html` → `/blog` (old date-based post URLs)
- `/p/slug.html` → `/` (old Blogger static pages)

These suggest this portfolio replaced an old Blogger site at same domain.


### Deployment Strategy

**Likely Hosted On:** Vercel (inferred from Next.js defaults, no explicit config seen)

**Static Export:**
- All pages pre-rendered at build time
- No serverless functions except API routes
- API routes deployed as serverless functions (edge or Node.js runtime)
- Static assets served from CDN

**Cache Strategy:**
- GitHub contributions API: 1 hour cache, stale-while-revalidate for 24 hours
- RSS feed: 1 hour cache, stale-while-revalidate
- Static assets: 1 year immutable cache

---

## 8. TypeScript Configuration

**Target:** ES2017 (supports async/await natively)

**Module System:** ESNext with bundler resolution (Next.js handles bundling)

**Strict Mode:** Enabled (all strict checks)

**Path Aliases:**
- `@/*` maps to `./src/*`
- Used throughout: `import { DeveloperDetails } from "@/dev-constants/details"`

**JSX:** `react-jsx` (new JSX transform, no need to import React)

**Incremental Compilation:** Enabled (faster rebuilds)

**Key Settings:**
- `skipLibCheck: true` — Doesn't type-check node_modules (faster builds)
- `noEmit: true` — Next.js handles compilation, TypeScript just checks types
- `resolveJsonModule: true` — Can import JSON files
- `isolatedModules: true` — Each file can be transpiled independently (required for SWC/Turbopack)

---

## 9. CSS Architecture

### Tailwind v4 CSS-First Approach

- Config defined in `globals.css`, not `tailwind.config.js`
- `@import "tailwindcss"` at top of globals.css
- Custom theme via CSS variables in `:root` and `.dark`

### Color System (OKLCH)

**Why OKLCH?**
- Perceptually uniform color space (better than HSL/RGB)
- Smoother gradients, more predictable color mixing
- Supports wide color gamut displays

**Implementation:**
- All colors defined in OKLCH format: `oklch(lightness chroma hue)`
- Example: `--background: oklch(1 0 0)` (pure white)
- Dark mode: `--background: oklch(0.145 0 0)` (near black)

**CSS Variables:**
- 18 semantic color variables (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, card, popover)
- Each has light and dark value
- Applied via Tailwind's color system: `bg-background`, `text-foreground`


### Dark Mode Implementation

**Theme Switching:**
- Managed by `next-themes` library
- Stored in localStorage as `"light"`, `"dark"`, or `"system"`
- System preference detected via `prefers-color-scheme` media query
- Class-based: adds `.dark` class to `<html>` tag

**CSS Selectors:**
- Light mode (default): `:root` selectors
- Dark mode: `.dark` selectors
- Custom variant in Tailwind: `@custom-variant dark (&:is(.dark *))`

**Shiki Code Theme:**
- Uses CSS custom properties: `--shiki-light`, `--shiki-dark`, `--shiki-light-bg`, `--shiki-dark-bg`
- JavaScript switches which properties are active based on `html.dark` class
- Both themes loaded in HTML, CSS toggles visibility

### Custom Scrollbar Styling

**Firefox:**
- `scrollbar-width: thin`
- `scrollbar-color: oklch(0.35 0 0) transparent`

**Webkit (Chrome, Safari, Edge):**
- `::-webkit-scrollbar` — 8px width/height
- `::-webkit-scrollbar-track` — transparent background
- `::-webkit-scrollbar-thumb` — dark gray, rounded, with hover states
- `::-webkit-scrollbar-thumb:hover` — lighter gray
- `::-webkit-scrollbar-thumb:active` — even lighter

### Accessibility

**Reduced Motion:**
- Media query: `@media (prefers-reduced-motion: reduce)`
- Sets all animations to `0.01ms` duration with 1 iteration
- Disables smooth scroll
- Critical for users with vestibular disorders

**Skip to Content Link:**
- `<a href="#main-content">` in layout.tsx (line 124-131)
- Uses `.sr-only` (screen reader only) class
- Becomes visible on focus
- Keyboard users can skip nav and jump to main content

**Keyboard Focus Indicators:**
- Button component has `focus-visible:ring` styles
- Tooltip has keyboard navigation support (Radix UI)
- Links have underline on focus

---

## 10. Performance Optimizations

### Image Optimization

**next/image usage:**
- All images use Next.js Image component
- Automatic WebP conversion
- Responsive srcset generation
- Lazy loading (except `priority` images like hero photo, first blog post)
- Defined sizes prop for better optimization hints

**Avatar images:**
- 128x128px on homepage (priority loading)
- 32px in blog cards/headers (lazy load)

**Project icons:**
- 32px in grids
- 96px on detail pages

**Blog cover images:**
- Max 800px wide
- Aspect ratio maintained
- Lazy load on listing, priority on detail page


### Bundle Optimization

**Tree-shaking:**
- Lucide icons: only imported icons included in bundle
- date-fns: only `format` and `parseISO` imported
- clsx + tailwind-merge combined in single `cn()` utility

**Code splitting:**
- Each page is separate chunk
- Dynamic imports: mermaid library only loaded when diagram encountered
- Client Components isolated: theme switcher, contribution graph, copy button

**Server Components (Zero JS):**
- All static content rendered as Server Components
- No JavaScript shipped for:
  - Homepage sections (intro, projects, experience, education, stack)
  - Blog listing
  - Blog post content (except copy button, mermaid)
  - Project detail pages
  - Header/footer

### Font Optimization

**Google Fonts:**
- Space Grotesk loaded via `next/font/google`
- Automatic font subsetting (only Latin characters)
- Font CSS inlined in `<head>`
- WOFF2 format (best compression)
- Font files cached immutably

### Scroll Performance

**Header scroll detection:**
- Uses `requestAnimationFrame` for throttling (lines 13-23 in `site-header.tsx`)
- Avoids layout thrashing
- `passive: true` event listener for better scroll performance

**Intersection Observer:**
- Not currently used, but contribution graph could benefit
- Could lazy-load GitHub API call until graph scrolled into view

### Build Performance

**Turbopack:**
- Next.js 15+ uses Turbopack (Rust-based bundler) instead of Webpack
- Faster dev server startup
- Faster hot module replacement (HMR)
- Enabled via `--turbopack` flag in package.json scripts

**Incremental Static Regeneration (ISR):**
- NOT used — all pages are pure SSG
- Could be enabled for blog posts to update without full rebuild
- Trade-off: slightly slower initial page load for fresher content

---

## 11. SEO Implementation

### Metadata API (Next.js 15)

**Static Metadata:**
- Defined in `layout.tsx` as exported `metadata` object
- Applied to all pages

**Dynamic Metadata:**
- `generateMetadata()` function in blog/project pages
- Returns page-specific title, description, Open Graph tags

**Title Template:**
- `template: "%s | Naved A. Sayyed"` in layout metadata
- Blog post "React Native Setup" → "React Native Setup | Naved A. Sayyed"

### Structured Data (JSON-LD)

**Homepage:**
- Person schema (line 27-48 in layout.tsx): name, jobTitle, email, address, social links, education
- Website schema (line 50-60): name, description, author
- ProfilePage schema (page.tsx line 12-28): mainEntity pointing to Person
- SoftwareSourceCode schema (page.tsx line 30-51): each project as separate entity

**Blog Listing:**
- BreadcrumbList schema (blog/page.tsx line 14-31)
- CollectionPage schema (line 33-54): lists all blog posts as ItemList

**Blog Post:**
- Article schema (blog/[slug]/page.tsx line 68-93): headline, author, publisher, datePublished, dateModified, keywords
- BreadcrumbList schema (line 95-116): Home > Blog > Post Title

**Project Pages:**
- No JSON-LD yet (weak spot)


### Open Graph & Twitter Cards

**All pages have:**
- `og:title`, `og:description`, `og:url`, `og:siteName`
- `og:image` (default: `/og-image.png`, 1200x630)
- `og:locale: "en_US"`
- `twitter:card: "summary_large_image"`

**Blog posts have:**
- Custom OG image from frontmatter (if provided)
- `og:type: "article"`
- `article:published_time`, `article:modified_time`
- `article:author` (developer name)

### Sitemap.xml

**Generated at:** `/sitemap.ts` (Next.js convention)

**Includes:**
- Homepage (priority 1.0, changefreq weekly)
- Blog listing (priority 0.8, monthly)
- All blog posts (priority 0.7, monthly)

**Updates:**
- Rebuilt on every deploy (static generation)
- Blog listing `lastModified` = most recent post date

### Robots.txt

**Generated at:** `/robots.ts`

**Rules:**
- Allow all crawlers by default
- Block AI training bots: GPTBot, ClaudeBot, CCBot, Amazonbot, Bytespider, meta-externalagent, Applebot-Extended
- Allow Google-Extended (Gemini AI Overviews)
- Sitemap reference: `https://navedsayyed.me/sitemap.xml`

### RSS Feed

**Location:** `/feed.xml` (route handler)

**Format:** RSS 2.0 with Atom namespace

**Includes:**
- Feed title, link, description, language, lastBuildDate
- Feed image (og-image.png)
- All published blog posts as items
- Each item: title, link, GUID, description, pubDate, author, categories (tags)

**Linked in:**
- `<link rel="alternate" type="application/rss+xml">` in layout metadata
- Blog page alternate link

---

## 12. Content Management Workflow

### Adding a New Blog Post

1. Create `blog-content/my-new-post.mdx`
2. Add YAML frontmatter:
   ```yaml
   ---
   title: "Post Title"
   description: "Short description"
   developer: "Naved A. Sayyed"
   date: "2026-03-20"
   published: true
   image: '/blog/my-post.webp'
   tags: ["React", "TypeScript"]
   ---
   ```
3. Write content in MDX (Markdown + JSX)
4. Add cover image to `/public/blog/my-post.webp`
5. Run `npm run build` — Next.js finds new file, generates static page
6. Deploy — new post appears in listing, RSS feed, sitemap

**No database, no CMS, no Git submodules.**


### Adding a New Project

1. Open `src/dev-constants/projects.ts`
2. Add new object to `ProjectsData` array:
   ```ts
   {
     icon: "/projects/my-project.png",
     title: "My Project",
     tagline: "One-line description",
     date: "2026-03-20",
     description: [
       "Bullet point 1",
       "Bullet point 2",
     ],
     liveLink: "https://example.com",
     repo: "https://github.com/user/repo",
     screenshots: [
       "/projects/my-project/ss-1.webp",
       "/projects/my-project/ss-2.webp",
     ],
     techStack: [
       { name: "React", icon: "/tech-icon/react.svg" },
       { name: "TypeScript", icon: "/tech-icon/typescript.svg" },
     ],
   }
   ```
3. Add project icon to `/public/projects/my-project.png`
4. Add screenshots to `/public/projects/my-project/ss-*.webp`
5. Run `npm run build` — generates `/projects/my-project` page
6. Deploy

**Array order matters:** Projects display in order defined in array (newest first convention).

### Updating Personal Info

Edit `src/dev-constants/details.ts`:
- Name, email, bio, avatar, resume link
- Social links (LinkedIn, GitHub, X, Instagram)
- Education history
- SEO metadata

Changes reflect across entire site (layout, homepage, blog headers, footer).

### Adding a Tech Stack Item

Edit `src/dev-constants/stack.ts`:
- Add object: `{ name: "Tool Name", icon: "/tech-icon/tool.svg", hasDarkIcon: false }`
- Add icon to `/public/tech-icon/tool.svg`
- If dark variant exists: add `/public/tech-icon/tool-dark.svg`, set `hasDarkIcon: true`

Appears in homepage stack grid.

### Updating Work Experience

Edit `src/dev-constants/experience.ts`:
- Add to `ExperienceData` array
- Fields: company, logo, designation, type, dates, isCurrent, description, skills
- If `isCurrent: true`, animated green dot appears

---

## 13. Third-Party Integrations

### GitHub GraphQL API

**Purpose:** Fetch contribution calendar data

**Authentication:** Personal Access Token (classic) with `read:user` scope

**Endpoint:** `https://api.github.com/graphql`

**Query:**
```graphql
user(login: "navedsayyed") {
  contributionsCollection(from: "...", to: "...") {
    contributionCalendar {
      weeks {
        contributionDays {
          date
          contributionCount
          contributionLevel
        }
      }
    }
  }
}
```

**Response Shape:**
- Array of weeks, each week has array of days
- Each day: ISO date, count (number), level (enum: NONE, FIRST_QUARTILE, etc.)
- Mapped to `{ date, count, level: 0-4 }` for display

**Rate Limits:**
- 5,000 points/hour with token
- This query costs ~1 point
- Cached for 1 hour, so max ~24 requests/day (once per unique visitor)

**Failure Modes:**
- 401 if token invalid → API returns 502 error
- 403 if rate limited → API returns 502 error
- Network timeout → API returns 502 error
- All failures show red error state in contribution graph


### Google Fonts

**Font:** Space Grotesk (variable font)

**Loading:** Via `next/font/google` API

**Benefits:**
- Self-hosted (not from Google CDN)
- No external request to Google servers (GDPR-friendly)
- Automatic subsetting (only Latin characters)
- Optimal font-display strategy

### Shiki (VS Code Themes)

**Purpose:** Syntax highlighting with accurate tokenization

**Themes Used:**
- Light: `github-light-default`
- Dark: `github-dark-default`

**Languages Supported:** 40+ (JavaScript, TypeScript, Python, Rust, Go, SQL, Bash, etc.)

**TextMate Grammars:**
- Shiki uses VS Code's language grammars (open source)
- No external CDN, bundled at build time
- Highlight generated server-side (HTML with inline styles)

### Radix UI Primitives

**Components Used:**
- Avatar (Root, Image, Fallback)
- Slot (for asChild pattern in Button)
- Tooltip (Root, Trigger, Content, Portal)

**Why Radix?**
- Unstyled (full design control)
- Accessible by default (ARIA, keyboard nav, focus management)
- Well-tested (used by shadcn/ui, Vercel, etc.)

**Bundle Size:**
- Tree-shakeable (only used components imported)
- Avatar: ~2kb
- Tooltip: ~5kb
- Slot: ~1kb

---

## 14. Development Experience

### Hot Module Replacement (HMR)

- Turbopack enables fast refresh
- Changes reflect in <200ms typically
- CSS changes instant (no page reload)
- Component changes preserve state (React Fast Refresh)

### Type Safety

**Strict TypeScript:**
- Catches undefined errors at compile time
- IntelliSense for all props, functions
- Path alias (@/*) auto-completes

**Type Inference:**
- Most types inferred (minimal manual typing)
- `DeveloperDetails` typed as `DeveloperConfig`
- `ProjectsData` typed as `Projects[]`
- MDX frontmatter typed as `BlogFrontmatter`

**Type Errors:**
- `npm run typecheck` runs TypeScript compiler
- Next.js build fails if type errors exist

### Linting & Formatting

**Biome (Rust-based):**
- Runs in ~50ms (vs 2-3s for ESLint+Prettier)
- Auto-fixes on save (VSCode extension)
- Organizes imports automatically

**Rules Configured:**
- 100 char line width
- 2 space indent
- Semicolons always
- Double quotes
- Trailing commas (ES5 style)


### Component Development

**Compound Components:**
- BlogCard uses compound component pattern (BlogCard.Image, BlogCard.Title, etc.)
- ExpandableSection uses same pattern
- Provides flexible composition without prop drilling

**Server vs Client:**
- Default: Server Component (no `"use client"`)
- Client only when needed: theme state, API calls, browser APIs, event handlers

**Styling Pattern:**
- `cn()` utility in every component for conditional classes
- Base classes + optional className prop
- Tailwind all the way (no CSS modules, no styled-components)

---

## 15. Key Takeaways for Interview

### What This Project Demonstrates

**Technical Skills:**
- Modern React patterns (Server Components, Client Components, hooks)
- TypeScript for type safety
- Next.js App Router (SSG, metadata API, route handlers)
- MDX for content-rich pages
- Tailwind for utility-first CSS
- Radix UI for accessible primitives
- API integration (GitHub GraphQL)
- SEO optimization (structured data, sitemap, robots.txt, Open Graph)
- Performance optimization (image loading, code splitting, caching)

**Architectural Decisions:**
- Static-first approach (zero runtime database)
- File-based content management (TypeScript constants + MDX)
- Minimal client-side JavaScript (Server Components default)
- Progressive enhancement (works without JS except contribution graph)
- Security headers (CSP, HSTS, XFO)
- Accessibility considerations (skip links, reduced motion, ARIA)

**Real-World Compromises:**
- Disabled accessibility lints to ship faster (technical debt)
- No tests (accepted risk for personal project)
- Hardcoded social link index (quick implementation)
- No error boundaries (not critical for static site)
- Token management left to developer (no onboarding flow)

**What You Should Be Able to Explain:**

1. **Why Server Components?** Reduces bundle size, improves initial page load, better SEO (fully rendered HTML).

2. **Why Static Generation?** Portfolio content rarely changes, no need for SSR overhead. Fast CDN delivery.

3. **Why Turbopack?** Faster dev experience, Next.js default for 15+.

4. **Why OKLCH colors?** More perceptually uniform than HSL, better for gradients and dark mode.

5. **Why no CMS?** File-based workflow is simpler for solo developer, Git tracks history, no external dependencies.

6. **Why Radix UI?** Accessible by default, unstyled (full design control), well-maintained.

7. **Why Biome over ESLint?** Much faster, single tool for lint+format, good enough for personal project.

8. **How does dark mode work?** next-themes manages state in localStorage, adds `.dark` class to html, CSS variables change based on class.

9. **How does MDX rendering work?** gray-matter parses frontmatter, next-mdx-remote compiles MDX to React at build time, custom components override default elements.

10. **How does code highlighting work?** Shiki uses TextMate grammars (VS Code's engine), generates HTML with inline styles server-side, dual theme via CSS custom properties.


---

## 16. Code Snippets Worth Memorizing

### Custom cn() Utility (src/lib/utils.ts)
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```
**Why it matters:** Combines conditional classes (clsx) with Tailwind deduplication (twMerge). Used in every component.

### MDX Options with Remark GFM (src/lib/markdown/mdx.ts)
```typescript
import remarkGfm from "remark-gfm";

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
  },
};
```
**Why it matters:** Enables GitHub Flavored Markdown features (tables, strikethrough) in blog posts.

### Button with Radix Slot (src/components/ui/button.tsx)
```tsx
import { Slot } from "@radix-ui/react-slot";

function Button({ asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
}

// Usage:
<Button asChild>
  <Link href="/blog">Blog</Link>
</Button>
```
**Why it matters:** Applies button styles to Link without wrapper div. Common shadcn pattern.

### Static Params Generation (src/app/blog/[slug]/page.tsx)
```typescript
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}
```
**Why it matters:** Tells Next.js which dynamic routes to pre-render at build time.

### Dual Theme Code Blocks (src/lib/markdown/code-block.tsx)
```typescript
const THEMES = {
  light: "github-light-default",
  dark: "github-dark-default",
} as const;

const html = await codeToHtml(code, {
  lang,
  themes: THEMES,
  defaultColor: false,
});
```
**Why it matters:** Generates HTML with both light/dark styles, CSS toggles visibility based on html.dark class.


### GitHub GraphQL Query (src/app/api/github-contributions/route.ts)
```typescript
const query = `
  query {
    user(login: "${USERNAME}") {
      contributionsCollection(from: "${from.toISOString()}", to: "${now.toISOString()}") {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query }),
});
```
**Why it matters:** Shows how to authenticate with GitHub GraphQL API and structure contribution query.

### Optimized Scroll Detection (src/components/layouts/site-header.tsx)
```typescript
useEffect(() => {
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 0);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```
**Why it matters:** Throttles scroll events with requestAnimationFrame to prevent layout thrashing. Passive listener improves scroll performance.

### Dynamic Mermaid Import (src/lib/markdown/mermaid-diagram.tsx)
```typescript
const renderDiagram = useCallback(async () => {
  const mermaid = (await import("mermaid")).default;
  mermaid.initialize({
    startOnLoad: false,
    theme: resolvedTheme === "dark" ? "dark" : "default",
  });
  const { svg } = await mermaid.render(safeId, code.trim());
  setSvg(svg);
}, [code, resolvedTheme]);
```
**Why it matters:** Lazy loads mermaid library only when diagram needed, re-renders on theme change.

### Next.js Security Headers (next.config.ts)
```typescript
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "Content-Security-Policy", value: "default-src 'self'; ..." },
      ],
    },
  ];
}
```
**Why it matters:** Hardens site against common web vulnerabilities (clickjacking, MIME sniffing, XSS).


---

## 17. Performance Metrics (Estimated)

### Lighthouse Score Expectations

**Performance: 95-100**
- Static HTML (no SSR delay)
- Optimized images (WebP, lazy load)
- Minimal JavaScript (Server Components)
- Font preloading

**Accessibility: 85-95**
- ARIA labels on buttons
- Semantic HTML (nav, main, article, section)
- Skip to content link
- Focus indicators
- **But:** Some a11y lints disabled (aria-invalid on buttons, missing keyboard handlers)

**Best Practices: 100**
- HTTPS only (HSTS header)
- Security headers (CSP, XFO, nosniff)
- No deprecated APIs
- No console errors

**SEO: 100**
- Meta descriptions on all pages
- Canonical URLs
- Structured data (JSON-LD)
- Sitemap
- Robots.txt
- Open Graph tags

### Bundle Size Breakdown

**Initial JavaScript (estimated):**
- React runtime: ~50kb gzipped
- Next.js client: ~80kb gzipped
- Shared UI components: ~20kb gzipped
- **Total: ~150kb gzipped**

**Per-Page JavaScript:**
- Homepage: +15kb (contribution graph, theme switcher)
- Blog listing: +5kb (minimal client JS)
- Blog post: +10kb (copy button, mermaid if used)
- Project page: +8kb (lightbox, if screenshots)

**CSS:**
- Tailwind (purged): ~15-20kb gzipped
- Custom styles: ~2kb gzipped
- **Total: ~22kb gzipped**

**Images (per page):**
- Homepage: ~150kb (avatar, project icons, tech stack icons)
- Blog post: ~50-200kb (cover image)
- Project page: ~300-500kb (screenshots)

### Load Time Targets (4G connection)

- **Time to First Byte (TTFB):** <200ms (CDN edge cache)
- **First Contentful Paint (FCP):** <1.5s
- **Largest Contentful Paint (LCP):** <2.5s
- **Cumulative Layout Shift (CLS):** <0.1 (no layout shifts)
- **Time to Interactive (TTI):** <3s


---

## 18. Future Improvements (Based on Code Review)

### High Priority

1. **Add Project Pages to Sitemap** — Currently missing from `generateSitemap()`
2. **Fix Social Link Hardcoding** — GitHubButtons uses `[1]` index, should use `.find()`
3. **Add Error Boundaries** — Wrap sections in error boundaries for graceful degradation
4. **Validate GITHUB_TOKEN at Build Time** — Fail build if token missing, not at runtime
5. **Add Fallback for Contribution Graph** — Show cached data or friendly message if API fails
6. **Implement Blog Post Schema Validation** — Use Zod to validate frontmatter structure
7. **Add Retry Button for Failed API Calls** — Better UX than silent red border

### Medium Priority

8. **Re-enable Accessibility Lints** — Fix issues, don't disable rules
9. **Add Analytics** — Vercel Analytics or Plausible for traffic insights
10. **Implement Search** — The `searchPosts()` function exists but unused
11. **Add Tests** — Unit tests for utilities, E2E tests for critical paths
12. **Stable Project Slugs** — Use ID field instead of title-based slugs
13. **Internationalization Support** — Add i18n framework for multi-language content
14. **Progressive Enhancement for Contribution Graph** — Detect JS disabled, show message

### Low Priority

15. **Add Image Dimensions Detection** — Read actual image sizes instead of hardcoded 800x400
16. **Implement Consistent Date Formatting** — Use date-fns everywhere, not mix of native API
17. **Add Link Validation** — CI job to check for broken external links
18. **Optimize Font Loading** — Use font-display: optional for faster initial render
19. **Add Reading Progress Bar** — Show scroll progress on long blog posts
20. **Implement View Transitions API** — Smooth page transitions when supported

---

## 19. Questions to Ask in an Interview

### About the Codebase

1. **"Why did you choose static generation over server-side rendering?"**  
   Answer: Content changes infrequently, no user-specific data, CDN caching best for performance.

2. **"What's the trade-off with disabling accessibility lints?"**  
   Answer: Shipped faster, but accumulated technical debt. Would fix in production app.

3. **"How would you scale this if you had 1,000 blog posts?"**  
   Answer: Pagination, search with Algolia/Pagefind, consider ISR for recent posts.

4. **"What's your strategy for handling MDX parsing errors?"**  
   Answer: Currently breaks build. Would add schema validation, better error messages.

5. **"Why Server Components by default?"**  
   Answer: Reduces JavaScript bundle, improves SEO, better initial page load. Only use Client Components when needed.

### About Trade-offs

6. **"What would you do differently if this was a team project?"**  
   Answer: Add tests, stricter linting, PR templates, conventional commits, error tracking.

7. **"How do you balance perfect code vs shipping quickly?"**  
   Answer: Personal project = bias toward shipping. Production = more rigorous testing/reviews.

8. **"What's the biggest technical debt in this project?"**  
   Answer: Disabled a11y lints, no tests, hardcoded indexes, missing error boundaries.


### About Architecture

9. **"Why file-based content instead of a CMS?"**  
   Answer: Solo developer, Git history tracking, no external dependencies, simple deployment.

10. **"How would you add user comments to blog posts?"**  
    Answer: Giscus (GitHub Discussions), Utterances (GitHub Issues), or Staticman (Git-based).

11. **"What happens if GitHub API rate limits you?"**  
    Answer: Contribution graph fails silently. Better solution: cache responses in edge storage.

12. **"How do you handle breaking changes in dependencies?"**  
    Answer: Lock files (pnpm-lock.yaml), test builds before deploy, read changelogs.

---

## 20. Final Summary

This is a well-structured, modern Next.js portfolio built with current best practices (App Router, Server Components, TypeScript, Tailwind). The architecture is solid: static generation for performance, file-based content for simplicity, minimal JavaScript for speed.

**Strengths:**
- Clean component structure (compound components, Server/Client separation)
- Strong SEO (metadata API, structured data, sitemap, Open Graph)
- Accessibility basics (skip links, semantic HTML, reduced motion)
- Performance optimizations (image loading, code splitting, caching)
- Security headers (CSP, HSTS, XFO)

**Weaknesses:**
- Technical debt from disabled lints (a11y rules bypassed)
- No tests, no error boundaries, no analytics
- Hardcoded assumptions (social link index, slug generation)
- Poor error handling (GitHub API failures)
- Missing features (search exists but unused)

**Overall:** This is a portfolio that shows competence with modern tools and pragmatic decision-making. The weak spots are honest implementation shortcuts, not fundamental architectural flaws. For a personal project, the trade-offs make sense. For a production app, you'd add testing, monitoring, better error handling, and stricter code quality.

**Interview Readiness:** You can now explain every technical choice, justify every dependency, trace data flow end-to-end, and discuss trade-offs confidently. The key is honesty: acknowledge the shortcuts, explain why you took them, and articulate what you'd do differently at scale.

---

**End of Technical Deep Dive**

*Last Updated: Based on codebase exploration completed on 2026-06-25*
