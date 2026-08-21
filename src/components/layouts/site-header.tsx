"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GitHubButtons } from "@/components/ui/extended/github-buttons";
import ThemeSwitcher from "@/components/ui/extended/theme-switcher";

/** Opacity of the scrolled pill's outline. The header is chrome — the border should let you
 *  find its edge, not pull attention off the content. Raise toward 0.3 for a harder edge. */
const PILL_RING_ALPHA = 0.14;

const SiteHeader = () => {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // ── Scroll-driven interpolations (0px → 80px scroll range) ──
  const progress = useTransform(scrollY, [0, 80], [0, 1], { clamp: true });

  // Container shape
  const borderRadius = useTransform(progress, [0, 1], [0, 9999]);
  // 768 matches the homepage column (max-w-3xl) so the nav aligns with the content edge.
  const maxWidth = useTransform(progress, [0, 1], [768, 360]);

  // Floating offset
  const marginTop = useTransform(progress, [0, 1], [0, 10]);

  // Side inset is a static padding rather than a scroll-driven one: animating padding on a
  // full-width container relayouts it every frame, and maxWidth already carries the morph.

  // Shadow
  // A black shadow is near-invisible on the dark ground, so it carries the float in light
  // mode and the border does more of the work in dark. 0.3 keeps both readable.
  const shadowAlpha = useTransform(progress, [0, 1], [0, 0.3]);
  const boxShadow = useMotionTemplate`0 6px 24px rgba(0, 0, 0, ${shadowAlpha})`;

  // Pill outline fades in. --pill-ring-rgb is warm-tinted to match the ground, so the line
  // reads as part of the palette instead of a cold white halo.
  const borderAlpha = useTransform(progress, [0, 1], [0, PILL_RING_ALPHA]);
  const borderColor = useMotionTemplate`rgb(var(--pill-ring-rgb) / ${borderAlpha})`;

  // Bottom edge: a full-width divider at rest, converging on the pill's own alpha once the
  // pill forms. It used to animate to 0, which left the scrolled pill bordered on three sides.
  const bottomBorderAlpha = useTransform(progress, [0, 1], [0.1, PILL_RING_ALPHA]);
  const bottomBorderColor = useMotionTemplate`rgb(var(--pill-ring-rgb) / ${bottomBorderAlpha})`;

  // Arrow icon fade-out
  const arrowOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const arrowScale = useTransform(progress, [0, 0.5], [1, 0.5]);

  return (
    <div className="sticky top-0 z-50">
      <motion.div className="flex justify-center px-4" style={{ y: marginTop }}>
        <motion.header
          className="flex items-center justify-between gap-3 bg-background/95 mx-auto w-full px-4 h-14"
          style={{
            borderRadius,
            maxWidth,
            boxShadow,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor,
            borderBottomColor: bottomBorderColor,
            willChange: "max-width, transform",
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
              scroll={false}
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
