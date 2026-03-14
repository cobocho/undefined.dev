"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

const EXIT_MS = 250;
const ENTER_MS = 300;
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 0.6, 1)";

// --- Transition Router Context ---
type TransitionRouter = {
  push: (href: string) => Promise<void>;
  back: () => Promise<void>;
};

const TransitionRouterContext = createContext<TransitionRouter | null>(null);

export function useTransitionRouter(): TransitionRouter {
  const ctx = useContext(TransitionRouterContext);
  if (!ctx)
    throw new Error("useTransitionRouter must be used within PageTransition");
  return ctx;
}

// --- Component ---
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  // exit: 현재 콘텐츠를 아래로 fade-out
  const animateOut = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const el = containerRef.current;
      if (!el) return resolve();

      el.style.transition = `opacity ${EXIT_MS}ms ${EASE_IN}, transform ${EXIT_MS}ms ${EASE_IN}`;
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";

      setTimeout(resolve, EXIT_MS);
    });
  }, []);

  // enter: 새 콘텐츠를 아래에서 올리며 fade-in
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `opacity ${ENTER_MS}ms ${EASE_OUT}, transform ${ENTER_MS}ms ${EASE_OUT}`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        isAnimating.current = false;
      });
    });
  }, [pathname]);

  // --- 링크 클릭 가로채기 ---
  useEffect(() => {
    const handleClick = async (e: MouseEvent) => {
      if (isAnimating.current) return;

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        anchor.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        return;
      }

      if (href === pathname) return;

      e.preventDefault();
      e.stopPropagation();

      isAnimating.current = true;
      await animateOut();
      router.push(href);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, router, animateOut]);

  // --- Transition Router ---
  const transitionPush = useCallback(
    async (href: string) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      await animateOut();
      router.push(href);
    },
    [router, animateOut],
  );

  const transitionBack = useCallback(async () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    await animateOut();
    router.back();
  }, [router, animateOut]);

  return (
    <TransitionRouterContext
      value={{ push: transitionPush, back: transitionBack }}
    >
      <div ref={containerRef}>{children}</div>
    </TransitionRouterContext>
  );
}
