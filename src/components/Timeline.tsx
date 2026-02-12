"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Project, SiteConfig } from "@/types";
import ProjectCard from "./ProjectCard";
import Gallery from "./Gallery";
import Header from "./Header";
import { useDrag } from "@/hooks/useDrag";

interface TimelineProps {
  projects: Project[];
  config: SiteConfig;
  onAboutClick: () => void;
}

export default function Timeline({ projects, config, onAboutClick }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenIndex, setHiddenIndex] = useState<number | null>(null);
  const [timelineFaded, setTimelineFaded] = useState(false);
  const activeIndexRef = useRef<number | null>(null);
  const targetScrollRef = useRef<number | null>(null);
  const [currentYear, setCurrentYear] = useState(projects[0]?.year ?? config.year);
  const { onPointerDown, onPointerMove, onPointerUp, didDrag, overscroll } =
    useDrag(containerRef);

  const trackStyle = useSpring({
    x: overscroll,
    config: { tension: 300, friction: 200 },
  });

  const updateCurrentYear = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const centerX = container.scrollLeft + container.clientWidth / 2;
    let closestIdx = 0;
    let closestDist = Infinity;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });

    setCurrentYear(projects[closestIdx]?.year ?? config.year);
  }, [projects, config.year]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateCurrentYear, { passive: true });
    return () => container.removeEventListener("scroll", updateCurrentYear);
  }, [updateCurrentYear]);

  const getCardRect = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (!card) return null;
    const imgEl = card.querySelector(".project-image-wrapper, .project-card > div");
    return imgEl ? imgEl.getBoundingClientRect() : card.getBoundingClientRect();
  }, []);

  const handleCardClick = (project: Project, index: number) => {
    if (didDrag()) return;

    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    // Capture rect at current position and open immediately
    const rect = getCardRect(index);
    if (!rect) return;
    setHiddenIndex(index);
    setTimelineFaded(true);
    activeIndexRef.current = index;
    setSourceRect(rect);
    setActiveProject(project);

    // Scroll to center in background so exit animation lands correctly
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetScroll = cardCenter - container.clientWidth / 2;
    targetScrollRef.current = targetScroll;
    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  return (
    <>
      <div className="timeline-wrapper">
        <div className="timeline-header-wrapper" style={timelineFaded ? { opacity: 0 } : undefined}>
          <Header config={config} currentYear={currentYear} onAboutClick={onAboutClick} />
        </div>
        <div
          className="timeline"
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <animated.div
            className="timeline-track"
            style={{ transform: trackStyle.x.to((x) => `translateX(${x}px)`) }}
          >
            {projects.map((project, i) => (
              <div
                key={project.slug}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="timeline-card-wrapper"
                style={
                  i === hiddenIndex
                    ? { visibility: "hidden" }
                    : timelineFaded
                      ? { opacity: 0 }
                      : undefined
                }
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleCardClick(project, i)}
                />
              </div>
            ))}
            <div className="timeline-spacer" />
          </animated.div>
        </div>
      </div>
      <Gallery
        project={activeProject}
        sourceRect={sourceRect}
        onClose={() => {
          setTimelineFaded(false);
          setActiveProject(null);
          setSourceRect(null);
        }}
        onCloseComplete={() => {
          setHiddenIndex(null);
          activeIndexRef.current = null;
        }}
        getCloseRect={() => {
          // Force scroll to target position so the card is centered
          if (targetScrollRef.current !== null && containerRef.current) {
            containerRef.current.scrollLeft = targetScrollRef.current;
            targetScrollRef.current = null;
          }
          if (activeIndexRef.current !== null) {
            return getCardRect(activeIndexRef.current);
          }
          return null;
        }}
      />
    </>
  );
}
