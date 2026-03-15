import Image from "next/image";
import Link from "next/link";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import {
    ExpandableSection,
    ExpandableSectionDescription,
    ExpandableSectionHeader,
    ExpandableSectionLabel,
    ExpandableSectionList,
    ExpandableSectionTitle,
} from "@/components/ui/extended/expandable-section";
import { ArrowUpRight } from "lucide-react";
import { ProjectsData } from "@/dev-constants/projects";

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const DeveloperProjects = () => {
  return (
    <ShellWrapper>
      <ExpandableSection>
        <ExpandableSectionHeader>
          <ExpandableSectionLabel>My Work</ExpandableSectionLabel>
          <ExpandableSectionTitle>Projects I&apos;m proud of</ExpandableSectionTitle>
          <ExpandableSectionDescription>
            A snapshot of product-focused experiments and client work where I handled everything
            from UX flow to production deployment.
          </ExpandableSectionDescription>
        </ExpandableSectionHeader>

        <ExpandableSectionList>
          {ProjectsData.map((project) => (
            <Link
              key={project.title}
              href={`/projects/${toSlug(project.title)}`}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors group"
            >
              <div className="flex space-x-3 items-center">
                <div className="aspect-square bg-muted h-10 flex items-center justify-center border rounded shrink-0">
                  <Image
                    src={project.icon}
                    alt={`${project.title} project icon`}
                    width={32}
                    height={32}
                    sizes="32px"
                    className="h-8 w-8 rounded object-cover"
                    title={project.title}
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-medium text-foreground group-hover:underline">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.tagline}</p>
                </div>
              </div>
              <span className="text-muted-foreground shrink-0 pl-4 transition-colors group-hover:text-foreground">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          ))}
        </ExpandableSectionList>
      </ExpandableSection>
    </ShellWrapper>
  );
};

export default DeveloperProjects;
