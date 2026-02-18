"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollablePostListProps {
  children: React.ReactNode;
}

const SCROLL_AMOUNT = 300;

export const ScrollablePostList = ({ children }: ScrollablePostListProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const dragState = useRef({ startX: 0, startTranslateX: 0 });
  const didDragRef = useRef(false);

  const getMaxScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return 0;
    return Math.max(0, inner.scrollWidth - wrapper.clientWidth);
  }, []);

  const clamp = useCallback(
    (value: number) => {
      const max = getMaxScroll();
      return Math.min(0, Math.max(-max, value));
    },
    [getMaxScroll],
  );

  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    setMaxScroll(getMaxScroll());
  }, [getMaxScroll]);

  const canScrollLeft = translateX < 0;
  const canScrollRight = -translateX < maxScroll;

  const scrollLeft = useCallback(() => {
    setTranslateX((prev) => clamp(prev + SCROLL_AMOUNT));
  }, [clamp]);

  const scrollRight = useCallback(() => {
    setTranslateX((prev) => clamp(prev - SCROLL_AMOUNT));
  }, [clamp]);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      setIsDragging(true);
      dragState.current = {
        startX: e.pageX,
        startTranslateX: translateX,
      };
    },
    [translateX],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const delta = e.pageX - dragState.current.startX;
      if (Math.abs(delta) > 5) {
        didDragRef.current = true;
        setHasDragged(true);
      }
      setTranslateX(clamp(dragState.current.startTranslateX + delta));
    },
    [isDragging, clamp],
  );

  const onMouseUpOrLeave = useCallback(() => {
    setIsDragging(false);
    requestAnimationFrame(() => setHasDragged(false));
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleClickCapture = (e: MouseEvent) => {
      if (!didDragRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
    };

    wrapper.addEventListener("mousedown", onMouseDown);
    wrapper.addEventListener("mousemove", onMouseMove);
    wrapper.addEventListener("mouseup", onMouseUpOrLeave);
    wrapper.addEventListener("mouseleave", onMouseUpOrLeave);
    wrapper.addEventListener("dragstart", handleDragStart);
    wrapper.addEventListener("click", handleClickCapture, true);

    return () => {
      wrapper.removeEventListener("mousedown", onMouseDown);
      wrapper.removeEventListener("mousemove", onMouseMove);
      wrapper.removeEventListener("mouseup", onMouseUpOrLeave);
      wrapper.removeEventListener("mouseleave", onMouseUpOrLeave);
      wrapper.removeEventListener("dragstart", handleDragStart);
      wrapper.removeEventListener("click", handleClickCapture, true);
    };
  }, [onMouseDown, onMouseMove, onMouseUpOrLeave]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;

      const max = getMaxScroll();
      if (max <= 0) return;

      e.preventDefault();
      setTranslateX((prev) => clamp(prev - e.deltaX));
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, [getMaxScroll, clamp]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;

    if (!wrapper || !inner) return;

    const currentPost = inner.querySelector<HTMLElement>(
      '[data-current-post="true"]',
    );

    if (!currentPost) return;

    const centerOffset =
      wrapper.clientWidth / 2 -
      (currentPost.offsetLeft + currentPost.offsetWidth / 2);

    setTranslateX(clamp(centerOffset));
  }, [clamp]);

  return (
    <div className="group relative" role="presentation">
      {canScrollLeft && <ScrollButton direction="left" onClick={scrollLeft} />}
      {canScrollRight && (
        <ScrollButton direction="right" onClick={scrollRight} />
      )}
      <div ref={wrapperRef} className="overflow-visible">
        <div
          ref={innerRef}
          className="flex w-fit items-center gap-4"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
            pointerEvents: hasDragged ? "none" : "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

function ScrollButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      className={`absolute top-1/2 z-10 flex h-16 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-neutral-50 ${
        isLeft ? "left-4 -translate-x-1/2" : "right-4 translate-x-1/2"
      }`}
      style={{ pointerEvents: "none" }}
      onClick={onClick}
    >
      <Icon className="size-4 text-neutral-600" />
    </button>
  );
}
