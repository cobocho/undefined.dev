/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  FileSearchCorner,
  Folder,
  Home,
  Moon,
  Sun,
  Undo2,
  UserRoundSearch,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTheme } from "./theme-provider";

type RouteMatcher = string | RegExp | ((pathname: string) => boolean);

const hideOnRoutes: RouteMatcher[] = ["/post"];

function matchRoute(pathname: string, matcher: RouteMatcher) {
  if (typeof matcher === "string") return pathname.startsWith(matcher);
  if (matcher instanceof RegExp) return matcher.test(pathname);
  return matcher(pathname);
}

const tabs = [
  { href: "/search", icon: FileSearchCorner, match: (p: string) => p === "/search" },
  { href: "/category", icon: Folder, match: (p: string) => p.startsWith("/category") },
  { href: "/", icon: Home, match: (p: string) => p === "/" },
  { href: "/about", icon: UserRoundSearch, match: (p: string) => p === "/about" },
] as const;

const TAB_WIDTH = 56;
const TAB_GAP = 8;
const TAB_STEP = TAB_WIDTH + TAB_GAP;
const DRAG_THRESHOLD = 6;

/**
 * Navigate by creating a real <a> click so PageTransition can intercept it.
 */
function navigateTo(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function MobileBottomTab() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Track previous pathname for back navigation
  const prevPathname = useRef<string | null>(null);
  useEffect(() => {
    return () => { prevPathname.current = pathname; };
  }, [pathname]);

  // --- Scroll hide logic ---
  const enableHideByScroll = useMemo(() => {
    return hideOnRoutes.some((m) => matchRoute(pathname, m));
  }, [pathname]);

  const [isHidden, setIsHidden] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    setIsHidden(false);
    lastYRef.current = window.scrollY ?? 0;
  }, [pathname]);

  useEffect(() => {
    if (!enableHideByScroll) {
      setIsHidden(false);
      return;
    }

    const threshold = 8;
    lastYRef.current = window.scrollY ?? 0;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY ?? 0;
        const delta = currentY - lastYRef.current;

        if (Math.abs(delta) < threshold) {
          tickingRef.current = false;
          return;
        }

        if (delta > 0) setIsHidden(true);
        else setIsHidden(false);

        lastYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enableHideByScroll]);

  // --- Tab indicator ---
  const activeIndex = useMemo(() => {
    const idx = tabs.findIndex((t) => t.match(pathname));
    return idx >= 0 ? idx : 2;
  }, [pathname]);

  const indicatorX = useMotionValue(activeIndex * TAB_STEP);
  const springX = useSpring(indicatorX, { stiffness: 400, damping: 30 });

  const indicatorScale = useMotionValue(1);
  const springScale = useSpring(indicatorScale, { stiffness: 400, damping: 25 });

  useEffect(() => {
    indicatorX.set(activeIndex * TAB_STEP);
  }, [activeIndex, indicatorX]);

  // Per-tab icon scale and opacity
  const tabScales = tabs.map((_, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(springX, (x) => {
      const dist = Math.abs(x - i * TAB_STEP);
      return 1 + 0.2 * Math.max(0, 1 - dist / (TAB_STEP * 2));
    });
  });

  const tabOpacities = tabs.map((_, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(springX, (x) => {
      const dist = Math.abs(x - i * TAB_STEP);
      return 0.55 + 0.45 * Math.max(0, 1 - dist / TAB_STEP);
    });
  });

  // --- Unified touch handling on container ---
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const startIndicatorIndex = useRef(0);
  const hasDragged = useRef(false);
  const touchedTabIndex = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      startIndicatorIndex.current = indicatorX.get() / TAB_STEP;
      hasDragged.current = false;

      // Check if touch is on a tab icon
      touchedTabIndex.current = null;
      for (let i = 0; i < tabRefs.current.length; i++) {
        const el = tabRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
          ) {
            touchedTabIndex.current = i;
            // Move indicator to touched tab immediately
            indicatorX.set(i * TAB_STEP);
            startIndicatorIndex.current = i;
            break;
          }
        }
      }
    },
    [indicatorX],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const dx = e.touches[0].clientX - touchStartX.current;

      if (!hasDragged.current && Math.abs(dx) > DRAG_THRESHOLD) {
        hasDragged.current = true;
        indicatorScale.set(1.15);
      }

      if (!hasDragged.current) return;

      const indexOffset = dx / TAB_STEP;
      const rawIndex = startIndicatorIndex.current + indexOffset;
      const clampedIndex = Math.max(0, Math.min(tabs.length - 1, rawIndex));
      indicatorX.set(clampedIndex * TAB_STEP);
    },
    [indicatorX, indicatorScale],
  );

  const handleTouchEnd = useCallback(() => {
    indicatorScale.set(1);

    if (hasDragged.current) {
      // Drag ended — snap to nearest tab
      const currentX = indicatorX.get();
      const nearestIndex = Math.round(currentX / TAB_STEP);
      const clampedIndex = Math.max(0, Math.min(tabs.length - 1, nearestIndex));
      indicatorX.set(clampedIndex * TAB_STEP);

      if (tabs[clampedIndex].href !== pathname) {
        navigateTo(tabs[clampedIndex].href);
      }
    } else if (touchedTabIndex.current !== null) {
      const i = touchedTabIndex.current;
      const isPostPage = pathname.startsWith("/post");

      if (isPostPage && tabs[i].href === "/") {
        // On post page, Undo2 button: go back if previous page was internal, else home
        if (prevPathname.current && !prevPathname.current.startsWith("/post")) {
          document.dispatchEvent(new Event("transition-back"));
        } else {
          navigateTo("/");
        }
      } else if (tabs[i].href !== pathname) {
        navigateTo(tabs[i].href);
      }
    }

    touchedTabIndex.current = null;
  }, [pathname, indicatorX, indicatorScale]);

  return (
    <AnimatePresence>
      <motion.nav
        initial={false}
        animate={{ y: isHidden ? 120 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center px-4 pb-4 md:hidden"
        aria-label="Mobile bottom navigation"
      >
        {/* Outer glass container */}
        <div
          className="relative mx-auto flex w-fit items-center overflow-hidden rounded-[28px] border border-white/50 bg-white/60 p-1.5 backdrop-blur-xl dark:border-white/12 dark:bg-white/10"
          style={{
            backdropFilter: "blur(20px) contrast(80%) saturate(120%)",
            WebkitBackdropFilter: "blur(20px) contrast(80%) saturate(120%)",
            boxShadow: `
              0 2px 8px rgba(0,0,0,0.06),
              0 8px 32px rgba(0,0,0,0.04),
              inset 10px 10px 20px rgba(153,192,255,0.1),
              inset 2px 2px 5px rgba(195,218,255,0.15),
              inset -10px -10px 20px rgba(229,253,190,0.08),
              inset -2px -2px 5px rgba(247,255,226,0.12),
              inset 0 1px 0 rgba(255,255,255,0.7)
            `,
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
            touchAction: "pan-y",
          }}
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated indicator */}
          <motion.div
            className="pointer-events-none absolute top-1.5 bottom-1.5 z-0 rounded-[22px]"
            style={{
              width: TAB_WIDTH,
              x: springX,
              scale: springScale,
            }}
          >
            <div
              className="absolute -inset-px rounded-[23px]"
              style={{
                boxShadow: `
                  0 2px 8px rgba(0,0,0,0.08),
                  0 6px 24px rgba(0,0,0,0.04)
                `,
              }}
            />
            <div
              className="absolute inset-0 overflow-hidden rounded-[22px] border border-white/60 bg-white/70 dark:border-white/15 dark:bg-white/12"
              style={{
                boxShadow: `
                  inset 10px 10px 20px rgba(153,192,255,0.15),
                  inset 2px 2px 5px rgba(195,218,255,0.25),
                  inset -10px -10px 20px rgba(229,253,190,0.12),
                  inset -2px -2px 30px rgba(247,255,226,0.2),
                  inset 0 1px 0 rgba(255,255,255,0.8)
                `,
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)",
                  borderRadius: "22px 22px 50% 50%",
                }}
              />
            </div>
          </motion.div>

          {/* Tab items — plain divs, no Link */}
          <div className="relative z-10 flex" style={{ gap: TAB_GAP }}>
            {tabs.map((tab, i) => {
              const isPostPage = pathname.startsWith("/post");
              const Icon = (isPostPage && tab.href === "/") ? Undo2 : tab.icon;
              const isActive = i === activeIndex;
              return (
                <div
                  key={tab.href}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  className="flex items-center justify-center rounded-[22px] text-neutral-900 select-none dark:text-white"
                  style={{ width: TAB_WIDTH, height: 48, WebkitTouchCallout: "none" }}
                >
                  <motion.div style={{ scale: tabScales[i], opacity: tabOpacities[i] }}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={Icon.displayName || Icon.name}
                        initial={{ scale: 0.7, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.7, opacity: 0, rotate: 20 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <Icon className="size-[22px]" strokeWidth={isActive ? 2.2 : 1.8} />
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="ml-1.5 flex items-center justify-center overflow-hidden rounded-[28px] border border-white/50 bg-white/60 text-neutral-500 backdrop-blur-xl dark:border-white/12 dark:bg-white/10 dark:text-neutral-200"
          style={{
            width: 62,
            height: 60,
            backdropFilter: "blur(20px) contrast(80%) saturate(120%)",
            WebkitBackdropFilter: "blur(20px) contrast(80%) saturate(120%)",
            boxShadow: `
              0 2px 8px rgba(0,0,0,0.06),
              0 8px 32px rgba(0,0,0,0.04),
              inset 10px 10px 20px rgba(153,192,255,0.1),
              inset 2px 2px 5px rgba(195,218,255,0.15),
              inset -10px -10px 20px rgba(229,253,190,0.08),
              inset -2px -2px 5px rgba(247,255,226,0.12),
              inset 0 1px 0 rgba(255,255,255,0.7)
            `,
          }}
        >
          {theme === "dark" ? (
            <Sun className="size-7" strokeWidth={1.8} />
          ) : (
            <Moon className="size-7" strokeWidth={1.8} />
          )}
        </button>
      </motion.nav>
    </AnimatePresence>
  );
}
