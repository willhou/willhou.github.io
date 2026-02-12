"use client";

import { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { SiteConfig } from "@/types";

interface AboutProps {
  config: SiteConfig;
  isOpen: boolean;
  onClose: () => void;
}

export default function About({ config, isOpen, onClose }: AboutProps) {
  const style = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0%)" : "translateY(-100%)",
    config: { tension: 200, friction: 26 },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <animated.div
      className="about-overlay"
      style={{
        opacity: style.opacity,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      onClick={onClose}
    >
      <animated.div
        className="about-content"
        style={{ transform: style.transform }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="about-grid">
          <div className="about-text">
            <p className="about-bio">{config.bio}</p>
            <div className="about-links">
              {config.links.email && (
                <a className="about-link" href={config.links.email}>
                  Email
                </a>
              )}
              {config.links.twitter && (
                <a
                  className="about-link"
                  href={config.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              )}
              {config.links.instagram && (
                <a
                  className="about-link"
                  href={config.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
          <div className="about-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.aboutImage}
              alt={config.name}
              className="about-image"
            />
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
}
