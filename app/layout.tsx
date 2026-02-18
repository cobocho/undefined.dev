import "./globals.css";

import { AnimatePresence } from "motion/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getCategories } from "@/apis/category";
import { MobileBottomTab } from "@/components/mobile-bottom-tab";
import { ScrollRestoration } from "@/components/scroll-restoration";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/constants/site-metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getCategories();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider initialTheme="light">
          <AnimatePresence>
            <div className="flex h-screen overflow-y-hidden">
              <div className="fixed top-0 left-0 z-50 hidden h-screen w-80 p-4 md:block">
                <Sidebar categories={categories} />
              </div>
              <div
                id="content-wrapper"
                className="flex-1 overflow-x-hidden overflow-y-scroll px-4 pb-24 md:pb-0 md:pl-84 lg:pr-0"
              >
                <ScrollRestoration />
                {children}
              </div>
              <MobileBottomTab />
            </div>
          </AnimatePresence>
        </ThemeProvider>
      </body>
    </html>
  );
}
