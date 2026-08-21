import { GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import { DeveloperDetails } from "@/dev-constants/details";

const DeveloperEducation = () => {
  const educationData = DeveloperDetails.education;

  return (
    <ShellWrapper wide>
      <div className="px-2 py-10">
        <header className="mb-6 space-y-1">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">Education</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Where I studied, and what I studied there.
          </p>
        </header>

        <div className="flex flex-col">
          {educationData.map((education, index) => (
            <div
              key={education.institution}
              className="relative border-t py-5 first:border-t-0 first:pt-0"
            >
              {/* Connecting line */}
              {index < educationData.length - 1 && (
                <div className="absolute left-[22px] top-[68px] bottom-[-8px] w-px bg-border" />
              )}
              <div className="flex min-w-0 gap-3.5">
                <div className="relative z-10 mt-0.5 flex aspect-square h-11 shrink-0 items-center justify-center rounded-lg border bg-muted">
                  {education.logo ? (
                    <Image
                      src={education.logo}
                      alt={`${education.institution} logo`}
                      width={36}
                      height={36}
                      sizes="36px"
                      className="h-9 w-9 rounded object-contain"
                      title={education.institution}
                    />
                  ) : (
                    <GraduationCap className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Date pairs with the institution name only, so the lines under it
                      keep the full column width. */}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="text-[15px] font-medium text-foreground">
                      {education.institution}
                    </h3>
                    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {education.startDate} — {education.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{education.degree}</p>
                  <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="mt-[3px] size-3.5 shrink-0" />
                    <span>{education.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ShellWrapper>
  );
};

export default DeveloperEducation;
