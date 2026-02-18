import { FolderOpen, Hash } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { getCategories } from "@/apis/category";
import { getPostsByCategory } from "@/apis/post";

export const metadata: Metadata = {
  title: "카테고리",
  alternates: {
    canonical: "/category",
  },
};

export default function CategoryIndexPage() {
  const categories = getCategories();

  const categorySummaries = categories.map((category) => ({
    category,
    count: getPostsByCategory(category).length,
  }));

  return (
    <div className="py-10">
      <div className="mb-8 flex items-center gap-3">
        <FolderOpen className="size-7 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">카테고리</h1>
          <p className="text-muted-foreground text-sm">
            {categorySummaries.length}개의 카테고리
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {categorySummaries.map(({ category, count }) => (
          <Link
            href={`/category/${category}`}
            key={category}
            className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
          >
            <div className="flex items-center gap-2">
              <Hash className="size-4 text-neutral-400 group-hover:text-blue-500" />
              <span className="font-semibold text-neutral-800 capitalize group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-neutral-50">
                {category}
              </span>
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {count} posts
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
