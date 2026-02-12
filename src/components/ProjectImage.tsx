"use client";

interface ProjectImageProps {
  src: string;
  alt: string;
}

export default function ProjectImage({ src, alt }: ProjectImageProps) {
  return (
    <div className="project-image-wrapper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="project-image" />
    </div>
  );
}
