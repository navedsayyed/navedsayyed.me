import { existsSync } from "node:fs";
import { join } from "node:path";
import { Download, ExternalLink, FileText, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import PageShellWrapper from "@/components/layouts/page-shell";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import { Button } from "@/components/ui/button";
import ScreenshotLightbox from "@/components/ui/extended/screenshot-lightbox";
import ThemedIcon from "@/components/ui/extended/themed-icon";
import { DeveloperDetails } from "@/dev-constants/details";
import { ProjectsData } from "@/dev-constants/projects";
import {
  getCanonicalProjectSlug,
  getProjectBySlug,
  getProjectSlug,
  PROJECT_LANGUAGES,
} from "@/lib/project-utils";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

function filterExistingScreenshots(screenshots: string[] | undefined) {
  if (!screenshots || screenshots.length === 0) return [];
  return screenshots.filter((src) => {
    const relativePath = src.replace(/^\//, "");
    const fullPath = join(process.cwd(), "public", relativePath);
    return existsSync(fullPath);
  });
}

export async function generateStaticParams() {
  return ProjectsData.map((project) => ({ slug: getProjectSlug(project) }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const siteUrl = DeveloperDetails.portfolio.replace(/\/$/, "");
  const projectUrl = `${siteUrl}/projects/${slug}`;
  // OG card filenames are always lowercase, independent of slug casing — Vercel's
  // filesystem is case-sensitive, so `DotDays.png` would not resolve to `dotdays.png`.
  const ogFile = `${slug.toLowerCase()}.png`;
  const ogPath = join(process.cwd(), "public", "projects", "og", ogFile);
  const ogImage = existsSync(ogPath)
    ? `${siteUrl}/projects/og/${ogFile}`
    : `${siteUrl}/og-image.png`;

  const stack = project.techStack.map((tech) => tech.name);
  const description = `${project.tagline}. Built by ${DeveloperDetails.name} with ${stack
    .slice(0, 5)
    .join(", ")}.`;

  return {
    // Bare title — the root layout template appends "| Naved A. Sayyed"
    title: project.title,
    description,
    keywords: [project.title, ...stack, "Naved A. Sayyed", "portfolio project"],
    openGraph: {
      title: `${project.title} — ${project.tagline}`,
      description,
      url: projectUrl,
      siteName: DeveloperDetails.name,
      type: "article",
      images: [
        { url: ogImage, width: 1200, height: 630, alt: `${project.title} — ${project.tagline}` },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${project.title} — ${project.tagline}`,
      description,
      images: [ogImage],
    },
    alternates: { canonical: projectUrl },
  };
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    // Wrong-cased URL (e.g. /projects/dotdays) → the project's canonical slug.
    const canonicalSlug = getCanonicalProjectSlug(slug);
    if (canonicalSlug) permanentRedirect(`/projects/${canonicalSlug}`);
    notFound();
  }

  const validScreenshots = filterExistingScreenshots(project.screenshots);
  const hasActionLinks = Boolean(
    project.repo || project.liveLink || project.apkLink || project.docsLink
  );

  const siteUrl = DeveloperDetails.portfolio.replace(/\/$/, "");
  const projectUrl = `${siteUrl}/projects/${slug}`;

  const currentIndex = ProjectsData.findIndex((p) => getProjectSlug(p) === slug);
  const previousProject = currentIndex > 0 ? ProjectsData[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < ProjectsData.length - 1
      ? ProjectsData[currentIndex + 1]
      : null;

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    headline: `${project.title} — ${project.tagline}`,
    description: project.description.join(" "),
    abstract: project.tagline,
    url: projectUrl,
    image: `${siteUrl}${project.icon}`,
    inLanguage: "en",
    ...(project.date ? { dateCreated: project.date } : {}),
    ...(project.repo ? { codeRepository: project.repo } : {}),
    ...(project.liveLink ? { targetProduct: { "@type": "WebSite", url: project.liveLink } } : {}),
    programmingLanguage: project.techStack
      .map((tech) => tech.name)
      .filter((name) => PROJECT_LANGUAGES.has(name)),
    runtimePlatform: project.techStack
      .map((tech) => tech.name)
      .filter((name) => !PROJECT_LANGUAGES.has(name)),
    author: {
      "@type": "Person",
      name: DeveloperDetails.name,
      url: siteUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
    ],
  };

  return (
    <PageShellWrapper bare contentClassName="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ShellWrapper wide>
        <header className="space-y-4 px-2 pt-12 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-muted">
                <Image
                  src={project.icon}
                  alt={`${project.title} icon`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded object-cover"
                />
              </div>
              <h1 className="min-w-0 text-3xl font-medium tracking-tight text-foreground">
                {project.title}
              </h1>
            </div>
            <p className="max-w-[68ch] text-[15px] leading-relaxed text-muted-foreground">
              {project.tagline}
            </p>
          </div>

          {/* Spec strip — the facts someone scans for before reading anything. */}
          <dl className="flex flex-wrap gap-x-8 gap-y-3 border-y py-3">
            {project.date && (
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Year
                </dt>
                <dd className="mt-0.5 font-mono text-sm tabular-nums text-foreground">
                  {new Date(project.date).getFullYear()}
                </dd>
              </div>
            )}
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Stack
              </dt>
              <dd className="mt-0.5 text-sm text-foreground">
                {project.techStack.length} technologies
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Source
              </dt>
              <dd className="mt-0.5 text-sm text-foreground">
                {project.repo ? "Public" : "Private"}
              </dd>
            </div>
          </dl>

          <div className="flex min-h-9 flex-wrap items-center gap-2 pt-1">
            {hasActionLinks ? (
              <>
                {project.repo && (
                  <Button asChild variant="outline" size="sm" className="rounded-md">
                    <Link href={project.repo} target="_blank" rel="noreferrer noopener">
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </Link>
                  </Button>
                )}

                {project.liveLink && (
                  <Button asChild variant="outline" size="sm" className="rounded-md">
                    <Link href={project.liveLink} target="_blank" rel="noreferrer noopener">
                      <ExternalLink className="h-4 w-4" />
                      <span>Live Demo</span>
                    </Link>
                  </Button>
                )}

                {project.apkLink && (
                  <Button asChild variant="outline" size="sm" className="rounded-md">
                    <Link href={project.apkLink} target="_blank" rel="noreferrer noopener">
                      <Download className="h-4 w-4" />
                      <span>Download APK</span>
                    </Link>
                  </Button>
                )}

                {project.docsLink && (
                  <Button asChild variant="outline" size="sm" className="rounded-md">
                    <Link href={project.docsLink} target="_blank" rel="noreferrer noopener">
                      <FileText className="h-4 w-4" />
                      <span>Docs</span>
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <span className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm text-muted-foreground">
                Private / No public links
              </span>
            )}
          </div>
        </header>
      </ShellWrapper>

      <ShellWrapper wide>
        <article className="space-y-10 px-2 pb-12">
          {/* Prose before pictures — the screenshots mean more once you know what it does. */}
          <section>
            <h2 className="mb-4 text-2xl font-medium tracking-tight text-foreground">
              About this project
            </h2>
            <ul className="space-y-3">
              {project.description.map((line) => (
                <li
                  key={line}
                  className="relative pl-5 text-[15px] leading-[1.7] text-muted-foreground before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/50"
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>

          {project.techStack && project.techStack.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-medium tracking-tight text-foreground">
                Tech stack
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech.name}
                    className="inline-flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 text-xs text-foreground/80"
                  >
                    <ThemedIcon
                      src={tech.icon}
                      alt=""
                      size={16}
                      hasDarkVariant={tech.hasDarkIcon}
                      className="size-3.5 shrink-0 rounded-[3px]"
                    />
                    {tech.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {validScreenshots.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-medium tracking-tight text-foreground">
                Screenshots
              </h2>
              <ScreenshotLightbox screenshots={validScreenshots} projectTitle={project.title} />
            </section>
          )}
        </article>
      </ShellWrapper>

      {/* Adjacent projects — a dead end here sends people back to the tab bar. */}
      <ShellWrapper wide>
        <nav aria-label="More projects" className="px-2 pb-16">
          <div className="grid gap-3 border-t pt-6 sm:grid-cols-2">
            {[previousProject, nextProject].map((adjacent, index) =>
              adjacent ? (
                <Link
                  key={adjacent.title}
                  href={`/projects/${getProjectSlug(adjacent)}`}
                  className={`group rounded-lg border p-4 transition-colors hover:bg-muted/40 ${
                    index === 1 ? "sm:text-right" : ""
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {index === 0 ? "← Previous" : "Next →"}
                  </span>
                  <p className="mt-1 text-[15px] font-medium text-foreground group-hover:underline">
                    {adjacent.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{adjacent.tagline}</p>
                </Link>
              ) : (
                <div key={`empty-${index === 0 ? "prev" : "next"}`} className="hidden sm:block" />
              )
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-md">
              <Link href="/projects">All projects</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-md">
              <Link href="/">Back to portfolio</Link>
            </Button>
          </div>
        </nav>
      </ShellWrapper>
    </PageShellWrapper>
  );
};

export default ProjectPage;
