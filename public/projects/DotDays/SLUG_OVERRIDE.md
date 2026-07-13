# DotDays — Custom URL Slug Override

## Why this exists

The DotDays project URL is `/projects/DotDays` (with capital D's) instead of the default
auto-generated `/projects/dotdays` (all lowercase).

**Reason:** The URL `https://navedsayyed.me/projects/DotDays` was already printed on my
resume and I cannot update the resume. So the website URL had to match what's on the resume.

## What was changed (4 files)

### 1. `src/types/index.ts`
Added an optional `slug` field to the `Projects` interface:
```ts
export interface Projects {
  icon: string;
  title: string;
  tagline: string;
  slug?: string;   // ← THIS LINE WAS ADDED
  date?: string;
  // ...
}
```

### 2. `src/dev-constants/projects.ts`
Set `slug: "DotDays"` on the DotDays project entry:
```ts
{
  icon: "/projects/DotDays.png",
  title: "DotDays",
  slug: "DotDays",   // ← THIS LINE WAS ADDED
  tagline: "Time-Visualization Wallpaper App",
  // ...
}
```

### 3. `src/app/projects/[slug]/page.tsx`
Added a `getProjectSlug` helper and updated 3 places to use it:
```ts
// THIS FUNCTION WAS ADDED (after the existing toSlug function):
function getProjectSlug(project: { slug?: string; title: string }) {
  return project.slug ?? toSlug(project.title);
}

// THESE 3 LINES WERE CHANGED from toSlug(p.title) → getProjectSlug(p):
// 1. generateStaticParams
return ProjectsData.map((project) => ({ slug: getProjectSlug(project) }));

// 2. generateMetadata
const project = ProjectsData.find((p) => getProjectSlug(p) === slug);

// 3. ProjectPage component
const project = ProjectsData.find((p) => getProjectSlug(p) === slug);
```

### 4. `src/components/main/developer-projects.tsx`
Added the same `getProjectSlug` helper and updated the link:
```ts
// THIS FUNCTION WAS ADDED:
function getProjectSlug(project: { slug?: string; title: string }) {
  return project.slug ?? toSlug(project.title);
}

// THIS LINE WAS CHANGED from toSlug(project.title) → getProjectSlug(project):
href={`/projects/${getProjectSlug(project)}`}
```

## How other projects are affected

**They are NOT affected.** The `slug` field is optional. If a project does NOT have a
`slug` set, the system falls back to `toSlug(project.title)` which is the original
behavior (lowercase, hyphenated). Only DotDays has `slug: "DotDays"` set.

## How to UNDO this (revert to /projects/dotdays)

If in the future you update your resume and no longer need the capital-letter URL,
follow these steps to revert:

### Step 1: Remove `slug` from DotDays in `src/dev-constants/projects.ts`
Delete this line:
```diff
  {
    icon: "/projects/DotDays.png",
    title: "DotDays",
-   slug: "DotDays",
    tagline: "Time-Visualization Wallpaper App",
```

### Step 2 (Optional cleanup): Remove slug from types in `src/types/index.ts`
Only do this if NO other project uses `slug`:
```diff
  export interface Projects {
    icon: string;
    title: string;
    tagline: string;
-   slug?: string;
    date?: string;
```

### Step 3 (Optional cleanup): Revert `page.tsx` and `developer-projects.tsx`
In both files, you can:
1. Delete the `getProjectSlug` function
2. Replace `getProjectSlug(project)` / `getProjectSlug(p)` back to `toSlug(project.title)` / `toSlug(p.title)`

Or just leave them — they work fine even without any slug overrides since
`getProjectSlug` falls back to `toSlug()` automatically.

### Step 4: Delete this file
Delete `public/projects/DotDays/SLUG_OVERRIDE.md` — it's only documentation.

---

**Date created:** 2026-07-13
**Reason:** Resume already has `https://navedsayyed.me/projects/DotDays` printed on it.
