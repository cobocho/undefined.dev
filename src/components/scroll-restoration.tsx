"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const scrollPositions = new Map<string, number>();

export const ScrollRestoration = () => {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const wrapper = document.getElementById("content-wrapper");
    if (!wrapper) return;

    const hash = window.location.hash;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      if (target) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        wrapper.scrollTop += targetRect.top - wrapperRect.top - 40;
        prevPathname.current = pathname;
        return;
      }
    }

    if (prevPathname.current !== pathname) {
      const saved = scrollPositions.get(pathname);
      if (saved !== undefined) {
        wrapper.scrollTop = saved;
      } else {
        wrapper.scrollTop = 0;
      }
      prevPathname.current = pathname;
    }

    const handleScroll = () => {
      scrollPositions.set(pathname, wrapper.scrollTop);
    };

    wrapper.addEventListener("scroll", handleScroll, { passive: true });
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
};
