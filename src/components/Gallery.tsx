"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { Project } from "@/types";
import BackButton from "./BackButton";

interface GalleryProps {
  project: Project | null;
  sourceRect: DOMRect | null;
  onClose: () => void;
  onCloseComplete?: () => void;
  getCloseRect?: () => DOMRect | null;
}

type AnimPhase = "idle" | "positioned" | "animating" | "open" | "closing";

export default function Gallery({ project, sourceRect, onClose, onCloseComplete, getCloseRect }: GalleryProps) {
  const isOpen = project !== null;
  const lastProject = useRef(project);
  const lastRect = useRef(sourceRect);
  const [phase, setPhase] = useState<AnimPhase>("idle");

  // Keep a reference to the last opened project for the close animation
  if (project) {
    lastProject.current = project;
    lastRect.current = sourceRect;
  }

  const displayProject = project ?? lastProject.current;

  // Track resize state (declared early so springs can reference it)
  const resizingRef = useRef(false);
  const [, setResizeKey] = useState(0);

  // Compute target rect: centered in viewport, scaled up
  const computeTargetRect = (srcRect: DOMRect | null) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxW = vw * 0.6;
    const maxH = vh * 0.55;

    if (!srcRect) return { left: vw / 2, top: vh / 2, width: maxW, height: maxH };

    const aspect = srcRect.width / srcRect.height;
    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }

    const left = (vw - w) / 2;
    const top = (vh - h) / 2;
    return { left, top, width: w, height: h };
  };

  // Determine spring target based on phase
  const getSpringTarget = () => {
    const src = lastRect.current;

    if (phase === "positioned") {
      // Snap to source card position
      return src
        ? { left: src.left, top: src.top, width: src.width, height: src.height }
        : { left: 0, top: 0, width: 0, height: 0 };
    }

    if (phase === "animating" || phase === "open") {
      // Animate to centered position
      return computeTargetRect(src);
    }

    if (phase === "closing") {
      // Animate back to card's current position
      const closeRect = getCloseRect?.() ?? lastRect.current;
      return closeRect
        ? { left: closeRect.left, top: closeRect.top, width: closeRect.width, height: closeRect.height }
        : { left: 0, top: 0, width: 0, height: 0 };
    }

    // idle
    return { left: 0, top: 0, width: 0, height: 0 };
  };

  const target = getSpringTarget();

  const imgStyle = useSpring({
    left: target.left,
    top: target.top,
    width: target.width,
    height: target.height,
    immediate: phase === "positioned" || resizingRef.current,
    config: { tension: 300, friction: 28 },
    onRest: () => {
      if (phase === "animating") {
        setPhase("open");
      } else if (phase === "closing") {
        setPhase("idle");
        lastProject.current = null;
        lastRect.current = null;
        onCloseComplete?.();
      }
    },
  });

  const overlayStyle = useSpring({
    opacity: phase === "animating" || phase === "open" || phase === "positioned" ? 1 : 0,
    config: { tension: 400, friction: 30 },
  });

  const contentStyle = useSpring({
    opacity: phase === "open" || phase === "animating" ? 1 : 0,
    y: phase === "open" || phase === "animating" ? 0 : 20,
    delay: phase === "animating" ? 80 : 0,
    config: { tension: 400, friction: 28 },
  });

  // Phase transitions driven by isOpen
  useEffect(() => {
    if (isOpen) {
      // Start by positioning at source
      setPhase("positioned");
    } else if (phase === "open" || phase === "animating" || phase === "positioned") {
      // Close
      setPhase("closing");
    }
  }, [isOpen]);

  // After positioning, start animation on next frame
  useEffect(() => {
    if (phase === "positioned") {
      requestAnimationFrame(() => {
        setPhase("animating");
      });
    }
  }, [phase]);

  // Force re-render on resize so image + info reposition immediately
  useEffect(() => {
    if (phase !== "open" && phase !== "animating") return;
    const onResize = () => {
      resizingRef.current = true;
      setResizeKey((k) => k + 1);
      requestAnimationFrame(() => { resizingRef.current = false; });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (phase === "idle") return null;

  return (
    <div
      className="gallery-overlay"
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      {/* White background fade — click to close */}
      <animated.div
        className="gallery-bg"
        style={{ opacity: overlayStyle.opacity }}
        onClick={handleClose}
      />

      {/* Shared element: the image animates from source → center */}
      <animated.div
        className="gallery-shared-image"
        style={{
          left: imgStyle.left,
          top: imgStyle.top,
          width: imgStyle.width,
          height: imgStyle.height,
        }}
      >
        {displayProject && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={displayProject.image}
            alt={displayProject.title}
            className="gallery-shared-img"
          />
        )}
      </animated.div>

      {/* Back button — top left */}
      <animated.div
        className="gallery-back"
        style={{ opacity: contentStyle.opacity }}
      >
        <BackButton onClick={handleClose} />
      </animated.div>

      {/* Product info — to the left of image, bottom-aligned */}
      <animated.div
        className="gallery-info-panel"
        style={{
          opacity: contentStyle.opacity,
          top: to([imgStyle.top, imgStyle.height], (t, h) => t + h),
          right: to([imgStyle.left, imgStyle.width], (l, w) => window.innerWidth - l),
          transform: contentStyle.y.to((y) => `translateY(calc(-100% + ${y}px)`),
        }}
      >
        <h2 className="gallery-title">{displayProject?.title}</h2>
        <p className="gallery-meta">
          {displayProject?.role} &middot; {displayProject?.company}, {displayProject?.year}
        </p>
        {displayProject?.team && displayProject.team.length > 0 && (
          <div className="gallery-team-inline">
            <p className="gallery-team-members">{displayProject.team.join(", ")}</p>
          </div>
        )}
      </animated.div>
    </div>
  );
}
