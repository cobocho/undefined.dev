"use client";

import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Post } from "@/interfaces/post";

import { Giscus } from "./giscus";
import { MarkdownRenderer } from "./markdown-renderer";
import { PostItem } from "./post-item";
import { ScrollablePostList } from "./scrollable-post-list";
import { StickyPostHeader } from "./sticky-post-header";
import { TableOfContents } from "./table-of-contents";

interface PostDetailProps {
  post: Post;
  nearbyPosts?: Omit<Post, "content">[];
  currentSlug?: string;
}

export const PostDetail = ({
  post,
  nearbyPosts,
  currentSlug,
}: PostDetailProps) => {
  const router = useRouter();

  return (
    <div className="flex gap-10">
      <motion.div
        className="flex w-full flex-1 justify-center py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <article className="w-full max-w-[1200px]">
          <div className="max-w-full">
            <button
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
            >
              <ChevronLeft className="size-4" />
              뒤로가기
            </button>

            <div className="mb-4 flex items-center gap-3">
              <Link
                href={`/category/${post.category}`}
                className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 capitalize dark:bg-blue-500/10 dark:text-blue-400"
              >
                {post.category}
              </Link>
              <span className="text-sm text-neutral-400 dark:text-neutral-300">
                {dayjs(post.date).format("YYYY년 MM월 DD일")}
              </span>
            </div>

            <StickyPostHeader title={post.title} onBack={() => router.back()} />
            <h1 className="dark:text-foreground mb-4 text-2xl font-bold break-keep text-neutral-900 md:text-5xl">
              {post.title}
            </h1>

            <p className="mb-8 text-base text-neutral-500 dark:text-neutral-300">
              {post.description}
            </p>

            {post.tags.length > 0 && (
              <ul className="mb-8 flex flex-wrap gap-2" aria-label="태그 목록">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      #{tag}
                    </span>
                  </li>
                ))}
              </ul>
            )}

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

            <div className="my-20">
              <Giscus />
            </div>

            {nearbyPosts && nearbyPosts.length > 1 && (
              <div>
                <span className="mb-4 text-xl font-bold capitalize">
                  {post.category}의 다른 글
                </span>
                <ScrollablePostList>
                  {nearbyPosts.map((p) => (
                    <Link href={`/post/${p.category}/${p.slug}`} key={p.slug}>
                      <div
                        data-current-post={
                          p.slug === currentSlug ? "true" : undefined
                        }
                        className={
                          p.slug === currentSlug
                            ? "rounded-lg ring-2 ring-blue-500"
                            : ""
                        }
                      >
                        <PostItem post={p} />
                      </div>
                    </Link>
                  ))}
                </ScrollablePostList>
              </div>
            )}
          </div>
        </article>
      </motion.div>

      <motion.div
        className="relative z-50 hidden w-[280px] shrink-0 border-l bg-white/90 p-6 backdrop-blur-md min-[1600px]:block dark:border-neutral-700 dark:bg-neutral-900/90"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="sticky top-10">
          <TableOfContents />
        </div>
      </motion.div>
    </div>
  );
};
