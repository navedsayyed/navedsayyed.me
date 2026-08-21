import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DeveloperDetails } from "@/dev-constants/details";

const SiteFooter = () => {
  return (
    <footer className="w-full">
      <div className="mx-auto flex h-24 max-w-3xl items-center justify-between px-8 md:px-0">
        <div className="flex w-full flex-col items-center justify-center space-y-1">
          <p className="text-center text-lg font-medium">Naveddddd</p>
          <p className="text-sm text-muted-foreground text-center">
            Built by{" "}
            <Link
              href={
                DeveloperDetails.socialLinks.find((l) => l.name === "GitHub")?.url ??
                "https://github.com/navedsayyed"
              }
              className="hover:underline underline-offset-2 hover:text-primary transition-colors duration-300"
              title="Developer GitHub account"
            >
              navedsayyed
              <ArrowUpRight size={15} className="inline-block" />
            </Link>{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
