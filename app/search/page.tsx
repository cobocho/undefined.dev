import type { Metadata } from "next";

import { SITE_NAME } from "@/constants/site-metadata";

import { SearchPageClient } from "../../src/components/search/search-page-client";

export const metadata: Metadata = {
  title: "검색",
  description: `${SITE_NAME}의 게시물을 키워드로 검색할 수 있습니다.`,
  alternates: {
    canonical: "/search",
  },
};

export default function SearchPage() {
  return (
    <div className="py-10">
      <SearchPageClient />
    </div>
  );
}
