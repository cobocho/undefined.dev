/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  FileSearchCorner,
  Folder,
  Home,
  Moon,
  Sun,
  UserRoundSearch,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

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

export function MobileBottomTab() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

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

  const activeIndex = useMemo(() => {
    const idx = tabs.findIndex((t) => t.match(pathname));
    return idx >= 0 ? idx : 2; // default to Home
  }, [pathname]);

  // Drag state
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);

  const indicatorX = useMotionValue(activeIndex * TAB_STEP);
  const springX = useSpring(indicatorX, { stiffness: 400, damping: 30 });

  // Scale for the indicator during drag
  const indicatorScale = useMotionValue(1);
  const springScale = useSpring(indicatorScale, { stiffness: 400, damping: 25 });

  // Sync indicator position when activeIndex changes (route change)
  useEffect(() => {
    if (!isDragging.current) {
      indicatorX.set(activeIndex * TAB_STEP);
    }
  }, [activeIndex, indicatorX]);

  // Per-tab icon scale and opacity based on proximity to indicator
  const tabScales = tabs.map((_, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(springX, (x) => {
      const tabCenter = i * TAB_STEP;
      const dist = Math.abs(x - tabCenter);
      const maxDist = TAB_STEP * 2;
      const scale = 1 + 0.2 * Math.max(0, 1 - dist / maxDist);
      return scale;
    });
  });

  const tabOpacities = tabs.map((_, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(springX, (x) => {
      const tabCenter = i * TAB_STEP;
      const dist = Math.abs(x - tabCenter);
      const t = Math.max(0, 1 - dist / TAB_STEP);
      return 0.4 + 0.6 * t; // 0.4 (far) → 1.0 (on top)
    });
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDragging.current = true;
      dragStartX.current = e.touches[0].clientX;
      dragStartIndex.current = activeIndex;
      indicatorScale.set(1.15);
    },
    [activeIndex, indicatorScale],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return;

      const dx = e.touches[0].clientX - dragStartX.current;
      const indexOffset = dx / TAB_STEP;
      const rawIndex = dragStartIndex.current + indexOffset;
      const clampedIndex = Math.max(0, Math.min(tabs.length - 1, rawIndex));

      indicatorX.set(clampedIndex * TAB_STEP);
    },
    [indicatorX],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    indicatorScale.set(1);

    // Snap to nearest tab
    const currentX = indicatorX.get();
    const nearestIndex = Math.round(currentX / TAB_STEP);
    const clampedIndex = Math.max(0, Math.min(tabs.length - 1, nearestIndex));

    indicatorX.set(clampedIndex * TAB_STEP);

    if (clampedIndex !== activeIndex) {
      router.push(tabs[clampedIndex].href);
    }
  }, [activeIndex, indicatorX, indicatorScale, router]);

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
          className="relative mx-auto flex w-fit items-center rounded-[28px] border border-white/15 bg-white/10 p-1.5 backdrop-blur-xl dark:border-white/8 dark:bg-white/4"
          style={{
            backdropFilter: "blur(20px) contrast(80%) saturate(120%)",
            WebkitBackdropFilter: "blur(20px) contrast(80%) saturate(120%)",
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.06),
              inset 8px 8px 16px rgba(153,192,255,0.08),
              inset 2px 2px 4px rgba(195,218,255,0.12),
              inset -8px -8px 16px rgba(229,253,190,0.06),
              inset -2px -2px 4px rgba(247,255,226,0.1)
            `,
          }}
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Animated indicator (the liquid glass pill) */}
          <motion.div
            className="pointer-events-none absolute top-1.5 bottom-1.5 z-0 rounded-[22px]"
            style={{
              width: TAB_WIDTH,
              x: springX,
              scale: springScale,
            }}
          >
            {/* Outer shadow layer (needs separate div so inset shadows don't conflict) */}
            <div
              className="absolute -inset-px rounded-[23px]"
              style={{
                boxShadow: `
                  0 2px 8px rgba(0,0,0,0.08),
                  0 6px 24px rgba(0,0,0,0.04)
                `,
              }}
            />
            {/* Glass pill */}
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
              {/* Top specular highlight — subtle curved shine */}
              <div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 100%)",
                  borderRadius: "22px 22px 50% 50%",
                }}
              />
            </div>
          </motion.div>

          {/* Tab items */}
          <div className="relative z-10 flex" style={{ gap: TAB_GAP }}>
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = i === activeIndex;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="flex items-center justify-center rounded-[22px] text-neutral-900 dark:text-white"
                  style={{ width: TAB_WIDTH, height: 48 }}
                  onClick={(e) => {
                    if (isDragging.current) {
                      e.preventDefault();
                    }
                  }}
                >
                  <motion.div style={{ scale: tabScales[i], opacity: tabOpacities[i] }}>
                    <Icon className="size-[22px]" strokeWidth={isActive ? 2.2 : 1.8} />
                  </motion.div>
                </Link>
              );
            })}

          </div>
        </div>

        {/* Theme toggle — separate glass button */}
        <button
          onClick={toggleTheme}
          className="ml-1.5 flex items-center justify-center rounded-[28px] border border-white/10 bg-white/5 text-neutral-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-neutral-400"
          style={{
            width: 62,
            height: 60,
            backdropFilter: "blur(24px) saturate(130%)",
            WebkitBackdropFilter: "blur(24px) saturate(130%)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
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
