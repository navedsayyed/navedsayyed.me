# DotDays — custom URL slug override

Personal note. Not published — this lives in `docs/`, which Next.js does not serve. It used to
sit in `public/projects/DotDays/`, where it was reachable at
`navedsayyed.me/projects/DotDays/SLUG_OVERRIDE.md`.

## Why this exists

DotDays lives at `/projects/DotDays` with capital D's, not the auto-generated
`/projects/dotdays`. That exact URL is printed on my resume, so the site has to match it.

## How it works now

Slug resolution lives in one place: **`src/lib/project-utils.ts`**.

```ts
toSlug(title)              // "COSA - Website" -> "cosa-website"
getProjectSlug(project)    // project.slug ?? toSlug(project.title)
getProjectBySlug(slug)     // exact match
getCanonicalProjectSlug(s) // case-insensitive match -> the canonical slug
```

`src/dev-constants/projects.ts` sets the override:

```ts
{
  title: "DotDays",
  // Canonical casing is intentional — this exact URL is printed on the resume.
  slug: "DotDays",
}
```

Everything that needs a project URL — `generateStaticParams`, `generateMetadata`, the sitemap,
the homepage Work list, the `/projects` index — calls `getProjectSlug`. Nothing hardcodes a slug.

## Wrong casing doesn't 404

`src/app/projects/[slug]/page.tsx` falls back to a case-insensitive lookup and issues a
permanent redirect:

```ts
if (!project) {
  const canonicalSlug = getCanonicalProjectSlug(slug);
  if (canonicalSlug) permanentRedirect(`/projects/${canonicalSlug}`);
  notFound();
}
```

So `/projects/dotdays` → **308** → `/projects/DotDays`, while `/projects/DotDays` serves
directly with no redirect hop. Works in both directions for every project.

This is deliberately *not* a rule in `next.config.ts`: `source` matching there is
case-insensitive, so such a rule would also match its own destination and redirect in a loop.

## One gotcha: Open Graph filenames

Vercel's filesystem is case-sensitive. Per-project OG cards in `public/projects/og/` are always
named in **lowercase**, and the page looks them up with `slug.toLowerCase()`:

```ts
const ogFile = `${slug.toLowerCase()}.png`;   // DotDays -> dotdays.png
```

Without that, `DotDays.png` would silently fail to resolve on Vercel and fall back to the
generic site OG image — while still working locally on Windows, which is case-insensitive.

## To revert (once the resume is updated)

1. Delete `slug: "DotDays"` from the DotDays entry in `src/dev-constants/projects.ts`.
   The slug becomes `dotdays`, and `getCanonicalProjectSlug` starts redirecting the
   capitalised URL to the lowercase one instead — old resume links keep working.
2. Nothing else needs touching. `slug` is optional and other projects don't set it.
3. Optionally rename `public/projects/og/dotdays.png` — it's already lowercase, so it keeps
   resolving either way.

---

Created 2026-07-13. Rewritten 2026-08-21, when slug handling moved into `lib/project-utils.ts`
and the file moved out of `public/`.
