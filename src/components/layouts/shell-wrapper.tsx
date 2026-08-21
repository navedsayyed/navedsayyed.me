import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * `wide` opts a section into the roomier homepage column (48rem). Reading surfaces —
 * blog posts, project write-ups — stay at 42rem, where line length is the constraint.
 *
 * The two hairlines are tagged data-shell-rule so a `bare` PageShellWrapper can hide
 * them without every section needing to know about it.
 */
const ShellWrapper = ({
  children,
  wide = false,
  className,
}: {
  children: ReactNode;
  wide?: boolean;
  className?: string;
}) => {
  return (
    <section className="relative isolate w-full overflow-visible">
      <div
        data-shell-rule
        className="pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-(--pattern-fg)"
      />
      <div
        data-shell-rule
        className="pointer-events-none absolute left-1/2 bottom-0 h-px w-screen -translate-x-1/2 bg-(--pattern-fg)"
      />
      <div
        className={cn(
          "relative mx-auto flex w-full flex-col gap-8",
          wide ? "max-w-3xl" : "max-w-2xl",
          className
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default ShellWrapper;
