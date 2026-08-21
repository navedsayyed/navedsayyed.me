"use client";

import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import {
  type Activity,
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/ui/extended/contribution-graph";
import {
  ExpandableSection,
  ExpandableSectionDescription,
  ExpandableSectionHeader,
  ExpandableSectionList,
  ExpandableSectionTitle,
} from "@/components/ui/extended/expandable-section";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const legendLevelClasses = [
  "bg-[#ebedf0] dark:bg-[#161b22]",
  "bg-[#9be9a8] dark:bg-[#0e4429]",
  "bg-[#40c463] dark:bg-[#006d32]",
  "bg-[#30a14e] dark:bg-[#26a641]",
  "bg-[#216e39] dark:bg-[#39d353]",
];

const fetchContributions = async (): Promise<{ data: Activity[]; total: number }> => {
  const response = await fetch("/api/github-contributions");

  if (!response.ok) {
    throw new Error(`Failed to load contributions: ${response.status}`);
  }

  return response.json();
};

const DeveloperGitContribution = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const { data, total } = await fetchContributions();

        if (isActive) {
          setActivities(data);
          setTotalCount(total);
        }
      } catch (err) {
        console.error("Error fetching GitHub contributions", err);

        if (isActive) {
          setError("Unable to load contribution activity right now.");
          setActivities([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoading) {
    return (
      <ShellWrapper wide>
        <div className="px-2 py-10">
          <div className="h-[11.9rem] animate-pulse rounded-lg border bg-muted/40" />
        </div>
      </ShellWrapper>
    );
  }

  // Nothing to show beats a broken-looking placeholder — the graph is supporting detail,
  // not something the page depends on.
  if (error || activities.length === 0) return null;

  return (
    <ShellWrapper wide>
      <ExpandableSection className="px-2 py-10">
        <ExpandableSectionHeader className="mb-6 space-y-1">
          <ExpandableSectionTitle>Contributions</ExpandableSectionTitle>
          <ExpandableSectionDescription>
            A year of commits, at a glance.
          </ExpandableSectionDescription>
        </ExpandableSectionHeader>

        <ExpandableSectionList>
          <ContributionGraph
            data={activities}
            totalCount={totalCount}
            className="p-2"
            labels={{ totalCount: "{{count}} activities in past 12 months" }}
          >
            <ContributionGraphCalendar scrollToEnd>
              {({ activity, dayIndex, weekIndex }) => (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ContributionGraphBlock
                      activity={activity}
                      className={cn(
                        "cursor-pointer",
                        'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
                        'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                        'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                        'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                        'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]'
                      )}
                      dayIndex={dayIndex}
                      weekIndex={weekIndex}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="font-medium">{activity.count} contributions</span>
                    <span> on </span>
                    <span>{format(parseISO(activity.date), "MMM d, yyyy")}</span>
                  </TooltipContent>
                </Tooltip>
              )}
            </ContributionGraphCalendar>
            <ContributionGraphFooter>
              <ContributionGraphTotalCount />
              <ContributionGraphLegend>
                {({ level }) => (
                  <div
                    className="group relative flex h-3 w-3 items-center justify-center"
                    data-level={level}
                  >
                    <div
                      className={cn(
                        "h-full w-full rounded border border-border",
                        legendLevelClasses[level] ?? legendLevelClasses[0]
                      )}
                    />
                    <span className="-top-8 absolute hidden rounded bg-popover px-2 py-1 text-popover-foreground text-xs shadow-md group-hover:block">
                      Level {level}
                    </span>
                  </div>
                )}
              </ContributionGraphLegend>
            </ContributionGraphFooter>
          </ContributionGraph>
        </ExpandableSectionList>
      </ExpandableSection>
    </ShellWrapper>
  );
};

export default DeveloperGitContribution;
