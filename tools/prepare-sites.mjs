import { cp, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve("dist");
const client = resolve(dist, "client");
const server = resolve(dist, "server");

await mkdir(client, { recursive: true });

for (const entry of await readdir(dist)) {
  if (entry === "client" || entry === "server" || entry === ".openai") {
    continue;
  }

  await cp(resolve(dist, entry), resolve(client, entry), { recursive: true });
}

await mkdir(server, { recursive: true });
await cp(resolve("worker/index.js"), resolve(server, "index.js"));

console.log("Prepared the static build for Sites hosting.");
