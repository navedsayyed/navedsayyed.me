import ShellWrapper from "@/components/layouts/shell-wrapper";

// this will get removed once i have enough blogs
export const NoMoreBlogs = () => {
  return (
    <ShellWrapper wide>
      <div className="px-2 pb-16">
        <div className="flex min-h-28 flex-col items-center justify-center space-y-1.5 rounded-lg border bg-muted/30 p-6 text-center">
          <h2 className="text-lg font-medium text-foreground">That&apos;s everything, for now.</h2>
          <p className="text-sm text-muted-foreground">
            More on the way — I write these as I build.
          </p>
        </div>
      </div>
    </ShellWrapper>
  );
};
