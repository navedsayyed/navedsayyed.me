import { existsSync } from "node:fs";
import { join } from "node:path";
import { DotIcon, Download, ExternalLink, FileText, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import PageShellWrapper from "@/components/layouts/page-shell";
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
              <div className="min-w-0">
                <h1 className="text-3xl font-medium tracking-tight text-foreground">
                  {project.title}
                </h1>
                {project.date && (
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {new Date(project.date).getFullYear()}
                  </span>
                )}
              </div>
            </div>
            <p className="max-w-[68ch] text-[15px] leading-relaxed text-muted-foreground">
              {project.tagline}
            </p>
          </div>

          <div className="flex min-h-9 flex-wrap items-center gap-2 pt-1">
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

      {/* Screenshots */}
      {validScreenshots.length > 0 && (
        <ShellWrapper wide>
          <div className="space-y-3 px-2 pb-10">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">Screenshots</h2>
            <ScreenshotLightbox screenshots={validScreenshots} projectTitle={project.title} />
          </div>
        </ShellWrapper>
      )}

      <ShellWrapper wide>
        <article className="space-y-8 px-2 pb-16">
          {/* About */}
          <section>
            <h2 className="mb-3 text-2xl font-medium tracking-tight text-foreground">
              About this project
            </h2>
            <ul className="space-y-2 text-[15px] leading-relaxed text-muted-foreground">
              {project.description.map((line) => (
                <li key={line} className="flex gap-1">
                  <DotIcon className="mt-0.5 shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
          {project.techStack && project.techStack.length > 0 && (
            <section>
              <h2 className="mb-3 text-2xl font-medium tracking-tight text-foreground">
                Tech stack
              </h2>
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
          <div className="flex flex-wrap gap-2 border-t pt-6">
            <Button asChild variant="outline" size="sm" className="rounded-md">
              <Link href="/projects">← All projects</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-md">
              <Link href="/">Back to portfolio</Link>
            </Button>
          </div>
        </article>
      </ShellWrapper>
    </PageShellWrapper>
  );
};

export default ProjectPage;
