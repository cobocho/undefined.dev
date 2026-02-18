/* eslint-disable @typescript-eslint/no-require-imports */
import fs from "fs";
import matter from "gray-matter";
import { StaticImageData } from "next/image";
import { join } from "path";

import { POST_DIRECTORY } from "@/constants/path";
import { Post } from "@/interfaces/post";

import { getCategories } from "./category";

interface GetPostOptions {
  withContent?: boolean;
}

export const getPostImages = (
  category: string,
  slug: string,
): Record<string, StaticImageData> => {
  const hasImages = fs.existsSync(
    join(POST_DIRECTORY, category, slug, "images"),
  );

  if (!hasImages) {
    return {};
  }

  const images = fs.readdirSync(join(POST_DIRECTORY, category, slug, "images"));

  return images.reduce(
    (acc, image) => {
      acc[image] = require(
        `../../_posts/${category}/${slug}/images/${image}`,
      ).default;
      return acc;
    },
    {} as Record<string, StaticImageData>,
  );
};

export function getPost(
  category: string,
  slug: string,
  options: { withContent: true },
): Post;

export function getPost(
  category: string,
  slug: string,
  options?: { withContent: false } | { withContent?: undefined },
): Omit<Post, "content">;

export function getPost(
  category: string,
  slug: string,
  options: GetPostOptions = { withContent: false },
): Post | Omit<Post, "content"> {
  const post = fs.readFileSync(
    join(POST_DIRECTORY, category, slug, "post.md"),
    "utf-8",
  );
  const { data, content } = matter(post);
  const images = getPostImages(category, slug);
  const thumbnail = require(
    `../../_posts/${category}/${slug}/thumbnail.png`,
  ).default;

  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minRead = Math.max(1, Math.round(wordCount / wordsPerMinute));

  const postData: Omit<Post, "content"> = {
    title: data.title,
    description: data.description,
    category,
    slug,
    date: data.date,
    tags: data.tags,
    thumbnail,
    images,
    minRead,
  };

  if (options.withContent) {
    return {
      ...postData,
      content,
    };
  }

  return postData;
}
export const getAllPosts = () => {
  const categories = getCategories();

  const posts = categories
    .flatMap((category) => {
      const posts = fs.readdirSync(join(POST_DIRECTORY, category));
      return posts.map((post) =>
        getPost(category, post, { withContent: false }),
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
};
