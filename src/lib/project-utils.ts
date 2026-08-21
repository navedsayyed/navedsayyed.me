import { ProjectsData } from "@/dev-constants/projects";
import type { Projects } from "@/types";

export function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getProjectSlug(project: Pick<Projects, "title"> & { slug?: string }) {
  return project.slug ?? toSlug(project.title);
}

export function getProjectBySlug(slug: string) {
  return ProjectsData.find((project) => getProjectSlug(project) === slug);
}

export function getAllProjectSlugs() {
  return ProjectsData.map((project) => getProjectSlug(project));
}

/**
 * Resolve a slug ignoring case, so any casing variant of a project URL reaches the
 * project's canonical slug via a permanent redirect instead of 404ing. Works in both
 * directions: /projects/dotdays → /projects/DotDays, /projects/SnapToFix → /projects/snap2fix.
 */
export function getCanonicalProjectSlug(slug: string) {
  const match = ProjectsData.find(
    (project) => getProjectSlug(project).toLowerCase() === slug.toLowerCase()
  );
  return match ? getProjectSlug(match) : undefined;
}

/** Tech-stack names that are true programming languages, for schema.org SoftwareSourceCode. */
export const PROJECT_LANGUAGES = new Set([
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "JSON",
  "SQL",
  "Dart",
  "Kotlin",
  "C++",
]);
