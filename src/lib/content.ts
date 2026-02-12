import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { Project, SiteConfig } from "@/types";

const contentDir = path.join(process.cwd(), "content");

export function getSiteConfig(): SiteConfig {
  const filePath = path.join(contentDir, "site.yaml");
  const raw = fs.readFileSync(filePath, "utf8");
  return yaml.load(raw) as SiteConfig;
}

export function getProjects(): Project[] {
  const projectsDir = path.join(contentDir, "projects");
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".yaml"));
  files.sort();

  const projects = files.map((file) => {
    const raw = fs.readFileSync(path.join(projectsDir, file), "utf8");
    const data = yaml.load(raw) as Omit<Project, "slug">;
    const slug = file.replace(/^\d+-/, "").replace(/\.yaml$/, "");
    return { slug, ...data };
  });

  projects.sort((a, b) => b.year - a.year);
  return projects;
}
