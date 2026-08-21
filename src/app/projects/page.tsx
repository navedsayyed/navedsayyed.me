import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShellWrapper, { HatchDivider } from "@/components/layouts/page-shell";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import StackBadge from "@/components/ui/extended/stack-badge";
import { DeveloperDetails } from "@/dev-constants/details";
import { ProjectsData } from "@/dev-constants/projects";
import { getProjectSlug } from "@/lib/project-utils";

const siteUrl = DeveloperDetails.portfolio.replace(/\/$/, "");

const description = `Full-stack and mobile projects built by ${DeveloperDetails.name} — complaint management systems, music streaming apps, AI-powered platforms and more, using React, Next.js, React Native, TypeScript and Supabase.`;

export const metadata: Metadata = {
  title: "Projects",
  description,
  keywords: [
    "Naved A. Sayyed projects",
    "React Native projects",
    "Next.js projects",
    "Full Stack Developer portfolio",
    "React developer projects India",
    ...ProjectsData.map((project) => project.title),
  ],
  openGraph: {
    title: `Projects | ${DeveloperDetails.name}`,
    description,
    url: `${siteUrl}/projects`,
    siteName: DeveloperDetails.name,
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `Projects by ${DeveloperDetails.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${DeveloperDetails.name}`,
    description,
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: { canonical: `${siteUrl}/projects` },
};

const ProjectsPage = () => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Projects | ${DeveloperDetails.name}`,
    description,
    url: `${siteUrl}/projects`,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: DeveloperDetails.name,
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: ProjectsData.length,
      itemListElement: ProjectsData.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        description: project.tagline,
        item: `${siteUrl}/projects/${getProjectSlug(project)}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <PageShellWrapper contentClassName="flex flex-col">
        <ShellWrapper>
          <header className="space-y-2 p-4">
            <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground">My Work</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Projects
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
          </header>
        </ShellWrapper>

        <HatchDivider />

        <ShellWrapper>
          <div className="space-y-3 p-2">
            {ProjectsData.map((project) => (
              <Link
                key={project.title}
                href={`/projects/${getProjectSlug(project)}`}
                className="group block rounded-md border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="flex aspect-square h-10 shrink-0 items-center justify-center rounded border bg-muted">
                      <Image
                        src={project.icon}
                        alt={`${project.title} project icon`}
                        width={32}
                        height={32}
                        sizes="32px"
                        className="h-8 w-8 rounded object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <h2 className="text-base font-medium text-foreground group-hover:underline">
                          {project.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">{project.tagline}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <StackBadge
                            key={tech.name}
                            name={tech.name}
                            icon={tech.icon}
                            hasDarkIcon={tech.hasDarkIcon}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ShellWrapper>
      </PageShellWrapper>
    </>
  );
};

export default ProjectsPage;
