import type { Metadata } from "next";

import { AboutPageClient } from "@/components/about/about-page-client";
import { SITE_NAME } from "@/constants/site-metadata";

export const metadata: Metadata = {
  title: "소개",
  description: `${SITE_NAME}를 운영하는 프론트엔드 개발자 김민규를 소개합니다.`,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
