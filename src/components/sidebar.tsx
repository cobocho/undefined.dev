"use client";

import {
  FileSearchCorner,
  Folder,
  NotebookText,
  UserRoundSearch,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarProps {
  categories: string[];
}

export const Sidebar = ({ categories }: SidebarProps) => {
  const pathname = usePathname();
  const currentCategory = pathname.split("/")[2];

  return (
    <div className="relative z-[9999] h-full w-full rounded-3xl border border-white/20 bg-linear-to-r from-white to-neutral-50/50 px-4 py-8 shadow-[5px_20px_30px_rgba(0,0,0,0.2)] shadow-[#f1f1f1] backdrop-blur-xs">
      <FakeButtons />
      <div className="mb-8 flex flex-col gap-1">
        <Link href="/">
          <MenuItem icon={<NotebookText className="size-5 text-blue-500" />}>
            All Posts
          </MenuItem>
        </Link>
        <Link href="/search">
          <MenuItem
            icon={<FileSearchCorner className="size-5 text-blue-500" />}
          >
            Search
          </MenuItem>
        </Link>
        <Link href="/about">
          <MenuItem icon={<UserRoundSearch className="size-5 text-blue-500" />}>
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
    <span className="mb-3 block text-sm font-extrabold text-neutral-400 uppercase">
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
            "size-5 fill-neutral-500 text-neutral-500",
            isActive && "fill-none text-white",
          )}
        />
      )}
      <span
        className={cn("text-neutral-700 capitalize", isActive && "text-white")}
      >
        {children}
      </span>
    </div>
  );
}

function FakeButtons() {
  return (
    <div className="mb-8 flex items-center gap-2">
      <div className="h-4 w-4 rounded-full bg-red-400"></div>
      <div className="h-4 w-4 rounded-full bg-yellow-400"></div>
      <div className="h-4 w-4 rounded-full bg-green-400"></div>
    </div>
  );
}
