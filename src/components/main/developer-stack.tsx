import ThemedIcon from "@/components/ui/extended/themed-icon";
import { TechStackGroups } from "@/dev-constants/stack";
import ShellWrapper from "../layouts/shell-wrapper";

const DeveloperStack = () => {
  return (
    <ShellWrapper wide>
      <div className="px-2 py-10">
        <header className="mb-6 space-y-1">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">Stack</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            What I reach for, day to day — grouped by where it sits in the stack.
          </p>
        </header>

        <div className="space-y-5">
          {TechStackGroups.map((group) => (
            <div
              key={group.label}
              className="grid gap-x-5 gap-y-2 sm:grid-cols-[8rem_minmax(0,1fr)]"
            >
              <h3 className="pt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={`${group.label}-${item.name}`}
                    className="inline-flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 text-xs text-foreground/80 transition-colors hover:border-foreground/25 hover:text-foreground"
                  >
                    {item.icon && (
                      <ThemedIcon
                        src={item.icon}
                        alt=""
                        size={16}
                        hasDarkVariant={item.hasDarkIcon}
                        className="size-3.5 shrink-0 rounded-[3px]"
                      />
                    )}
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </ShellWrapper>
  );
};

export default DeveloperStack;
