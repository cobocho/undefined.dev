"use client";

import {
  FileSearchCorner,
  Folder,
  Home,
  Moon,
  Sun,
  UserRoundSearch,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { useTheme } from "./theme-provider";

interface SidebarProps {
  categories: string[];
}

export const Sidebar = ({ categories }: SidebarProps) => {
  const pathname = usePathname();
  const currentCategory = pathname.split("/")[2];
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative z-[9999] h-full w-full rounded-3xl border border-white/20 bg-linear-to-r from-white to-neutral-50/50 px-4 py-8 shadow-[5px_20px_30px_rgba(0,0,0,0.2)] shadow-[#f1f1f1] backdrop-blur-xs dark:border-white/10 dark:from-neutral-900 dark:to-neutral-800/50 dark:shadow-black/40">
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
            <Moon className="size-4 text-white" />
          )}
        </button>
      </div>
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
            <MenuItem key={category} isActive={currentCategory === category}>
              {category}
            </MenuItem>
          </Link>
        ))}
      </div>
    </div>
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
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 transition-all duration-300",
        isActive && "bg-blue-400",
      )}
    >
      {icon || (
        <Folder
          className={cn(
            "size-5 fill-neutral-500 text-white dark:fill-neutral-400 dark:text-neutral-400",
            isActive && "fill-none text-white dark:fill-none dark:text-white",
          )}
        />
      )}
      <span
        className={cn(
          "text-neutral-700 capitalize dark:text-neutral-300",
          isActive && "text-white dark:text-white",
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
