import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const domainPattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

// IDs are opaque, case-sensitive strings. Only domains and relationship types
// are normalized. Never guess account IDs, certification IDs, or relationships.
export function parseRecords(text, source) {
  const records = [];
  for (const [index, raw] of text.replace(/^\uFEFF/, "").split(/\r?\n/).entries()) {
    const line = raw.split("#", 1)[0].trim();
    if (!line) continue;
    const fields = line.split(",").map((field) => field.trim());
    const location = `${source}:${index + 1}`;
    if (fields.length < 3 || fields.length > 4 || fields.some((field) => !field)) {
      throw new Error(`${location}: expected 3 or 4 nonempty comma-separated fields`);
    }
    fields[0] = fields[0].toLowerCase();
    fields[2] = fields[2].toUpperCase();
    if (!domainPattern.test(fields[0]) || !["DIRECT", "RESELLER"].includes(fields[2])) {
      throw new Error(`${location}: invalid advertising-system domain or relationship`);
    }
    if (fields.some((field) => /[\s\x00-\x1f\x7f]/.test(field))) {
      throw new Error(`${location}: fields cannot contain whitespace or control characters`);
    }
    records.push({ fields, line: fields.join(", "), location });
  }
  return records;
}

export function mergeSources(sources, ownerdomain) {
  if (typeof ownerdomain !== "string" || !domainPattern.test(ownerdomain)) {
    throw new Error("ownerdomain must be a bare domain, without a scheme or path");
  }
  const output = [
    "# Generated from app-ads/sources/*.txt; edit the source files, not this file.",
    "# Run npm run ads:build to regenerate. See app-ads/README.md.",
    `ownerdomain=${ownerdomain.toLowerCase()}`,
  ];
  const seen = new Set();
  const accounts = new Map();
  const report = { ownerdomain: ownerdomain.toLowerCase(), sources: [], records: 0, duplicatesRemoved: 0, warnings: [] };

  for (const { name, text } of sources) {
    const records = parseRecords(text, name);
    if (!records.length) throw new Error(`${name}: source has no seller records`);
    output.push("", `# Source: ${name}`);
    let emitted = 0;
    for (const record of records) {
      const { fields, line, location } = record;
      const key = JSON.stringify(fields.slice(0, 2));
      if (!accounts.has(key)) accounts.set(key, []);
      accounts.get(key).push(record);
      if (seen.has(line)) {
        report.duplicatesRemoved++;
        continue;
      }
      seen.add(line);
      output.push(line);
      emitted++;
    }
    if (!emitted) output.push("# All records already included in earlier sources.");
    report.sources.push({ name, records: records.length, emitted });
  }

  for (const records of accounts.values()) {
    const relationships = new Set(records.map(({ fields }) => fields[2]));
    const certifications = new Set(records.map(({ fields }) => fields[3]).filter(Boolean));
    if (relationships.size > 1 || certifications.size > 1) {
      report.warnings.push({
        account: records[0].fields.slice(0, 2).join(", "),
        reason: relationships.size > 1 ? "Multiple relationship types; verify with the provider" : "Conflicting certification IDs; verify with the provider",
        occurrences: records.map(({ line, location }) => ({ line, location })),
      });
    }
  }
  report.records = seen.size;
  return { text: `${output.join("\n")}\n`, report };
}

export async function buildAppAds({ check = false, directory = root } = {}) {
  const config = JSON.parse(await readFile(resolve(directory, "app-ads/config.json"), "utf8"));
  if (!Array.isArray(config.sources) || !config.sources.length ||
      config.sources.some((name) => typeof name !== "string" || !/^[a-z0-9-]+\.txt$/.test(name)) ||
      new Set(config.sources).size !== config.sources.length) {
    throw new Error("config.sources must be a nonempty list of unique .txt filenames");
  }
  const sources = await Promise.all(config.sources.map(async (name) => ({
    name,
    text: await readFile(resolve(directory, "app-ads/sources", name), "utf8"),
  })));
  // Validate every input before writing any output. A bad update fails the build,
  // so the GitHub Pages workflow cannot deploy a partial authorization file.
  const result = mergeSources(sources, config.ownerdomain);
  const outputs = [
    ["app-ads.txt", result.text],
    ["public/app-ads.txt", result.text],
    ["app-ads/report.json", `${JSON.stringify(result.report, null, 2)}\n`],
  ];
  for (const [name, content] of outputs) {
    if (check) {
      if (await readFile(resolve(directory, name), "utf8") !== content) {
        throw new Error(`${name} is stale; run npm run ads:build`);
      }
    } else {
      await writeFile(resolve(directory, name), content);
    }
  }
  console.log(`${check ? "Checked" : "Generated"} app-ads.txt: ${result.report.records} records, ${result.report.duplicatesRemoved} duplicates removed.`);
  for (const warning of result.report.warnings) {
    console.warn(`app-ads.txt review: ${warning.account}: ${warning.reason} (see app-ads/report.json)`);
  }
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--check")) throw new Error("Usage: node tools/build-app-ads.mjs [--check]");
  await buildAppAds({ check: args.includes("--check") });
}
