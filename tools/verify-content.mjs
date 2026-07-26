import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const preservedFiles = [
  "app-ads.txt",
  "CNAME",
  "robots.txt",
  "privacy/card.html",
  "privacy/dcw.html",
  "privacy/mastermind.html",
];

for (const file of preservedFiles) {
  const source = await readFile(resolve(file));
  const publicCopy = await readFile(resolve("public", file));
  const buildCopy = await readFile(resolve("dist", file));

  if (!source.equals(publicCopy) || !source.equals(buildCopy)) {
    throw new Error(`Preserved content changed: ${file}`);
  }
}

console.log(`Verified ${preservedFiles.length} preserved public files.`);
