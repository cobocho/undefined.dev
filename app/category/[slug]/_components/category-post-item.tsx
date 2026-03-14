import dayjs from "dayjs";
import Image from "next/image";

import { Post } from "@/interfaces/post";

export function CategoryPostItem({
  post,
}: {
  post: Omit<Post, "content">;
}) {
  return (
    <div className="group flex cursor-pointer flex-col gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 sm:flex-row sm:gap-5">
      <div className="relative h-44 w-full overflow-hidden rounded-lg sm:h-[100px] sm:w-[160px] sm:min-w-[160px]">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          blurDataURL={post.thumbnail.blurDataURL}
          className="object-cover"
          placeholder="blur"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-neutral-800 group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-neutral-50 sm:text-base">
            {post.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {post.description}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-0">
          <span className="text-muted-foreground text-xs">
            {dayjs(post.date).format("YYYY년 MM월 DD일")}
          </span>
          <span className="text-muted-foreground text-xs">
            {post.minRead} min read
          </span>
        </div>
      </div>
    </div>
  );
}
