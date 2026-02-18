"use client";

import dayjs from "dayjs";
import { motion } from "motion/react";
import Image from "next/image";

import { Post } from "@/interfaces/post";

export function CategoryPostItem({
  post,
  delay,
}: {
  post: Omit<Post, "content">;
  delay: number;
}) {
  return (
    <motion.div
      className="group flex cursor-pointer gap-5 rounded-xl p-3 transition-all duration-200 hover:bg-neutral-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="relative h-[100px] w-[160px] min-w-[160px] overflow-hidden rounded-lg">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          blurDataURL={post.thumbnail.blurDataURL}
          className="object-cover"
          placeholder="blur"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="mb-1 font-semibold text-neutral-800 group-hover:text-neutral-950">
            {post.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {post.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs">
            {dayjs(post.date).format("YYYY년 MM월 DD일")}
          </span>
          <span className="text-muted-foreground text-xs">
            {post.minRead} min read
          </span>
        </div>
      </div>
    </motion.div>
  );
}
