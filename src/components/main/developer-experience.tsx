"use client";

import { DotIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import {
  ExpandableSection,
  ExpandableSectionContent,
  ExpandableSectionDescription,
  ExpandableSectionHeader,
  ExpandableSectionItem,
  ExpandableSectionList,
  ExpandableSectionTitle,
  ExpandableSectionTrigger,
} from "@/components/ui/extended/expandable-section";
import StackBadge from "@/components/ui/extended/stack-badge";
import { ExperienceData } from "@/dev-constants/experience";

const DeveloperExperience = () => {
  return (
    <ShellWrapper wide>
      <ExpandableSection className="px-2 py-10">
        <ExpandableSectionHeader className="mb-6 space-y-1">
          <ExpandableSectionTitle>Experience</ExpandableSectionTitle>
          <ExpandableSectionDescription>
            Roles and teams I&apos;ve shipped with.
          </ExpandableSectionDescription>
        </ExpandableSectionHeader>

        <ExpandableSectionList className="space-y-0">
          {ExperienceData.map((experience, index) => (
            <ExpandableSectionItem
              key={experience.company}
              className="relative border-t py-5 first:border-t-0 first:pt-0"
            >
              {/* Connecting line — runs from under the logo to the next item */}
              {index < ExperienceData.length - 1 && (
                <div className="absolute left-[22px] top-[68px] bottom-[-8px] w-px bg-border" />
              )}
              <ExpandableSectionTrigger className="items-start">
                <div className="flex min-w-0 flex-1 gap-3.5">
                  <div className="relative z-10 mt-0.5 flex aspect-square h-11 shrink-0 items-center justify-center rounded-lg border bg-muted">
                    <Image
                      src={experience.logo}
                      alt={`${experience.company} company logo`}
                      width={36}
                      height={36}
                      sizes="36px"
                      className="h-9 w-9 rounded object-cover"
                      title={experience.company}
                    />
                  </div>
                  {/*
                    The date belongs to the title row only. Keeping it as a sibling of the
                    whole text column made every line below it share the narrowed width,
                    which shredded long company names on mobile. flex-wrap lets it drop to
                    its own line when there genuinely isn't room.
                  */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-[15px] font-medium text-foreground">
                          {experience.company}
                        </h3>
                        {experience.isCurrent && (
                          <div className="relative flex h-3 w-3 items-center justify-center">
                            <motion.span
                              className="absolute h-full w-full rounded-full bg-emerald-400"
                              animate={{
                                scale: [1, 1.8, 1.8],
                                opacity: [0.7, 0, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeOut",
                              }}
                            />
                            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                          </div>
                        )}
                      </div>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {experience.startDate} — {experience.endDate}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {experience.designation} · {experience.type}
                    </p>
                  </div>
                </div>
              </ExpandableSectionTrigger>

              <ExpandableSectionContent>
                {experience.description.length > 0 && (
                  <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {experience.description.map((line) => (
                      <li key={line} className="flex">
                        <DotIcon />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {experience.skills && (
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill) => (
                      <StackBadge
                        key={skill.name}
                        name={skill.name}
                        icon={skill.icon}
                        hasDarkIcon={skill.hasDarkIcon}
                      />
                    ))}
                  </div>
                )}
              </ExpandableSectionContent>
            </ExpandableSectionItem>
          ))}
        </ExpandableSectionList>
      </ExpandableSection>
    </ShellWrapper>
  );
};

export default DeveloperExperience;
