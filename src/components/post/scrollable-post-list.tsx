/* eslint-disable react-hooks/set-state-in-effect */
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
  const [translateX, setTranslateX] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dragState = useRef({ startX: 0, startTranslateX: 0 });

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
  }, [getMaxScroll, translateX]);

  const canScrollLeft = translateX < 0;
  const canScrollRight = -translateX < maxScroll;

  const scrollLeft = useCallback(() => {
    setTranslateX((prev) => clamp(prev + SCROLL_AMOUNT));
  }, [clamp]);

  const scrollRight = useCallback(() => {
    setTranslateX((prev) => clamp(prev - SCROLL_AMOUNT));
  }, [clamp]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      dragState.current = {
        startX: e.pageX,
        startTranslateX: translateX,
      };
    },
    [translateX],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const delta = e.pageX - dragState.current.startX;
      setTranslateX(clamp(dragState.current.startTranslateX + delta));
    },
    [isDragging, clamp],
  );

  const onMouseUpOrLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {canScrollLeft && (
        <ScrollButton
          direction="left"
          visible={isHovered}
          onClick={scrollLeft}
        />
      )}
      {canScrollRight && (
        <ScrollButton
          direction="right"
          visible={isHovered}
          onClick={scrollRight}
        />
      )}
      <div
        ref={wrapperRef}
        className="overflow-visible"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
      >
        <div
          ref={innerRef}
          className="flex w-fit items-center gap-4"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
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
  visible,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  const isLeft = direction === "left";
  const Icon = isLeft ? ChevronLeft : ChevronRight;

  return (
    <button
      className={`absolute top-1/2 z-10 flex h-16 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-md backdrop-blur-sm transition-opacity duration-200 hover:bg-neutral-50 ${
        isLeft ? "left-4 -translate-x-1/2" : "right-4 translate-x-1/2"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      onClick={onClick}
    >
      <Icon className="size-4 text-neutral-600" />
    </button>
  );
}
