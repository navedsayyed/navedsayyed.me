import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShellWrapper from "@/components/layouts/page-shell";
import ShellWrapper from "@/components/layouts/shell-wrapper";
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
      <PageShellWrapper bare contentClassName="flex flex-col">
        <ShellWrapper wide>
          <header className="space-y-2 px-2 pt-12 pb-8">
            <h1 className="text-3xl font-medium tracking-tight text-foreground">Projects</h1>
            <p className="max-w-[68ch] text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          </header>
        </ShellWrapper>

        <ShellWrapper wide>
          <div className="px-2 pb-16">
            {ProjectsData.map((project) => (
              <Link
                key={project.title}
                href={`/projects/${getProjectSlug(project)}`}
                className="group flex items-start justify-between gap-4 border-t py-5 transition-colors first:border-t-0 first:pt-0 hover:bg-muted/30"
              >
                <div className="flex min-w-0 flex-1 gap-3.5">
                  <div className="mt-0.5 flex aspect-square h-11 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Image
                      src={project.icon}
                      alt={`${project.title} project icon`}
                      width={36}
                      height={36}
                      sizes="36px"
                      className="h-9 w-9 rounded object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h2 className="text-[15px] font-medium text-foreground group-hover:underline">
                        {project.title}
                      </h2>
                      {project.date && (
                        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                          {new Date(project.date).getFullYear()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {project.tagline}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span
                          key={tech.name}
                          className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              </Link>
            ))}
          </div>
        </ShellWrapper>
      </PageShellWrapper>
    </>
  );
};

export default ProjectsPage;
