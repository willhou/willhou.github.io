import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseRecords, mergeSources, buildAppAds } from "./build-app-ads.mjs";

test("handles provider formatting, BOM, CRLF, comments and missing final newline", () => {
  const records = parseRecords("\uFEFF# Provider\r\n EXAMPLE.com , AbC123 , reseller , cert # note\r\nexample.com,abc123,DIRECT", "provider.txt");
  assert.deepEqual(records.map(({ line }) => line), [
    "example.com, AbC123, RESELLER, cert",
    "example.com, abc123, DIRECT",
  ]);
});

test("deduplicates complete records while preserving opaque IDs and optional fields", () => {
  const result = mergeSources([
    { name: "one.txt", text: "EXAMPLE.com, AbC, DIRECT\nexample.com, AbC, DIRECT" },
    { name: "two.txt", text: "example.com,AbC,direct\nexample.com,abc,DIRECT\nexample.com,AbC,DIRECT,cert" },
  ], "ezi.am");
  assert.equal(result.report.records, 3);
  assert.equal(result.report.duplicatesRemoved, 2);
  assert.deepEqual(result.report.sources.map(({ emitted }) => emitted), [1, 2]);
  assert.equal(result.text.match(/ownerdomain=/g).length, 1);
  assert.equal(result.text.match(/^example.com, AbC, DIRECT$/gm).length, 1);
  assert.ok(result.text.endsWith("\n"));
});

test("reports conflicting provider declarations without dropping either record", () => {
  const result = mergeSources([
    { name: "new.txt", text: "example.com,123,RESELLER,cert" },
    { name: "others.txt", text: "example.com,123,DIRECT,cert" },
  ], "ezi.am");
  assert.equal(result.report.records, 2);
  assert.match(result.report.warnings[0].reason, /relationship/);
  assert.equal(result.report.warnings[0].occurrences[1].location, "others.txt:1");
  const conflict = mergeSources([{ name: "one.txt", text: "example.com,123,DIRECT,a\nexample.com,123,DIRECT,b" }], "ezi.am");
  assert.match(conflict.report.warnings[0].reason, /certification/);
});

test("rejects malformed input rather than silently skipping seller authorizations", () => {
  for (const text of ["<html>oops</html>", "example.com,,DIRECT", "https://example.com,1,DIRECT", "example.com,1,SELLER", "example.com,1,DIRECT,", "example.com,1,DIRECT,a,extra", "example.com,an id,DIRECT", "ownerdomain=wrong.example"]) {
    assert.throws(() => parseRecords(text, "broken.txt"), /broken.txt:1/);
  }
  assert.throws(() => mergeSources([], "https://ezi.am"), /bare domain/);
  assert.throws(() => mergeSources([{ name: "empty.txt", text: "# empty" }], "ezi.am"), /no seller records/);
});

test("builds identical output copies, detects drift, and fails before writing for missing or bad input", async () => {
  const directory = await mkdtemp(join(tmpdir(), "app-ads-test-"));
  try {
    await mkdir(join(directory, "app-ads/sources"), { recursive: true });
    await mkdir(join(directory, "public"));
    const configPath = join(directory, "app-ads/config.json");
    const sourcePath = join(directory, "app-ads/sources/one.txt");
    await writeFile(configPath, JSON.stringify({ ownerdomain: "ezi.am", sources: ["one.txt"] }));
    await writeFile(sourcePath, "example.com,123,DIRECT");
    const original = await buildAppAds({ directory });
    await buildAppAds({ directory, check: true });
    assert.equal(await readFile(join(directory, "public/app-ads.txt"), "utf8"), original.text);
    await writeFile(join(directory, "app-ads.txt"), "manual drift");
    await assert.rejects(buildAppAds({ directory, check: true }), /stale/);
    await buildAppAds({ directory });
    await writeFile(sourcePath, "bad entry");
    await assert.rejects(buildAppAds({ directory }), /one.txt:1/);
    assert.equal(await readFile(join(directory, "app-ads.txt"), "utf8"), original.text);
    await writeFile(sourcePath, "example.com,123,DIRECT");
    await writeFile(configPath, JSON.stringify({ ownerdomain: "ezi.am", sources: ["one.txt", "missing.txt"] }));
    await assert.rejects(buildAppAds({ directory }), /ENOENT/);
    assert.equal(await readFile(join(directory, "public/app-ads.txt"), "utf8"), original.text);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
