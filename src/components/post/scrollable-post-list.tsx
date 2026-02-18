"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollablePostListProps {
  children: React.ReactNode;
}

const SCROLL_AMOUNT = 300;
const MOMENTUM_FRICTION = 0.92;
const MOMENTUM_MIN_VELOCITY = 0.02;

export const ScrollablePostList = ({ children }: ScrollablePostListProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMomentumScrolling, setIsMomentumScrolling] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const dragState = useRef({ startX: 0, startY: 0, startTranslateX: 0 });
  const didDragRef = useRef(false);
  const momentumFrameRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const lastMoveRef = useRef({ x: 0, time: 0 });
  const translateXRef = useRef(0);

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
    translateXRef.current = translateX;
  }, [translateX]);

  const stopMomentum = useCallback(() => {
    if (momentumFrameRef.current !== null) {
      cancelAnimationFrame(momentumFrameRef.current);
      momentumFrameRef.current = null;
    }
    velocityRef.current = 0;
    setIsMomentumScrolling(false);
  }, []);

  const startMomentum = useCallback(() => {
    if (Math.abs(velocityRef.current) < MOMENTUM_MIN_VELOCITY) {
      stopMomentum();
      return;
    }

    setIsMomentumScrolling(true);
    let previousTime = performance.now();

    const step = (now: number) => {
      const deltaTime = now - previousTime;
      previousTime = now;

      velocityRef.current *= Math.pow(MOMENTUM_FRICTION, deltaTime / 16);

      if (Math.abs(velocityRef.current) < MOMENTUM_MIN_VELOCITY) {
        stopMomentum();
        return;
      }

      const nextTranslate = clamp(
        translateXRef.current + velocityRef.current * deltaTime,
      );

      if (nextTranslate === translateXRef.current) {
        stopMomentum();
        return;
      }

      translateXRef.current = nextTranslate;
      setTranslateX(nextTranslate);
      momentumFrameRef.current = requestAnimationFrame(step);
    };

    momentumFrameRef.current = requestAnimationFrame(step);
  }, [clamp, stopMomentum]);

  useEffect(() => {
    setMaxScroll(getMaxScroll());
  }, [getMaxScroll]);

  const canScrollLeft = translateX < 0;
  const canScrollRight = -translateX < maxScroll;

  const scrollLeft = useCallback(() => {
    stopMomentum();
    setTranslateX((prev) => clamp(prev + SCROLL_AMOUNT));
  }, [clamp, stopMomentum]);

  const scrollRight = useCallback(() => {
    stopMomentum();
    setTranslateX((prev) => clamp(prev - SCROLL_AMOUNT));
  }, [clamp, stopMomentum]);

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      stopMomentum();
      setIsDragging(true);
      dragState.current = {
        startX: e.pageX,
        startY: 0,
        startTranslateX: translateX,
      };
      lastMoveRef.current = { x: translateX, time: e.timeStamp };
      velocityRef.current = 0;
    },
    [translateX, stopMomentum],
  );

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];

      if (!touch) return;

      stopMomentum();
      setIsDragging(true);
      dragState.current = {
        startX: touch.pageX,
        startY: touch.pageY,
        startTranslateX: translateX,
      };
      lastMoveRef.current = { x: translateX, time: e.timeStamp };
      velocityRef.current = 0;
    },
    [translateX, stopMomentum],
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

      const nextTranslate = clamp(dragState.current.startTranslateX + delta);
      const deltaTime = e.timeStamp - lastMoveRef.current.time;

      if (deltaTime > 0) {
        velocityRef.current =
          (nextTranslate - lastMoveRef.current.x) / deltaTime;
      }

      lastMoveRef.current = { x: nextTranslate, time: e.timeStamp };
      setTranslateX(nextTranslate);
    },
    [isDragging, clamp],
  );

  const onMouseUpOrLeave = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    requestAnimationFrame(() => setHasDragged(false));

    if (Math.abs(velocityRef.current) >= MOMENTUM_MIN_VELOCITY) {
      startMomentum();
    }
  }, [isDragging, startMomentum]);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      if (!touch) return;

      const deltaX = touch.pageX - dragState.current.startX;
      const deltaY = touch.pageY - dragState.current.startY;

      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

      e.preventDefault();

      if (Math.abs(deltaX) > 5) {
        didDragRef.current = true;
        setHasDragged(true);
      }

      const nextTranslate = clamp(dragState.current.startTranslateX + deltaX);
      const deltaTime = e.timeStamp - lastMoveRef.current.time;

      if (deltaTime > 0) {
        velocityRef.current =
          (nextTranslate - lastMoveRef.current.x) / deltaTime;
      }

      lastMoveRef.current = { x: nextTranslate, time: e.timeStamp };
      setTranslateX(nextTranslate);
    },
    [isDragging, clamp],
  );

  const onTouchEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    requestAnimationFrame(() => setHasDragged(false));

    if (Math.abs(velocityRef.current) >= MOMENTUM_MIN_VELOCITY) {
      startMomentum();
    }
  }, [isDragging, startMomentum]);

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
    wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);
    wrapper.addEventListener("touchcancel", onTouchEnd);
    wrapper.addEventListener("dragstart", handleDragStart);
    wrapper.addEventListener("click", handleClickCapture, true);

    return () => {
      wrapper.removeEventListener("mousedown", onMouseDown);
      wrapper.removeEventListener("mousemove", onMouseMove);
      wrapper.removeEventListener("mouseup", onMouseUpOrLeave);
      wrapper.removeEventListener("mouseleave", onMouseUpOrLeave);
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
      wrapper.removeEventListener("touchcancel", onTouchEnd);
      wrapper.removeEventListener("dragstart", handleDragStart);
      wrapper.removeEventListener("click", handleClickCapture, true);
    };
  }, [
    onMouseDown,
    onMouseMove,
    onMouseUpOrLeave,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  ]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return;

      const max = getMaxScroll();
      if (max <= 0) return;

      e.preventDefault();
      stopMomentum();
      setTranslateX((prev) => clamp(prev - e.deltaX));
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, [getMaxScroll, clamp, stopMomentum]);

  useEffect(() => {
    return () => {
      stopMomentum();
    };
  }, [stopMomentum]);

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
      <div ref={wrapperRef} className="touch-pan-y overflow-visible">
        <div
          ref={innerRef}
          className="flex w-fit items-center gap-4"
          style={{
            transform: `translateX(${translateX}px)`,
            transition:
              isDragging || isMomentumScrolling
                ? "none"
                : "transform 0.15s ease-out",
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
