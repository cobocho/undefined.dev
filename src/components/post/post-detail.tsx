"use client";

import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { useTransitionRouter } from "@/components/page-transition";
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
  const router = useTransitionRouter();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV === "development"
    ) {
      return;
    }

    fetch(`/api/view`, {
      method: "POST",
      body: JSON.stringify({
        category: post.category,
        slug: post.slug,
      }),
    });
  }, []);

  return (
    <div className="flex gap-10">
      <motion.div
        className="flex w-full flex-1 justify-center py-10 pr-[300px] max-[1600px]:pr-4 max-[1024px]:pr-0"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <article className="w-full max-w-[1200px]">
          <div className="max-w-full">
            <motion.button
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <ChevronLeft className="size-4" />
              뒤로가기
            </motion.button>

            <motion.div
              className="mb-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Link
                href={`/category/${post.category}`}
                className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 capitalize dark:bg-blue-500/10 dark:text-blue-400"
              >
                {post.category}
              </Link>
              <span className="text-sm text-neutral-400 dark:text-neutral-300">
                {dayjs(post.date).format("YYYY년 MM월 DD일")}
              </span>
            </motion.div>

            <StickyPostHeader title={post.title} onBack={() => router.back()} />
            <motion.h1
              className="dark:text-foreground mb-4 text-2xl font-bold break-keep text-neutral-900 md:text-5xl"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {post.title}
            </motion.h1>

            <motion.p
              className="mb-8 text-base text-neutral-500 dark:text-neutral-300"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {post.description}
            </motion.p>

            {post.tags.length > 0 && (
              <motion.ul
                className="mb-8 flex flex-wrap gap-2"
                aria-label="태그 목록"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.35,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      #{tag}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}

            <motion.div
              className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                blurDataURL={post.thumbnail.blurDataURL}
                className="object-cover"
                placeholder="blur"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <MarkdownRenderer content={post.content} images={post.images} />
            </motion.div>

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
        className="fixed top-0 right-0 z-50 hidden h-screen w-[280px] overflow-hidden border-l bg-white/90 p-6 backdrop-blur-md min-[1600px]:block dark:border-neutral-700 dark:bg-neutral-900/90"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <div className="sticky top-10">
          <TableOfContents />
        </div>
      </motion.div>
    </div>
  );
};
