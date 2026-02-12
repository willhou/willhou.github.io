"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface DragState {
  startX: number;
  startScrollLeft: number;
  startTime: number;
  isDragging: boolean;
  moved: boolean;
}

function rubberBand(offset: number, max: number): number {
  const d = Math.abs(offset);
  const sign = offset < 0 ? -1 : 1;
  return sign * max * (1 - Math.exp(-d / (max * 1.5)));
}

export function useDrag(containerRef: React.RefObject<HTMLDivElement | null>) {
  const state = useRef<DragState>({
    startX: 0,
    startScrollLeft: 0,
    startTime: 0,
    isDragging: false,
    moved: false,
  });
  const [overscroll, setOverscroll] = useState(0);
  const overscrollRef = useRef(0);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const decayRaf = useRef<number | null>(null);
  const lastWheelTime = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      state.current.isDragging = true;
      state.current.moved = false;
      state.current.startX = e.clientX;
      state.current.startScrollLeft = containerRef.current.scrollLeft;
      state.current.startTime = Date.now();
    },
    [containerRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!state.current.isDragging || !containerRef.current) return;
      const dx = e.clientX - state.current.startX;
      if (Math.abs(dx) > 3) state.current.moved = true;

      const container = containerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const desiredScroll = state.current.startScrollLeft - dx;

      if (desiredScroll < 0) {
        container.scrollLeft = 0;
        const over = rubberBand(-desiredScroll, 200);
        overscrollRef.current = over;
        setOverscroll(over);
      } else if (desiredScroll > maxScroll) {
        container.scrollLeft = maxScroll;
        const over = rubberBand(-(desiredScroll - maxScroll), 200);
        overscrollRef.current = over;
        setOverscroll(over);
      } else {
        container.scrollLeft = desiredScroll;
        if (overscrollRef.current !== 0) {
          overscrollRef.current = 0;
          setOverscroll(0);
        }
      }
    },
    [containerRef]
  );

  const onPointerUp = useCallback(
    () => {
      if (!state.current.isDragging || !containerRef.current) return;
      const wasDrag = state.current.moved;
      state.current.isDragging = false;

      if (overscrollRef.current !== 0) {
        overscrollRef.current = 0;
        setOverscroll(0);
      }

      if (!wasDrag) return;

      const container = containerRef.current;
      const dx = container.scrollLeft - state.current.startScrollLeft;
      const dt = Date.now() - state.current.startTime + 1;
      const velocity = dx / dt;

      if (Math.abs(velocity) > 0.5) {
        const momentum = velocity * 300;
        container.scrollBy({
          left: momentum,
          behavior: "smooth",
        });
      }
    },
    [containerRef]
  );

  // Wheel/trackpad overscroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const startDecay = () => {
      if (decayRaf.current) cancelAnimationFrame(decayRaf.current);

      const decay = () => {
        // Wait until wheel events have stopped for 100ms
        if (Date.now() - lastWheelTime.current < 100) {
          decayRaf.current = requestAnimationFrame(decay);
          return;
        }

        // Decay the accumulator toward 0
        wheelAccum.current *= 0.85;
        if (Math.abs(wheelAccum.current) < 0.5) {
          wheelAccum.current = 0;
          overscrollRef.current = 0;
          setOverscroll(0);
          decayRaf.current = null;
          return;
        }

        const over = rubberBand(-wheelAccum.current, 150);
        overscrollRef.current = over;
        setOverscroll(over);
        decayRaf.current = requestAnimationFrame(decay);
      };

      decayRaf.current = requestAnimationFrame(decay);
    };

    const onWheel = (e: WheelEvent) => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const atStart = container.scrollLeft <= 0;
      const atEnd = container.scrollLeft >= maxScroll - 1;

      // deltaX > 0 = scrolling right, deltaX < 0 = scrolling left
      const scrollingLeft = e.deltaX < 0;
      const scrollingRight = e.deltaX > 0;

      if ((atStart && scrollingLeft) || (atEnd && scrollingRight)) {
        e.preventDefault();
        lastWheelTime.current = Date.now();

        wheelAccum.current += e.deltaX;
        const over = rubberBand(-wheelAccum.current, 150);
        overscrollRef.current = over;
        setOverscroll(over);

        startDecay();
      } else {
        // Reset any accumulated overscroll when scrolling normally
        if (wheelAccum.current !== 0) {
          if (decayRaf.current) {
            cancelAnimationFrame(decayRaf.current);
            decayRaf.current = null;
          }
          wheelAccum.current = 0;
          overscrollRef.current = 0;
          setOverscroll(0);
        }
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      if (decayRaf.current) cancelAnimationFrame(decayRaf.current);
    };
  }, [containerRef]);

  // Handle pointer leaving the window
  useEffect(() => {
    const handleUp = () => {
      state.current.isDragging = false;
      if (overscrollRef.current !== 0) {
        overscrollRef.current = 0;
        setOverscroll(0);
      }
    };
    window.addEventListener("pointerup", handleUp);
    return () => window.removeEventListener("pointerup", handleUp);
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    didDrag: () => state.current.moved,
    overscroll,
  };
}
