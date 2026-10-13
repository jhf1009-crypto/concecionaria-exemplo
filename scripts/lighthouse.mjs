import { chromium } from "playwright";
import lighthouse from "lighthouse";
import fs from "node:fs/promises";
await fs.mkdir("qa", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--remote-debugging-port=9222"],
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const scores = [];
for (const desktop of [false, true]) {
  const result = await lighthouse(
    process.env.QA_URL || "http://localhost:3000",
    {
      port: 9222,
      output: ["html", "json"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      ...(desktop
        ? {
            formFactor: "desktop",
            screenEmulation: {
              mobile: false,
              width: 1440,
              height: 1000,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0,
            },
          }
        : {}),
    },
  );
  const label = desktop ? "desktop" : "mobile";
  await fs.writeFile(`qa/lighthouse-${label}.html`, result.report[0]);
  await fs.writeFile(`qa/lighthouse-${label}.json`, result.report[1]);
  scores.push({
    profile: label,
    scores: Object.fromEntries(
      Object.entries(result.lhr.categories).map(([k, v]) => [
        k,
        Math.round(v.score * 100),
      ]),
    ),
    LCP: result.lhr.audits["largest-contentful-paint"].numericValue,
    CLS: result.lhr.audits["cumulative-layout-shift"].numericValue,
    TBT: result.lhr.audits["total-blocking-time"].numericValue,
    failed: Object.entries(result.lhr.audits)
      .filter(
        ([, a]) =>
          a.score !== null &&
          a.score < 1 &&
          a.scoreDisplayMode !== "informative",
      )
      .map(([id, a]) => ({
        id,
        title: a.title,
        display: a.displayValue,
        details: a.details,
      })),
  });
}
await fs.writeFile(
  "qa/lighthouse-summary.json",
  JSON.stringify(scores, null, 2),
);
console.log(
  JSON.stringify(
    scores.map(({ failed, ...s }) => s),
    null,
    2,
  ),
);
await browser.close();
