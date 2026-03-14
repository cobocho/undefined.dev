import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCategories } from "@/apis/category";
import { getPostsByCategory } from "@/apis/post";
import { FadeInUp } from "@/components/animation/fade-in-up";
import {
  StaggerChildren,
  StaggerItem,
} from "@/components/animation/stagger-children";
import { SITE_NAME } from "@/constants/site-metadata";

import { CategoryPostItem } from "./_components/category-post-item";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  const categories = getCategories();
  return categories.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = getCategories();

  if (!categories.includes(slug)) {
    return {
      description: `${slug} Category`,
    };
  }

  const postCount = getPostsByCategory(slug).length;
  const title = `${slug}`;
  const description = `${slug} 카테고리의 게시물 수: ${postCount}개`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `/category/${slug}`,
    },
    twitter: {
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = getCategories();

  if (!categories.includes(slug)) {
    notFound();
  }

  const posts = getPostsByCategory(slug);

  return (
    <div className="py-8 sm:py-10">
      <FadeInUp delay={0.1}>
        <div className="mb-4 flex items-center gap-3 sm:mb-2 sm:gap-4">
          <Link href="/">
            <ChevronLeft className="size-7 text-neutral-500 sm:size-8" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold capitalize sm:text-3xl">{slug}</h1>
            <p className="text-muted-foreground text-sm">
              {posts.length}개의 게시물
            </p>
          </div>
        </div>
      </FadeInUp>
      <StaggerChildren
        className="flex flex-col gap-3 sm:gap-4"
        baseDelay={0.2}
        staggerDelay={0.06}
      >
        {posts.map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/post/${post.category}/${post.slug}`}
              className="block"
            >
              <CategoryPostItem post={post} />
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </div>
  );
}
