import { getSiteConfig, getProjects } from "@/lib/content";
import Portfolio from "@/components/Portfolio";

export default function Home() {
  const config = getSiteConfig();
  const projects = getProjects();

  return <Portfolio config={config} projects={projects} />;
}
