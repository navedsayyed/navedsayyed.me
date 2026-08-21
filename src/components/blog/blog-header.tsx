import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeveloperDetails } from "@/dev-constants/details";
import type { BlogFrontmatter } from "@/lib/markdown/mdx";

interface BlogHeaderProps {
  frontmatter: BlogFrontmatter;
  readingTime: string;
}

export function BlogHeader({ frontmatter, readingTime }: BlogHeaderProps) {
  return (
    <ShellWrapper>
      <header className="space-y-4 px-2 pt-12 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium leading-[1.2] tracking-tight text-foreground">
            {frontmatter.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {frontmatter.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Avatar className="h-6 w-6 border">
              <AvatarImage src={DeveloperDetails.avatar} alt={`${DeveloperDetails.name} avatar`} />
              <AvatarFallback>{DeveloperDetails.initials}</AvatarFallback>
            </Avatar>
            <span>{DeveloperDetails.name}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <time
              dateTime={frontmatter.date}
              className="font-mono text-xs tabular-nums"
              suppressHydrationWarning
            >
              {new Date(frontmatter.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">{readingTime}</span>
          </div>
        </div>

        {frontmatter.image && (
          <Image
            src={frontmatter.image}
            width={800}
            height={450}
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            alt={`Cover image for ${frontmatter.title}`}
            title={frontmatter.title}
            className="mt-2 aspect-video w-full rounded-lg border object-cover"
          />
        )}
      </header>
    </ShellWrapper>
  );
}
