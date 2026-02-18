import { Tag } from "@/interfaces/post";

import { getAllPosts } from "./post";

export const getAllTags = (): Tag[] => {
  const allPosts = getAllPosts();
  const tags: Record<string, number> = {};

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tags[tag] = tags[tag] ? tags[tag] + 1 : 1;
    });
  });

  return Object.entries(tags)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};
