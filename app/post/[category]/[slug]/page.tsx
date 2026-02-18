import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCategories } from "@/apis/category";
import { getAllPosts, getPost, getPostsByCategory } from "@/apis/post";
import { PostDetail } from "@/components/post/post-detail";
import { SITE_NAME } from "@/constants/site-metadata";

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const dynamicParams = false;
export const dynamic = "force-static";

const HOST = "https://un-defined.dev";

const getOpenGraphImages = (thumbnailSrc?: string) => {
  if (!thumbnailSrc) {
    const images = [HOST + "/images/default-thumbnail.png"];
    return images;
  }

  const images = [
    thumbnailSrc.startsWith("http") ? thumbnailSrc : HOST + thumbnailSrc,
  ];
  return images;
};

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const categories = getCategories();

  if (!categories.includes(category)) {
    return {
      title: "게시물",
      description: `${SITE_NAME}의 게시물 페이지입니다.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const post = getPost(category, slug, { withContent: false });
    const canonical = `/post/${category}/${slug}`;
    const images = getOpenGraphImages(post.thumbnail?.src);

    return {
      title: post.title,
      description: post.description,
      keywords: post.tags,
      alternates: {
        canonical,
      },
      openGraph: {
        type: "article",
        title: `${post.title} | ${SITE_NAME}`,
        description: post.description,
        url: canonical,
        publishedTime: post.date,
        tags: post.tags,
        images,
      },
      twitter: {
        title: `${post.title} | ${SITE_NAME}`,
        description: post.description,
        images,
      },
    };
  } catch {
    return {
      title: "게시물",
      description: `${SITE_NAME}의 게시물 페이지입니다.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const categories = getCategories();

  if (!categories.includes(category)) {
    notFound();
  }

  const post = getPost(category, slug, { withContent: true });
  const categoryPosts = getPostsByCategory(category);

  const currentIndex = categoryPosts.findIndex((p) => p.slug === slug);
  const start = Math.max(0, currentIndex - 3);
  const end = Math.min(categoryPosts.length, currentIndex + 4);
  const nearbyPosts = categoryPosts.slice(start, end);

  return (
    <PostDetail post={post} nearbyPosts={nearbyPosts} currentSlug={slug} />
  );
}
