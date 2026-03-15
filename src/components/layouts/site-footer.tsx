import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DeveloperDetails } from "@/dev-constants/details";

const SiteFooter = () => {
  return (
    <footer className="w-full">
      <div className="flex h-24 px-8 md:px-0 max-w-2xl mx-auto items-center justify-between">
        <div className="flex flex-col items-center justify-center w-full space-y-1">
          <p className="font-medium text-lg text-center">Naveddddd</p>
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
