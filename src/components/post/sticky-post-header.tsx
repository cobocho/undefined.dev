"use client";

import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface StickyPostHeaderProps {
  title: string;
  onBack: () => void;
}

export function StickyPostHeader({ title, onBack }: StickyPostHeaderProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rect, setRect] = useState<{ left: number; width: number } | null>(
    null,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  console.log(progress);

  const getScrollWrapper = useCallback(() => {
    return document.getElementById("content-wrapper");
  }, []);

  const getArticleElement = useCallback(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return null;
    return sentinel.closest("article");
  }, []);

  const updateRect = useCallback(() => {
    const parent = getArticleElement();
    if (!parent) return;
    const r = parent.getBoundingClientRect();
    setRect({ left: r.left, width: r.width });
  }, [getArticleElement]);

  const updateProgress = useCallback(() => {
    const article = getArticleElement();
    if (!article) return;

    const wrapper = getScrollWrapper();
    const articleRect = article.getBoundingClientRect();

    const useWrapper =
      wrapper instanceof HTMLElement &&
      wrapper.scrollHeight > wrapper.clientHeight;

    if (!useWrapper) {
      const articleTop = window.scrollY + articleRect.top;
      const end = articleTop + articleRect.height - window.innerHeight;
      const currentScroll = window.scrollY;

      if (end <= articleTop) {
        setProgress(currentScroll >= articleTop ? 1 : 0);
        return;
      }

      const ratio = (currentScroll - articleTop) / (end - articleTop);
      setProgress(Math.max(0, Math.min(1, ratio)));
      return;
    }

    const containerRect = wrapper.getBoundingClientRect();
    const articleTop =
      wrapper.scrollTop + (articleRect.top - containerRect.top);
    const end = articleTop + articleRect.height - wrapper.clientHeight;
    const currentScroll = wrapper.scrollTop;

    if (end <= articleTop) {
      setProgress(currentScroll >= articleTop ? 1 : 0);
      return;
    }

    const ratio = (currentScroll - articleTop) / (end - articleTop);
    setProgress(Math.max(0, Math.min(1, ratio)));
  }, [getArticleElement, getScrollWrapper]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) return;
    const wrapper = getScrollWrapper();

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = !entry.isIntersecting;
        setVisible(isVisible);
        if (isVisible) updateRect();
      },
      { root: null, threshold: 0 },
    );

    observer.observe(sentinel);

    window.addEventListener("resize", updateRect);
    window.addEventListener("resize", updateProgress);
    window.addEventListener("scroll", updateProgress, { passive: true });
    wrapper?.addEventListener("scroll", updateProgress, { passive: true });
    const rafId = window.requestAnimationFrame(updateProgress);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("resize", updateProgress);
      window.removeEventListener("scroll", updateProgress);
      wrapper?.removeEventListener("scroll", updateProgress);
    };
  }, [getScrollWrapper, updateProgress, updateRect]);

  return (
    <>
      <div ref={sentinelRef} className="pointer-events-none h-0" />
      <div
        className={`pointer-events-none fixed top-4 z-40 transition duration-300 ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        style={
          rect
            ? { left: rect.left, width: rect.width }
            : { left: 0, width: "100%" }
        }
      >
        <div className="pointer-events-auto relative w-full max-w-full overflow-hidden rounded-[24px] border border-neutral-200 bg-neutral-50/80 px-4 pt-3 pb-4 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex shrink-0 cursor-pointer items-center text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="truncate text-lg font-semibold">{title}</span>
          </div>
          <div className="absolute right-0 bottom-0 left-0 h-1">
            <motion.div
              className="h-full bg-blue-500"
              animate={{ width: `${progress * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
