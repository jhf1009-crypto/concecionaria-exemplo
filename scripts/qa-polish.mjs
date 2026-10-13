import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "no-preference",
});
const page = await context.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: "Aceitar cookies", exact: true })
  .waitFor();
await page.screenshot({ path: "qa/cookies-desktop.png" });
await page.getByRole("button", { name: "Só essenciais", exact: true }).click();
const brands = await page
  .locator("select[name=marca] option")
  .allTextContents();
const models = await page
  .locator("select[name=modelo] option")
  .allTextContents();
assert.equal(brands.length - 1, 15);
assert.equal(models.length - 1, 16);
assert.ok(brands.includes("Volkswagen"));
await page.evaluate(() => window.scrollTo(0, 300));
await page.waitForTimeout(250);
const transform = await page
  .locator(".hero-parallax")
  .evaluate((e) => getComputedStyle(e).transform);
assert.notEqual(transform, "none");
const breakpoints = [];
for (const width of [360, 390, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: 900 });
  breakpoints.push({
    width,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  });
}
assert.ok(breakpoints.every((x) => !x.overflow));
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://localhost:3000/estoque?marca=Hyundai", {
  waitUntil: "networkidle",
});
assert.equal(await page.locator(".vehicle-card").count(), 3);
const src = await page.locator(".vehicle-card img").first().getAttribute("src");
assert.ok(src.includes("creta"));
await page.screenshot({ path: "qa/creta-desktop.png" });
await fs.writeFile(
  "qa/polish.json",
  JSON.stringify(
    {
      brands: brands.slice(1),
      models: models.slice(1),
      parallaxTransform: transform,
      breakpoints,
      cretaPhoto: src,
      cookies: "Aceitar cookies",
    },
    null,
    2,
  ),
);
console.log(
  "Cookies, 15 marcas, 16 modelos, foto do Creta, parallax e 7 breakpoints: OK",
);
await browser.close();
