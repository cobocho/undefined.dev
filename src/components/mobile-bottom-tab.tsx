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
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

type RouteMatcher = string | RegExp | ((pathname: string) => boolean);

const hideOnRoutes: RouteMatcher[] = ["/post"];

function matchRoute(pathname: string, matcher: RouteMatcher) {
  if (typeof matcher === "string") return pathname.startsWith(matcher);
  if (matcher instanceof RegExp) return matcher.test(pathname);
  return matcher(pathname);
}

export function MobileBottomTab() {
  const pathname = usePathname();
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

  return (
    <AnimatePresence>
      <motion.nav
        initial={false}
        animate={{ y: isHidden ? 120 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 md:hidden"
        aria-label="Mobile bottom navigation"
      >
        <div className="flex w-full justify-between rounded-[32px] border bg-white/60 px-6 py-1 shadow-lg backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/50">
          <TabItem
            href="/search"
            icon={<FileSearchCorner className="size-6" />}
            isActive={pathname === "/search"}
          />
          <TabItem
            href="/category"
            icon={<Folder className="size-6" />}
            isActive={pathname.startsWith("/category")}
          />
          <TabItem
            href="/"
            icon={<Home className="size-6" />}
            isActive={pathname === "/"}
          />
          <TabItem
            href="/about"
            icon={<UserRoundSearch className="size-6" />}
            isActive={pathname === "/about"}
          />
          <button
            onClick={toggleTheme}
            className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-neutral-500 transition-colors duration-200 dark:text-neutral-100"
          >
            {theme === "dark" ? (
              <Sun className="size-6" />
            ) : (
              <Moon className="size-6" />
            )}
          </button>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}

function TabItem({
  href,
  icon,
  isActive,
}: {
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-4 text-[11px] font-semibold text-neutral-500 transition-colors duration-200 dark:text-neutral-100",
        isActive && "text-white",
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab-item"
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="absolute right-0 bottom-0 left-0 h-full w-full rounded-2xl bg-linear-to-r from-neutral-600/40 to-neutral-600/30 dark:from-white/40 dark:to-white/30"
        />
      )}
      <div className="relative z-10">{icon}</div>
    </Link>
  );
}
