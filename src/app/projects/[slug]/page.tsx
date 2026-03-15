import { Calendar, DotIcon, Github, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShellWrapper from "@/components/layouts/page-shell";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import StackBadge from "@/components/ui/extended/stack-badge";
import { DeveloperDetails } from "@/dev-constants/details";
import { ProjectsData } from "@/dev-constants/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateStaticParams() {
  return ProjectsData.map((project) => ({ slug: toSlug(project.title) }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = ProjectsData.find((p) => toSlug(p.title) === slug);
  if (!project) return { title: "Project Not Found" };

  const siteUrl = DeveloperDetails.portfolio.replace(/\/$/, "");
  return {
    title: `${project.title} | ${DeveloperDetails.name}`,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      url: `${siteUrl}/projects/${slug}`,
      siteName: DeveloperDetails.name,
    },
    alternates: { canonical: `${siteUrl}/projects/${slug}` },
  };
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const { slug } = await params;
  const project = ProjectsData.find((p) => toSlug(p.title) === slug);

  if (!project) notFound();

  return (
    <PageShellWrapper>
      {/* Header — same hatched-bg pattern as BlogHeader */}
      <ShellWrapper>
        <header className="space-y-3 p-2 bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]">
          <div className="flex items-start gap-4">
            <div className="aspect-square bg-muted h-12 flex items-center justify-center border rounded shrink-0">
              <Image
                src={project.icon}
                alt={`${project.title} icon`}
                width={40}
                height={40}
                className="h-10 w-10 rounded object-cover"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                {project.title}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">{project.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-6 w-6 border">
                <AvatarImage
                  src={DeveloperDetails.avatar}
                  alt={`${DeveloperDetails.name} avatar`}
                />
                <AvatarFallback>{DeveloperDetails.initials}</AvatarFallback>
              </Avatar>
              <span>{DeveloperDetails.name}</span>
            </div>

            {project.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={project.date}>
                  {new Date(project.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}

            {project.liveLink && (
              <Link
                href={project.liveLink}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>Live Site</span>
              </Link>
            )}

            {project.repo && (
              <Link
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>Source Code</span>
              </Link>
            )}
          </div>
        </header>
      </ShellWrapper>

      {/* Cover block — same as blog's cover image ShellWrapper */}
      <ShellWrapper>
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
      </ShellWrapper>

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

          {/* Tech Stack */}
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

          {/* Back link */}
          <div>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href="/">← Back to Portfolio</Link>
            </Button>
          </div>
        </article>
      </ShellWrapper>
    </PageShellWrapper>
  );
};

export default ProjectPage;
