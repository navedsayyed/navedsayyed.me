import { ArrowUpRight, FileText, Mail } from "lucide-react";
import Link from "next/link";
import ShellWrapper from "@/components/layouts/shell-wrapper";
import { Button } from "@/components/ui/button";
import ThemedIcon from "@/components/ui/extended/themed-icon";
import { DeveloperDetails } from "@/dev-constants/details";

const DeveloperConnect = () => {
  const SocialLinks = DeveloperDetails.socialLinks;
  return (
    <>
      <ShellWrapper wide>
        <div className="px-2 py-10">
          <header className="mb-6 space-y-1">
            <h2 className="text-2xl font-medium tracking-tight text-foreground">Connect</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Every link here stays in sync with my latest work.
            </p>
          </header>

          <div className="grid grid-cols-2 border *:border-r *:border-b [&>*:nth-child(2n)]:border-r-0 [&>*:nth-last-child(-n+2)]:border-b-0">
            {Object.entries(SocialLinks).map(([key, link]) => (
              <Link
                key={key}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Open ${link.handle} on ${key}`}
                className="flex items-center gap-2 group"
              >
                <span className="flex size-12 items-center justify-center border-r border-dashed">
                  <ThemedIcon
                    src={link.icon}
                    alt={link.handle}
                    size={32}
                    hasDarkVariant={link.hasDarkIcon}
                    className="size-8"
                    title={`Open ${link.handle} on ${link.name}`}
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-foreground">{link.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{link.handle}</span>
                </div>
                <div className="text-muted-foreground transition-colors group-hover:text-foreground">
                  <ArrowUpRight className="size-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ShellWrapper>
      <ShellWrapper wide>
        <div className="mb-14 space-y-4 rounded-lg border bg-muted/30 p-5">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-foreground">Prefer a direct line?</h2>
            <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
              Email lands straight in my inbox, and my resume is kept current.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DeveloperDetails.email && (
              <Button asChild size="sm" className="rounded-md">
                <Link href={`mailto:${DeveloperDetails.email}`}>
                  <Mail className="size-4" />
                  Email
                </Link>
              </Button>
            )}
            {DeveloperDetails.resume && (
              <Button variant="outline" asChild size="sm" className="rounded-md">
                <Link href={DeveloperDetails.resume} target="_blank" rel="noreferrer noopener">
                  <FileText className="size-4" />
                  Resume
                </Link>
              </Button>
            )}
          </div>
        </div>
      </ShellWrapper>
    </>
  );
};

export default DeveloperConnect;
