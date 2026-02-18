import dayjs from "dayjs";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategories } from "@/apis/category";
import { getPostsByCategory } from "@/apis/post";
import { Post } from "@/interfaces/post";

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
    <div className="py-10">
      <div className="mb-2 flex items-center gap-4">
        <Link href="/">
          <ChevronLeft className="size-8 text-neutral-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold capitalize">{slug}</h1>
          <p className="text-muted-foreground text-sm">
            {posts.length}개의 게시물
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link href={`/post/${post.category}/${post.slug}`} key={post.slug}>
            <CategoryPostItem post={post} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function CategoryPostItem({ post }: { post: Omit<Post, "content"> }) {
  return (
    <div className="group flex cursor-pointer gap-5 rounded-xl p-3 transition-all duration-200 hover:bg-neutral-50">
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
    </div>
  );
}
