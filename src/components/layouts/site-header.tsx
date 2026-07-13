"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GitHubButtons } from "@/components/ui/extended/github-buttons";
import ThemeSwitcher from "@/components/ui/extended/theme-switcher";

const SiteHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  // ── Scroll-driven interpolations (0px → 80px scroll range) ──
  const progress = useTransform(scrollY, [0, 80], [0, 1], { clamp: true });

  // Container shape
  const borderRadius = useTransform(progress, [0, 1], [0, 9999]);
  const maxWidth = useTransform(progress, [0, 1], [672, 340]);
  const height = useTransform(progress, [0, 1], [56, 44]);

  // Floating offset
  const marginTop = useTransform(progress, [0, 1], [0, 10]);

  // Shadow
  const shadowAlpha = useTransform(progress, [0, 1], [0, 0.12]);
  const boxShadow = useMotionTemplate`0 8px 32px rgba(0, 0, 0, ${shadowAlpha})`;

  // Border opacity (pill border fades in)
  const borderAlpha = useTransform(progress, [0, 1], [0, 0.15]);
  const borderColor = useMotionTemplate`rgba(128, 128, 128, ${borderAlpha})`;

  // Bottom border (fades out as pill forms)
  const bottomBorderAlpha = useTransform(progress, [0, 1], [0.15, 0]);
  const bottomBorderColor = useMotionTemplate`rgba(128, 128, 128, ${bottomBorderAlpha})`;

  // Text sizing
  const fontSize = useTransform(progress, [0, 1], [18, 14]);
  const navFontSize = useTransform(progress, [0, 1], [14, 13]);

  // Arrow icon fade-out
  const arrowOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const arrowScale = useTransform(progress, [0, 0.5], [1, 0.5]);

  // Nav gap
  const navGap = useTransform(progress, [0, 1], [8, 2]);

  return (
    <div className="sticky top-0 z-50">
      <motion.div
        className="flex justify-center"
        style={{ paddingTop: marginTop }}
      >
        <motion.header
          className="flex items-center justify-between bg-background/90 backdrop-blur-xl mx-auto w-full px-8 md:px-4"
          style={{
            borderRadius,
            maxWidth,
            height,
            boxShadow,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor,
            borderBottomColor: bottomBorderColor,
          }}
        >
          {/* Back + Logo */}
          <div className="flex items-center shrink-0 gap-1">
            {!isHome && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full size-9"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </Button>
            )}
            {isHome && (
              <Link href="/" className="flex items-center">
                <motion.span
                  className="font-medium inline-block"
                  style={{ fontSize }}
                >
                  Naveddddd.
                </motion.span>
              </Link>
            )}
          </div>

          {/* Nav */}
          <motion.nav
            aria-label="Main navigation"
            className="flex items-center"
            style={{ gap: navGap }}
          >
            <Link
              href="/blog"
              className="flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              <motion.span style={{ fontSize: navFontSize }}>blog</motion.span>
              <motion.span
                style={{ opacity: arrowOpacity, scale: arrowScale }}
                className="inline-flex"
              >
                <ArrowUpRight size={16} />
              </motion.span>
            </Link>
            <GitHubButtons />
            <ThemeSwitcher />
          </motion.nav>
        </motion.header>
      </motion.div>
    </div>
  );
};

export default SiteHeader;
