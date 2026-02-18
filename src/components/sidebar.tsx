"use client";

import {
  FileSearchCorner,
  Folder,
  NotebookText,
  UserRoundSearch,
} from "lucide-react";

interface SidebarProps {
  categories: string[];
}

export const Sidebar = ({ categories }: SidebarProps) => {
  return (
    <div className="relative z-[9999] h-full w-full rounded-3xl border border-white/20 bg-linear-to-r from-white to-neutral-50/50 px-6 py-8 shadow-[5px_20px_30px_rgba(0,0,0,0.2)] shadow-[#f1f1f1] backdrop-blur-xs">
      <FakeButtons />
      <div className="mb-8 flex flex-col gap-3">
        <MenuItem icon={<NotebookText className="size-5 text-blue-500" />}>
          All Posts
        </MenuItem>
        <MenuItem icon={<FileSearchCorner className="size-5 text-blue-500" />}>
          Search
        </MenuItem>
        <MenuItem icon={<UserRoundSearch className="size-5 text-blue-500" />}>
          About Me
        </MenuItem>
      </div>
      <MenuTitle>Categories</MenuTitle>
      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <MenuItem key={category}>{category}</MenuItem>
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
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon || <Folder className="size-5 fill-neutral-500 text-neutral-500" />}
      <span className="text-neutral-700 capitalize">{children}</span>
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
