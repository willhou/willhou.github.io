"use client";

import { SiteConfig } from "@/types";
import AnimatedNumber from "./AnimatedNumber";

interface HeaderProps {
  config: SiteConfig;
  currentYear: number;
  onAboutClick: () => void;
}

export default function Header({ config, currentYear, onAboutClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-name">{config.name}</div>
        <div className="header-year">
          <AnimatedNumber value={currentYear} />
        </div>
      </div>
      <nav className="header-nav">
        <button className="nav-link" onClick={onAboutClick}>
          About
        </button>
        {config.links.twitter && (
          <a
            className="nav-link"
            href={config.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        )}
        {config.links.instagram && (
          <a
            className="nav-link"
            href={config.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        )}
      </nav>
    </header>
  );
}
