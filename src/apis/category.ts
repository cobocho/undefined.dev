import fs from "fs";

import { POST_DIRECTORY } from "@/constants/path";

export const getCategories = () => {
  const categories = fs.readdirSync(POST_DIRECTORY);
  return categories;
};
