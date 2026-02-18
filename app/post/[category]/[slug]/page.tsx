import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategories } from "@/apis/category";
import { getAllPosts, getPost } from "@/apis/post";
import { MarkdownRenderer } from "@/components/post/markdown-renderer";
import { TableOfContents } from "@/components/post/table-of-contents";

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const categories = getCategories();

  if (!categories.includes(category)) {
    notFound();
  }

  const post = getPost(category, slug, { withContent: true });

  return (
    <div className="flex gap-10">
      <div className="flex w-full flex-1 justify-center">
        <article className="w-full max-w-[1200px]">
          <div className="max-w-full">
            <Link
              href={`/category/${category}`}
              className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-800"
            >
              <ChevronLeft className="size-4" />
              뒤로가기
            </Link>

            <div className="mb-4 flex items-center gap-3">
              <Link
                href={`/category/${category}`}
                className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 capitalize"
              >
                {category}
              </Link>
              <span className="text-sm text-neutral-400">
                {dayjs(post.date).format("YYYY년 MM월 DD일")}
              </span>
            </div>

            <h1 className="mb-4 text-5xl font-bold text-neutral-900">
              {post.title}
            </h1>

            <p className="mb-8 text-base text-neutral-500">
              {post.description}
            </p>

            <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                blurDataURL={post.thumbnail.blurDataURL}
                className="object-cover"
                placeholder="blur"
              />
            </div>

            <MarkdownRenderer content={post.content} images={post.images} />
          </div>
        </article>
      </div>

      <aside className="hidden w-[280px] shrink-0 border-l p-6 min-[1600px]:block">
        <div className="sticky top-10">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
