import { notFound } from "next/navigation";

import { getCategories } from "@/apis/category";
import { getAllPosts, getPost } from "@/apis/post";
import { PostDetail } from "@/components/post/post-detail";

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

  return <PostDetail post={post} />;
}
