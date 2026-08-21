import ShellWrapper from "@/components/layouts/shell-wrapper";
import { DeveloperDetails } from "@/dev-constants/details";

export function BlogIntroduction() {
  const { name, designation } = DeveloperDetails;

  return (
    <ShellWrapper wide>
      <header className="space-y-2 px-2 pt-12 pb-10">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">
          Something worth reading.
        </h1>
        <p className="max-w-[68ch] text-[15px] leading-relaxed text-muted-foreground">
          Notes written by me, {name}, a {designation} — not generated. Mostly web and mobile
          development, the occasional design detour, and what I learned building the things on this
          site.
        </p>
      </header>
    </ShellWrapper>
  );
}

export default BlogIntroduction;
