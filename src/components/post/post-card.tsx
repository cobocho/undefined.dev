import dayjs from "dayjs";
import { ScanText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Post } from "@/interfaces/post";
import { getAverageColor } from "@/lib/image";

interface PostCardProps {
  post: Omit<Post, "content">;
}

export const PostCard = ({ post }: PostCardProps) => {
  const avgColor = getAverageColor(post.thumbnail);
  const { r = 245, g = 245, b = 245 } = avgColor ?? {};
  const lighterR = Math.min(255, r + 30);
  const lighterG = Math.min(255, g + 30);
  const lighterB = Math.min(255, b + 30);
  const bgGradient = `linear-gradient(135deg, rgb(${lighterR}, ${lighterG}, ${lighterB}), rgb(${r}, ${g}, ${b}))`;
  const shadowColor = `rgba(${r}, ${g}, ${b}, 0.4)`;
  const isLight = avgColor
    ? avgColor.r * 0.299 + avgColor.g * 0.587 + avgColor.b * 0.114 > 150
    : true;
  const textColor = isLight ? "#111" : "#fff";
  const subTextColor = isLight ? "#333" : "#fff";

  return (
    <div
      className="group flex h-[440px] w-[350px] min-w-[350px] cursor-pointer flex-col overflow-hidden rounded-2xl p-4 transition-all duration-300 select-none hover:scale-[1.03]"
      style={{
        background: bgGradient,
        boxShadow: `0 4px 20px ${shadowColor}`,
      }}
    >
      <div className="relative mb-2 h-[280px] w-full shrink-0 overflow-hidden">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          blurDataURL={post.thumbnail.blurDataURL}
          className="pointer-events-none rounded-lg object-cover select-none"
          draggable={false}
          placeholder="blur"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span
              className="block text-xs font-medium capitalize opacity-70"
              style={{ color: subTextColor }}
            >
              {post.category}
            </span>
            <span
              className="text-xs opacity-60"
              style={{ color: subTextColor }}
            >
              {dayjs(post.date).format("YYYY년 MM월 DD일")}
            </span>
          </div>
          <h3 className="font-bold" style={{ color: textColor }}>
            {post.title}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/post/${post.category}/${post.slug}`}
            className="flex items-center gap-1 rounded-[14px] border bg-white px-3 py-1.5"
          >
            <ScanText className="size-4" />
            <span style={{ color: subTextColor }} className="text-sm">
              {post.minRead} min read
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
