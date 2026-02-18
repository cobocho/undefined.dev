import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategories } from "@/apis/category";
import { getPostsByCategory } from "@/apis/post";

import { CategoryPostItem } from "./_components/category-post-item";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const categories = getCategories();
  return categories.map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = getCategories();

  if (!categories.includes(slug)) {
    notFound();
  }

  const posts = getPostsByCategory(slug);

  return (
    <div className="py-8 sm:py-10">
      <div className="mb-4 flex items-center gap-3 sm:mb-2 sm:gap-4">
        <Link href="/">
          <ChevronLeft className="size-7 text-neutral-500 sm:size-8" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold capitalize sm:text-3xl">{slug}</h1>
          <p className="text-muted-foreground text-sm">
            {posts.length}개의 게시물
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        {posts.map((post, index) => (
          <Link
            href={`/post/${post.category}/${post.slug}`}
            key={post.slug}
            className="block"
          >
            <CategoryPostItem post={post} delay={index * 0.07} />
          </Link>
        ))}
      </div>
    </div>
  );
}
