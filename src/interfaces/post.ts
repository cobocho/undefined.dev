import { StaticImageData } from "next/image";

import { Snippet } from "./snippet";

export interface Category {
  name: string;
  count: number;
  posts: Post[] | Snippet[];
}

export interface Tag {
  name: string;
  count: number;
}

export interface Post {
  title: string;
  description: string;
  category: string;
  slug: string;
  date: string;
  tags: string[];
  thumbnail: StaticImageData;
  content: string;
  minRead: number;
  images: {
    [key: string]: StaticImageData;
  };
}
