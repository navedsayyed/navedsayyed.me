import { BlogsGrid } from "@/components/blog/blogs-grid";
import PageShellWrapper from "@/components/layouts/page-shell";
import DeveloperConnect from "@/components/main/developer-connect";
import DeveloperEducation from "@/components/main/developer-education";
import DeveloperExperience from "@/components/main/developer-experience";
import DeveloperGitContribution from "@/components/main/developer-git-contribution";
import DeveloperIntro from "@/components/main/developer-intro";
import DeveloperProjects from "@/components/main/developer-projects";
import DeveloperStack from "@/components/main/developer-stack";
import { DeveloperDetails } from "@/dev-constants/details";
import { ProjectsData } from "@/dev-constants/projects";
import { getRecentPosts } from "@/lib/markdown";

const siteUrl = DeveloperDetails.portfolio.replace(/\/$/, "");

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: siteUrl,
  dateCreated: "2024-01-01T00:00:00.000Z",
  dateModified: new Date().toISOString(),
  inLanguage: "en",
  mainEntity: {
    "@type": "Person",
    name: DeveloperDetails.name,
    url: siteUrl,
    image: `${siteUrl}${DeveloperDetails.avatar}`,
    jobTitle: DeveloperDetails.designation,
    description: DeveloperDetails.bio,
    sameAs: DeveloperDetails.socialLinks.map((link) => link.url),
  },
};

const PROGRAMMING_LANGUAGES = new Set([
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "JSON",
  "SQL",
]);

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@graph": ProjectsData.map((project) => ({
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.tagline,
    url: project.liveLink,
    ...(project.repo ? { codeRepository: project.repo } : {}),
    programmingLanguage: project.techStack
      .map((tech) => tech.name)
      .filter((name) => PROGRAMMING_LANGUAGES.has(name)),
    runtimePlatform: project.techStack
      .map((tech) => tech.name)
      .filter((name) => !PROGRAMMING_LANGUAGES.has(name)),
    author: {
      "@type": "Person",
      name: DeveloperDetails.name,
      url: siteUrl,
    },
  })),
};

const Page = () => {
  const recentPosts = getRecentPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      {/*
        Sections are separated by their own hairline rules and vertical rhythm now.
        A HatchDivider between every one made the frame louder than the content.
      */}
      <PageShellWrapper bare contentClassName="flex flex-col">
        <DeveloperIntro />
        <DeveloperProjects />
        <DeveloperExperience />
        <DeveloperEducation />
        <DeveloperGitContribution />
        <DeveloperStack />
        <BlogsGrid maxPosts={4} posts={recentPosts} wide />
        <DeveloperConnect />
      </PageShellWrapper>
    </>
  );
};

export default Page;
