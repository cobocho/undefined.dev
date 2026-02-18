import dayjs from "dayjs";
import Image from "next/image";

import { Post } from "@/interfaces/post";

interface PostItemProps {
  post: Omit<Post, "content">;
}

export const PostItem = ({ post }: PostItemProps) => {
  return (
    <div className="group flex w-[280px] min-w-[280px] cursor-pointer flex-col rounded-lg p-2 transition-all duration-300 select-none hover:scale-105 hover:shadow-lg">
      <div className="relative mb-2 h-[160px] w-full overflow-hidden rounded-lg shadow-lg shadow-black/5">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          blurDataURL={post.thumbnail.blurDataURL}
          className="pointer-events-none object-cover select-none"
          draggable={false}
          placeholder="blur"
        />
      </div>
      <h3 className="mb-2 block text-sm font-semibold text-neutral-600 group-hover:text-neutral-900">
        {post.title}
      </h3>
      <div className="flex w-full items-center justify-between">
        <span className="text-muted-foreground block text-xs">
          {dayjs(post.date).format("YYYY년 MM월 DD일")}
        </span>
        <span className="text-muted-foreground block text-xs">
          {post.minRead} min read
        </span>
      </div>
    </div>
  );
};
