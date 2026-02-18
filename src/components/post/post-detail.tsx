"use client";

import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Post } from "@/interfaces/post";

import { Giscus } from "./giscus";
import { MarkdownRenderer } from "./markdown-renderer";
import { PostItem } from "./post-item";
import { ScrollablePostList } from "./scrollable-post-list";
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
  return (
    <div className="flex gap-10">
      <motion.div
        className="flex w-full flex-1 justify-center py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <article className="w-full max-w-[1200px]">
          <div className="max-w-full">
            <Link
              href={`/category/${post.category}`}
              className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-800"
            >
              <ChevronLeft className="size-4" />
              뒤로가기
            </Link>

            <div className="mb-4 flex items-center gap-3">
              <Link
                href={`/category/${post.category}`}
                className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 capitalize"
              >
                {post.category}
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

            {post.tags.length > 0 && (
              <ul className="mb-8 flex flex-wrap gap-2" aria-label="태그 목록">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
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
                <h2 className="mb-4 text-xl font-bold capitalize">
                  {post.category}의 다른 글
                </h2>
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
        className="relative z-50 hidden w-[280px] shrink-0 border-l bg-white/90 p-6 backdrop-blur-md min-[1600px]:block"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="sticky top-10">
          <TableOfContents />
        </div>
      </motion.div>
    </div>
  );
};
