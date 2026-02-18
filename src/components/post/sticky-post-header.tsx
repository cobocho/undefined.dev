"use client";

import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface StickyPostHeaderProps {
  title: string;
  onBack: () => void;
}

export function StickyPostHeader({ title, onBack }: StickyPostHeaderProps) {
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<{ left: number; width: number } | null>(
    null,
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  const updateRect = useCallback(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const parent = sentinel.closest("article");
    if (!parent) return;
    const r = parent.getBoundingClientRect();
    setRect({ left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) return;

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
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateRect);
    };
  }, [updateRect]);

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
        <div className="pointer-events-auto flex w-full max-w-full items-center gap-3 rounded-[24px] border border-neutral-200 bg-neutral-50/80 px-4 py-3 backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/80">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="truncate text-lg font-semibold">{title}</span>
        </div>
      </div>
    </>
  );
}
