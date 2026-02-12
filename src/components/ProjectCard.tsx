"use client";

import { Project } from "@/types";
import ProjectImage from "./ProjectImage";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-image-wrapper">
        <ProjectImage src={project.image} alt={project.title} />
      </div>
    </div>
  );
}
