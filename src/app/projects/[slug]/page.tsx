import { existsSync } from "node:fs";
import { join } from "node:path";
import { DotIcon, Download, ExternalLink, FileText, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import PageShellWrapper, { HatchDivider } from "@/components/layouts/page-shell";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import { Button } from "@/components/ui/button";
import ScreenshotLightbox from "@/components/ui/extended/screenshot-lightbox";
import StackBadge from "@/components/ui/extended/stack-badge";
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
    <PageShellWrapper contentClassName="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Header — same hatched-bg pattern as BlogHeader */}
      <ShellWrapper>
        <header className="space-y-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-muted h-10 w-10 flex items-center justify-center border rounded-lg shrink-0">
                <Image
                  src={project.icon}
                  alt={`${project.title} icon`}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {project.title}
              </h1>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">{project.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 min-h-9">
            {hasActionLinks ? (
              <>
                {project.repo && (
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href={project.repo} target="_blank" rel="noreferrer noopener">
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </Link>
                  </Button>
                )}

                {project.liveLink && (
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href={project.liveLink} target="_blank" rel="noreferrer noopener">
                      <ExternalLink className="h-4 w-4" />
                      <span>Live Demo</span>
                    </Link>
                  </Button>
                )}

                {project.apkLink && (
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
                    <Link href={project.apkLink} target="_blank" rel="noreferrer noopener">
                      <Download className="h-4 w-4" />
                      <span>Download APK</span>
                    </Link>
                  </Button>
                )}

                {project.docsLink && (
                  <Button asChild variant="outline" size="sm" className="rounded-lg">
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
      <HatchDivider />

      {/* Cover block — commented out */}
      {/* <ShellWrapper>
        <div className="overflow-hidden bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]">
          <div className="max-h-96 mx-auto aspect-video border bg-background flex flex-col items-center justify-center gap-4">
            <Image
              src={project.icon}
              alt={`${project.title} cover`}
              width={96}
              height={96}
              className="h-24 w-24 rounded-xl object-cover"
            />
            <div className="text-center space-y-1">
              <p className="text-2xl font-bold text-foreground">{project.title}</p>
              <p className="text-sm text-muted-foreground">{project.tagline}</p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                {DeveloperDetails.portfolio.replace(/^https?:\/\//, "")}
              </p>
            </div>
          </div>
        </div>
      </ShellWrapper> */}

      {/* Screenshots */}
      {validScreenshots.length > 0 && (
        <ShellWrapper>
          <div className="p-2 space-y-3">
            <h2 className="text-xl font-medium text-foreground">Screenshots</h2>
            <ScreenshotLightbox screenshots={validScreenshots} projectTitle={project.title} />
          </div>
        </ShellWrapper>
      )}

      <HatchDivider />
      {/* Content — same pattern as blog article ShellWrapper */}
      <ShellWrapper>
        <article className="p-2 space-y-8">
          {/* About */}
          <section>
            <h2 className="text-xl font-medium text-foreground mb-3">About this project</h2>
            <ul className="space-y-2 text-base leading-relaxed text-muted-foreground text-justify">
              {project.description.map((line) => (
                <li key={line} className="flex gap-1">
                  <DotIcon className="shrink-0 mt-0.5" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
          {project.techStack && project.techStack.length > 0 && (
            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <StackBadge
                    key={tech.name}
                    name={tech.name}
                    icon={tech.icon}
                    hasDarkIcon={tech.hasDarkIcon}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Back links */}
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/projects">← All projects</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/">Back to portfolio</Link>
            </Button>
          </div>
        </article>
      </ShellWrapper>
    </PageShellWrapper>
  );
};

export default ProjectPage;
