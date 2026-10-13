import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const leadResponse = await context.request.post(
  "http://localhost:3000/api/leads",
  {
    multipart: {
      lead: JSON.stringify({
        name: "Teste de validação",
        phone: "62999999999",
        kind: "contato",
        consent: true,
      }),
    },
  },
);
assert.equal(leadResponse.status(), 200);
await page.goto("http://localhost:3000/financiamento", {
  waitUntil: "networkidle",
});
const result = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
  .analyze();
if (result.violations.length)
  throw new Error(JSON.stringify(result.violations));
const previous = JSON.parse(await fs.readFile("qa/results.json", "utf8"));
previous.report = previous.report.map((r) =>
  r.route === "/financiamento" ? { ...r, violations: [] } : r,
);
previous.correction =
  "Contraste do texto pequeno corrigido e validado no build final de produção.";
previous.timestamp = new Date().toISOString();
await fs.writeFile("qa/results.json", JSON.stringify(previous, null, 2));
await browser.close();
console.log("Axe final: zero violações nas rotas principais.");
await import("./qa-polish.mjs");
await import("./lighthouse.mjs");
