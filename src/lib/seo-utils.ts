import type { MetadataRoute } from "next";
import { DeveloperDetails } from "@/dev-constants/details";
import { ProjectsData } from "@/dev-constants/projects";
import { getAllBlogPosts } from "@/lib/markdown";
import { getProjectSlug } from "@/lib/project-utils";

const normalizeSiteUrl = (url: string) => {
  return url.replace(/\/$/, "");
};

const SITE_LAUNCH_DATE = "2024-01-01";

export const generateSitemap = (): MetadataRoute.Sitemap => {
  const siteUrl = normalizeSiteUrl(DeveloperDetails.portfolio);

  const posts = getAllBlogPosts();

  const mostRecentPostDate = posts[0]?.frontmatter.date
    ? new Date(posts[0].frontmatter.date)
    : new Date(SITE_LAUNCH_DATE);

  const mostRecentProjectDate = ProjectsData.map((project) => project.date)
    .filter((date): date is string => Boolean(date))
    .sort()
    .reverse()[0];

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: mostRecentProjectDate ? new Date(mostRecentProjectDate) : new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: mostRecentPostDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const projectEntries: MetadataRoute.Sitemap = ProjectsData.map((project) => ({
    url: `${siteUrl}/projects/${getProjectSlug(project)}`,
    lastModified: project.date ? new Date(project.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.frontmatter.date ? new Date(post.frontmatter.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...projectEntries, ...postEntries];
};

export const generateRobots = (): MetadataRoute.Robots => {
  const siteUrl = normalizeSiteUrl(DeveloperDetails.portfolio);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        // Block AI training crawlers but allow Google-Extended for Gemini AI Overviews
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "Bytespider",
          "CCBot",
          "Amazonbot",
          "meta-externalagent",
          "Applebot-Extended",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
};

export const blogMetadata = () => {
  const siteUrl = normalizeSiteUrl(DeveloperDetails.portfolio);
  const ogImage = `${siteUrl}/og-image.png`;

  return {
    title: "Blog",
    description:
      "Technical articles on React, Next.js, TypeScript, and web development by Naved A. Sayyed. Tips, tutorials, and insights for developers.",
    keywords: [
      "Naved Sayyed Blog",
      "Web Development Blog",
      "React Tutorials",
      "Next.js Tips",
      "TypeScript Guide",
      "Developer Blog India",
      "Programming Articles",
    ],
    openGraph: {
      title: "Blog | Naved A. Sayyed",
      description:
        "Technical articles on React, Next.js, TypeScript, and web development by Naved A. Sayyed.",
      url: `${siteUrl}/blog`,
      siteName: DeveloperDetails.name,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Blog | Naved A. Sayyed",
        },
      ],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: "Blog | Naved A. Sayyed",
      description:
        "Technical articles on React, Next.js, TypeScript, and web development by Naved A. Sayyed.",
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteUrl}/blog`,
      types: {
        "application/rss+xml": `${siteUrl}/feed.xml`,
      },
    },
  };
};
