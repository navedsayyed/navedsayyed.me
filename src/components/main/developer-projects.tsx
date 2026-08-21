import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import ProjectNavigationLink from "@/components/main/project-navigation-link";
import {
  ExpandableSection,
  ExpandableSectionDescription,
  ExpandableSectionHeader,
  ExpandableSectionList,
  ExpandableSectionTitle,
} from "@/components/ui/extended/expandable-section";
import { ProjectsData } from "@/dev-constants/projects";
import { getProjectSlug } from "@/lib/project-utils";

const DeveloperProjects = () => {
  return (
    <ShellWrapper wide>
      <ExpandableSection className="px-2 py-10">
        <ExpandableSectionHeader className="mb-6 space-y-1">
          <ExpandableSectionTitle>Work</ExpandableSectionTitle>
          <ExpandableSectionDescription>
            Things I designed, built and put in front of users.
          </ExpandableSectionDescription>
        </ExpandableSectionHeader>

        <ExpandableSectionList className="space-y-0">
          {ProjectsData.map((project) => (
            <ProjectNavigationLink
              key={project.title}
              href={`/projects/${getProjectSlug(project)}`}
              className="group flex items-start justify-between gap-4 border-t py-5 transition-colors first:border-t-0 first:pt-0 hover:bg-muted/30"
            >
              {/* flex-1 is load-bearing: without it this box shrink-to-fits its widest line
                  (the tagline), so the year right-aligns to a different edge on every row. */}
              <div className="flex min-w-0 flex-1 gap-3.5">
                <div className="mt-0.5 flex aspect-square h-11 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  <Image
                    src={project.icon}
                    alt={`${project.title} project icon`}
                    width={36}
                    height={36}
                    sizes="36px"
                    className="h-9 w-9 rounded object-cover"
                    title={project.title}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Year sits on the title row so the tagline and tags below get the
                      full column width. */}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-[15px] font-medium text-foreground group-hover:underline">
                      {project.title}
                    </h3>
                    {project.date && (
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {new Date(project.date).getFullYear()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.slice(0, 4).map((tech) => (
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
            </ProjectNavigationLink>
          ))}
        </ExpandableSectionList>
      </ExpandableSection>
    </ShellWrapper>
  );
};

export default DeveloperProjects;
