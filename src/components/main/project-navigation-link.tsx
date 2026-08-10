"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { saveHomeScrollPosition } from "@/components/main/home-scroll-restoration";

interface ProjectNavigationLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

const ProjectNavigationLink = ({ children, className, href }: ProjectNavigationLinkProps) => {
  return (
    <Link href={href} className={className} onClick={saveHomeScrollPosition} scroll={false}>
      {children}
    </Link>
  );
};

export default ProjectNavigationLink;
