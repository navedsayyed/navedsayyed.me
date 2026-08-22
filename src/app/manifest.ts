import type { MetadataRoute } from "next";
import { DeveloperDetails } from "@/dev-constants/details";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: DeveloperDetails.name,
    short_name: DeveloperDetails.initials,
    description: DeveloperDetails.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      // Must match icon.png on disk. It is 192 because Google only accepts a favicon that is a
      // square multiple of 48px, and 192 is also Chrome's minimum for PWA installability.
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
