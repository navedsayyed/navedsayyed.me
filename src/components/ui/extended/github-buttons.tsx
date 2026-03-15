"use client";

import { Button } from "@/components/ui/button";
import ThemedIcon from "@/components/ui/extended/themed-icon";
import { DeveloperDetails } from "@/dev-constants/details";

export const GitHubButtons = () => {
  const handleClick = () => {
    window.open(DeveloperDetails.socialLinks[1].url, "_blank");
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={handleClick}
      aria-label="View GitHub profile"
      title="GitHub"
    >
      <ThemedIcon
        src="/social/github.svg"
        alt="GitHub"
        size={20}
        hasDarkVariant
        className="h-5 w-5"
      />
    </Button>
  );
};
