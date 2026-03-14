"use client";

import {
  FileSearchCorner,
  Folder,
  Home,
  Moon,
  Sun,
  UserRoundSearch,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface SidebarProps {
  categories: string[];
}

export const Sidebar = ({ categories }: SidebarProps) => {
  const pathname = usePathname();
  const currentCategory = pathname.split("/")[2];
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      className="border-neutral-1000 relative z-[9999] h-full w-full rounded-3xl border bg-linear-to-r from-white to-neutral-50/50 px-4 py-8 shadow-[5px_20px_30px_rgba(0,0,0,0.2)] shadow-[#f1f1f1] backdrop-blur-xs dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800/50 dark:shadow-black/40"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="mb-8 flex items-center justify-between">
        <FakeButtons />
        <button
          onClick={toggleTheme}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4 text-neutral-400" />
          ) : (
            <Moon className="size-4 text-neutral-400" />
          )}
        </button>
      </div>
      <LayoutGroup>
        <div className="mb-8 flex flex-col gap-1">
          <Link href="/">
            <MenuItem
              icon={
                <Home
                  className={cn(
                    "size-5 text-blue-500",
                    pathname === "/" && "text-white",
                  )}
                />
              }
              isActive={pathname === "/"}
            >
              Home
            </MenuItem>
          </Link>
          <Link href="/search">
            <MenuItem
              icon={
                <FileSearchCorner
                  className={cn(
                    "size-5 text-blue-500",
                    pathname === "/search" && "text-white",
                  )}
                />
              }
              isActive={pathname === "/search"}
            >
              Search
            </MenuItem>
          </Link>
          <Link href="/about">
            <MenuItem
              icon={
                <UserRoundSearch
                  className={cn(
                    "size-5 text-blue-500",
                    pathname === "/about" && "text-white",
                  )}
                />
              }
              isActive={pathname === "/about"}
            >
              About Me
            </MenuItem>
          </Link>
        </div>
        <MenuTitle>Categories</MenuTitle>
        <div className="flex flex-col">
          {categories.map((category) => (
            <Link href={`/category/${category}`} key={category}>
              <MenuItem isActive={currentCategory === category}>
                {category}
              </MenuItem>
            </Link>
          ))}
        </div>
      </LayoutGroup>
    </motion.div>
  );
};

function MenuTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 block text-sm font-extrabold text-neutral-400 uppercase dark:text-neutral-400">
      {children}
    </span>
  );
}

function MenuItem({
  children,
  icon,
  isActive = false,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <div className="relative flex items-center gap-2 rounded-md px-3 py-2">
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-md bg-blue-400"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">
        {icon || (
          <Folder
            className={cn(
              "size-5 fill-neutral-500 text-white dark:fill-neutral-400 dark:text-neutral-400",
              isActive && "fill-none text-white dark:fill-none dark:text-white",
            )}
          />
        )}
      </span>
      <span
        className={cn(
          "relative z-10 capitalize transition-colors duration-200",
          isActive
            ? "text-white dark:text-white"
            : "text-neutral-700 dark:text-neutral-300",
        )}
      >
        {children}
      </span>
    </div>
  );
}

function FakeButtons() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 rounded-full bg-red-400"></div>
      <div className="h-4 w-4 rounded-full bg-yellow-400"></div>
      <div className="h-4 w-4 rounded-full bg-green-400"></div>
    </div>
  );
}
