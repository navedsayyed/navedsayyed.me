import ShellWrapper from "@/components/layouts/shell-wrapper";

// this will get removed once i have enough blogs
export const NoMoreBlogs = () => {
  return (
    <ShellWrapper>
      <div className="p-2 bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]">
        <div className="flex flex-col items-center justify-center min-h-28 text-center space-y-2">
          <h2 className="text-2xl font-medium text-foreground">
            Ok Got it, you loved reading all of my blogs!
          </h2>
          <p className="text-base text-muted-foreground">
            I need to speed up my writings, to make you happy.
          </p>
        </div>
      </div>
    </ShellWrapper>
  );
};
