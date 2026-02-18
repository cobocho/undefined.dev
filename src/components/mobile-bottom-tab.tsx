"use client";

import { FileSearchCorner, Folder, Home, UserRoundSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MobileBottomTab() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-md md:hidden"
      aria-label="Mobile bottom navigation"
    >
      <div className="mx-auto grid h-16 max-w-3xl grid-cols-4 px-2 pb-[max(env(safe-area-inset-bottom),0.25rem)]">
        <TabItem
          href="/"
          icon={<Home className="size-4" />}
          isActive={pathname === "/"}
        >
          Home
        </TabItem>
        <TabItem
          href="/search"
          icon={<FileSearchCorner className="size-4" />}
          isActive={pathname === "/search"}
        >
          Search
        </TabItem>
        <TabItem
          href="/category"
          icon={<Folder className="size-4" />}
          isActive={pathname.startsWith("/category")}
        >
          Category
        </TabItem>
        <TabItem
          href="/about"
          icon={<UserRoundSearch className="size-4" />}
          isActive={pathname === "/about"}
        >
          About Me
        </TabItem>
      </div>
    </nav>
  );
}

function TabItem({
  href,
  icon,
  isActive,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold text-neutral-500 transition-colors duration-200",
        isActive && "text-blue-500",
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
