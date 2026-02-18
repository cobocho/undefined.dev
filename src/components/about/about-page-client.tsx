"use client";

import { FileUser, Github, Mail } from "lucide-react";
import { motion } from "motion/react";

export function AboutPageClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-10"
    >
      <h1 className="mb-20 text-3xl font-bold">소개</h1>
      <div className="mb-4 flex items-end gap-2">
        <span className="text-4xl font-bold">김민규</span>
        <span className="text-xl text-neutral-500 dark:text-neutral-300">
          Frontend Developer
        </span>
      </div>
      <div className="mb-4">
        <span>
          프론트엔드 개발자 김민규입니다
          <br />
          맥주와 리버풀을 좋아합니다.
        </span>
      </div>
      <div className="flex gap-2">
        <a
          href="https://resume.un-defined.dev"
          target="_blank"
          rel="noreferrer"
        >
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-md border bg-blue-500 px-4 py-2 text-sm text-white"
          >
            <FileUser className="size-4" />
            Resume
          </button>
        </a>
        <a href="https://github.com/cobocho" target="_blank" rel="noreferrer">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-md border bg-black px-4 py-2 text-sm text-white dark:bg-neutral-800"
          >
            <Github className="size-4" />
            Github
          </button>
        </a>
        <a href="mailto:contact@un-defined.dev">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 px-4 py-2 text-sm text-neutral-500 dark:border-neutral-600 dark:text-neutral-300"
          >
            <Mail className="size-4" />
            Mail
          </button>
        </a>
      </div>
    </motion.div>
  );
}
