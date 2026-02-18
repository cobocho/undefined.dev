import { StaticImageData } from "next/image";

export interface Snippet {
  idx?: number;
  title: string;
  category: string;
  slug: string;
  date: string;
  content: string;
  description?: string;
  images: {
    [key: string]: StaticImageData;
  };
}
