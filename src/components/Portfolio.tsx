"use client";

import { useState } from "react";
import { Project, SiteConfig } from "@/types";
import Timeline from "./Timeline";
import About from "./About";

interface PortfolioProps {
  config: SiteConfig;
  projects: Project[];
}

export default function Portfolio({ config, projects }: PortfolioProps) {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <main>
        <Timeline
          projects={projects}
          config={config}
          onAboutClick={() => setAboutOpen(true)}
        />
      </main>
      <About
        config={config}
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </>
  );
}
