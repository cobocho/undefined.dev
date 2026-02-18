import { groupBy } from "es-toolkit";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { getAllPosts } from "@/apis/post";
import { PostCard } from "@/components/post/post-card";
import { PostItem } from "@/components/post/post-item";
import { ScrollablePostList } from "@/components/post/scrollable-post-list";

export default async function Home() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 5);
  const groupedPosts = groupBy(posts, (post) => post.category);
  const orderedByRecent = Object.entries(groupedPosts).map(
    ([category, posts]) => ({
      category,
      posts: posts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10),
      hasMore: posts.length > 5,
    }),
  );

  return (
    <div className="py-10">
      <h1 className="mb-6 text-3xl font-bold">홈</h1>
      <div className="mb-12">
        <h2 className="mb-4 text-xl font-bold">최근 게시물</h2>
        <ScrollablePostList>
          {recentPosts.map((post) => (
            <Link href={`/post/${post.category}/${post.slug}`} key={post.slug}>
              <PostCard post={post} />
            </Link>
          ))}
        </ScrollablePostList>
      </div>
      {orderedByRecent.map(({ category, posts }) => (
        <div key={category} className="mb-10">
          <Link
            href={`/category/${category}`}
            className="transition-all duration-300 hover:scale-105"
          >
            <div className="mb-4 flex w-fit items-center justify-between gap-1">
              <h2 className="text-xl font-bold capitalize">{category}</h2>
              <ChevronRight className="size-5 text-neutral-500 dark:text-neutral-400" />
            </div>
          </Link>
          <ScrollablePostList>
            {posts.map((post) => (
              <Link
                href={`/post/${post.category}/${post.slug}`}
                key={post.slug}
              >
                <PostItem post={post} />
              </Link>
            ))}
          </ScrollablePostList>
        </div>
      ))}
    </div>
  );
}
