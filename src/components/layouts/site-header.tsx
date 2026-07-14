"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GitHubButtons } from "@/components/ui/extended/github-buttons";
import ThemeSwitcher from "@/components/ui/extended/theme-switcher";

const SiteHeader = () => {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // ── Scroll-driven interpolations (0px → 80px scroll range) ──
  const progress = useTransform(scrollY, [0, 80], [0, 1], { clamp: true });

  // Container shape
  const borderRadius = useTransform(progress, [0, 1], [0, 9999]);
  const maxWidth = useTransform(progress, [0, 1], [672, 360]);

  // Floating offset
  const marginTop = useTransform(progress, [0, 1], [0, 10]);

  // Side shrink (for small screens where maxWidth doesn't help)
  const sideMargin = useTransform(progress, [0, 1], [0, 16]);

  // Shadow
  const shadowAlpha = useTransform(progress, [0, 1], [0, 0.12]);
  const boxShadow = useMotionTemplate`0 8px 32px rgba(0, 0, 0, ${shadowAlpha})`;

  // Border opacity (pill border fades in)
  const borderAlpha = useTransform(progress, [0, 1], [0, 0.15]);
  const borderColor = useMotionTemplate`rgba(128, 128, 128, ${borderAlpha})`;

  // Bottom border (fades out as pill forms)
  const bottomBorderAlpha = useTransform(progress, [0, 1], [0.15, 0]);
  const bottomBorderColor = useMotionTemplate`rgba(128, 128, 128, ${bottomBorderAlpha})`;

  // Arrow icon fade-out
  const arrowOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const arrowScale = useTransform(progress, [0, 0.5], [1, 0.5]);

  return (
    <div className="sticky top-0 z-50">
      <motion.div
        className="flex justify-center will-change-transform"
        style={{ y: marginTop, paddingLeft: sideMargin, paddingRight: sideMargin }}
      >
        <motion.header
          className="flex items-center justify-between gap-3 bg-background/90 backdrop-blur-xl mx-auto w-full px-4 h-14 will-change-[max-width,border-radius]"
          style={{
            borderRadius,
            maxWidth,
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
                className="rounded-full size-9 shrink-0"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </Button>
            )}
            {isHome && (
              <Link href="/" className="flex items-center shrink-0">
                <span className="font-medium inline-block text-lg">Naveddddd.</span>
              </Link>
            )}
          </div>

          {/* Nav */}
          <nav aria-label="Main navigation" className="flex items-center gap-2 shrink-0">
            <Link
              href="/blog"
              className="flex items-center justify-center text-muted-foreground hover:text-primary transition-colors duration-500 shrink-0 rounded-sm"
            >
              <span className="text-sm">blog</span>
              <motion.span
                style={{ opacity: arrowOpacity, scale: arrowScale }}
                className="inline-flex"
              >
                <ArrowUpRight size={16} />
              </motion.span>
            </Link>
            <GitHubButtons />
            <ThemeSwitcher />
          </nav>
        </motion.header>
      </motion.div>
    </div>
  );
};

export default SiteHeader;
