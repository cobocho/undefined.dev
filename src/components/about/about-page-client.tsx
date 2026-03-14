"use client";

import { FileUser, Github, Mail } from "lucide-react";
import { motion } from "motion/react";

const ease = [0.25, 0.1, 0.25, 1] as const;

export function AboutPageClient() {
  return (
    <div className="py-10">
      <motion.h1
        className="mb-20 text-3xl font-bold"
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease }}
      >
        소개
      </motion.h1>
      <motion.div
        className="mb-4 flex items-end gap-2"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <span className="text-4xl font-bold">김민규</span>
        <span className="text-xl text-neutral-500 dark:text-neutral-300">
          Frontend Developer
        </span>
      </motion.div>
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease }}
      >
        <span>
          프론트엔드 개발자 김민규입니다
          <br />
          맥주와 리버풀을 좋아합니다.
        </span>
      </motion.div>
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease }}
      >
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
      </motion.div>
    </div>
  );
}
