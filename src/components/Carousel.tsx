"use client";

import { useState, useCallback } from "react";
import { useSpring, animated } from "@react-spring/web";

interface CarouselProps {
  images: string[];
  title: string;
}

export default function Carousel({ images, title }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useState({ x: 0, time: 0 })[0];

  const [style] = useSpring(
    () => ({
      x: -index * 100 + (isDragging ? (dragX / window.innerWidth) * 100 : 0),
      config: { tension: 200, friction: 26 },
    }),
    [index, dragX, isDragging]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      startX.x = e.clientX;
      startX.time = Date.now();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [startX]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setDragX(e.clientX - startX.x);
    },
    [isDragging, startX]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const velocity = dragX / (Date.now() - startX.time + 1);
    const threshold = window.innerWidth * 0.15;

    if (dragX < -threshold || velocity < -0.3) {
      setIndex((i) => Math.min(i + 1, images.length - 1));
    } else if (dragX > threshold || velocity > 0.3) {
      setIndex((i) => Math.max(i - 1, 0));
    }
    setDragX(0);
  }, [isDragging, dragX, startX, images.length]);

  if (images.length <= 1) {
    return (
      <div className="carousel-single">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt={title} className="carousel-image" />
      </div>
    );
  }

  return (
    <div className="carousel">
      <animated.div
        className="carousel-track"
        style={{ x: style.x.to((v) => `${v}%`) }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {images.map((src, i) => (
          <div key={i} className="carousel-slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${title} ${i + 1}`} className="carousel-image" />
          </div>
        ))}
      </animated.div>
      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
