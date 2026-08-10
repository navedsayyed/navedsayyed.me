"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const HOME_SCROLL_Y_KEY = "portfolio-home-scroll-y";
const HOME_SCROLL_Y_STATE_KEY = "__portfolioHomeScrollY";
const SHOULD_RESTORE_HOME_SCROLL_KEY = "portfolio-restore-home-scroll";
const SHOULD_RESTORE_HOME_SCROLL_STATE_KEY = "__portfolioRestoreHomeScroll";
const BLOG_PATH = "/blog";
const HOME_PATH = "/";
const PROJECT_PATH_PREFIX = "/projects/";

function isBlogPostPath(pathname: string) {
  return pathname.startsWith(`${BLOG_PATH}/`);
}

function shouldOpenFreshAtTop(pathname: string, previousPathname: string | null) {
  return (
    (pathname.startsWith(PROJECT_PATH_PREFIX) && previousPathname === HOME_PATH) ||
    (pathname === BLOG_PATH && previousPathname === HOME_PATH) ||
    (isBlogPostPath(pathname) && (previousPathname === HOME_PATH || previousPathname === BLOG_PATH))
  );
}

function shouldRestoreHome(pathname: string, previousPathname: string | null) {
  return (
    pathname === HOME_PATH &&
    Boolean(
      previousPathname?.startsWith(PROJECT_PATH_PREFIX) ||
        previousPathname === BLOG_PATH ||
        (previousPathname && isBlogPostPath(previousPathname))
    )
  );
}

function shouldRestoreBlog(pathname: string, previousPathname: string | null) {
  return pathname === BLOG_PATH && Boolean(previousPathname && isBlogPostPath(previousPathname));
}

function getStateScrollY() {
  try {
    const state = window.history.state as Record<string, unknown> | null;
    if (state?.[SHOULD_RESTORE_HOME_SCROLL_STATE_KEY] !== true) return Number.NaN;

    return Number(state[HOME_SCROLL_Y_STATE_KEY]);
  } catch {
    return Number.NaN;
  }
}

function removeStateRestoreFlag() {
  try {
    const state = window.history.state as Record<string, unknown> | null;
    if (!state?.[SHOULD_RESTORE_HOME_SCROLL_STATE_KEY]) return;

    const { [SHOULD_RESTORE_HOME_SCROLL_STATE_KEY]: _restoreFlag, ...nextState } = state;

    window.history.replaceState(nextState, "", window.location.href);
  } catch {
    // History state can be unavailable in embedded/sandboxed browser contexts.
  }
}

function instantScrollTo(top: number) {
  document.documentElement.dataset.scrollRestoring = "true";

  const stopRestoring = () => {
    delete document.documentElement.dataset.scrollRestoring;
  };
  const restore = () => window.scrollTo({ top, behavior: "auto" });
  const animationFrame = window.requestAnimationFrame(restore);
  const timeouts = [0, 50, 150, 300].map((delay) => window.setTimeout(restore, delay));
  const stopRestoringTimeout = window.setTimeout(stopRestoring, 450);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    window.clearTimeout(stopRestoringTimeout);
    timeouts.forEach(window.clearTimeout);
    stopRestoring();
  };
}

export function saveHomeScrollPosition() {
  const scrollY = window.scrollY;

  try {
    window.history.replaceState(
      {
        ...(window.history.state ?? {}),
        [HOME_SCROLL_Y_STATE_KEY]: scrollY,
        [SHOULD_RESTORE_HOME_SCROLL_STATE_KEY]: true,
      },
      "",
      window.location.href
    );
  } catch {
    // History state can be unavailable in embedded/sandboxed browser contexts.
  }

  try {
    window.sessionStorage.setItem(HOME_SCROLL_Y_KEY, String(scrollY));
    window.sessionStorage.setItem(SHOULD_RESTORE_HOME_SCROLL_KEY, "true");
  } catch {
    // Storage can be blocked in rare browser privacy modes; navigation should still work.
  }
}

const HomeScrollRestoration = () => {
  const pathname = usePathname();
  const previousPathnameRef = useRef<string | null>(null);
  const lastBlogScrollYRef = useRef(0);
  const lastHomeScrollYRef = useRef(0);

  useLayoutEffect(() => {
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    if (shouldOpenFreshAtTop(pathname, previousPathname)) {
      return instantScrollTo(0);
    }

    let savedScrollY = Number.NaN;

    if (shouldRestoreHome(pathname, previousPathname)) {
      savedScrollY = getStateScrollY();

      try {
        if (!Number.isFinite(savedScrollY)) {
          savedScrollY = Number(window.sessionStorage.getItem(HOME_SCROLL_Y_KEY));
        }
      } catch {
        savedScrollY = lastHomeScrollYRef.current;
      }

      removeStateRestoreFlag();
      try {
        window.sessionStorage.removeItem(SHOULD_RESTORE_HOME_SCROLL_KEY);
      } catch {}
    } else if (shouldRestoreBlog(pathname, previousPathname)) {
      savedScrollY = lastBlogScrollYRef.current;
    } else {
      return;
    }

    if (!Number.isFinite(savedScrollY)) return;

    return instantScrollTo(savedScrollY);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== HOME_PATH && pathname !== BLOG_PATH) return;

    const save = () => {
      if (pathname === HOME_PATH) {
        lastHomeScrollYRef.current = window.scrollY;
        saveHomeScrollPosition();
        return;
      }

      lastBlogScrollYRef.current = window.scrollY;
    };

    save();
    window.addEventListener("scroll", save, { passive: true });

    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [pathname]);

  return null;
};

export default HomeScrollRestoration;
