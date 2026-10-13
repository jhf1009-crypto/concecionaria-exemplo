import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.QA_URL || "http://localhost:3000";
await fs.mkdir("qa", { recursive: true });
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
await context.addInitScript(() =>
  localStorage.setItem(
    "ninho-consent",
    JSON.stringify({ necessary: true, analytics: false, version: 1 }),
  ),
);
const page = await context.newPage();
const errors = [],
  report = [];
page.on("pageerror", (error) => errors.push(error.message));
const routes = [
  "/",
  "/estoque",
  "/financiamento",
  "/venda-seu-carro",
  "/sobre",
  "/contato",
  "/politica-de-privacidade",
  "/termos",
];
for (const route of routes) {
  console.log("Validando", route);
  const response = await page.goto(base + route, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
  await page.locator("h1").waitFor();
  assert.equal(await page.locator("h1").count(), 1, `Um h1: ${route}`);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  report.push({
    route,
    viewport: 1440,
    overflow,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  if (route === "/" || route === "/estoque")
    await page.screenshot({
      path: `qa/${route === "/" ? "home" : "estoque"}-desktop.png`,
      fullPage: route === "/",
    });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(150);
  const mobileOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  );
  report.push({ route, viewport: 390, overflow: mobileOverflow });
  if (route === "/" || route === "/estoque")
    await page.screenshot({
      path: `qa/${route === "/" ? "home" : "estoque"}-mobile.png`,
      fullPage: route === "/",
    });
  await page.setViewportSize({ width: 1440, height: 1000 });
}
await page.goto(base + "/estoque", { waitUntil: "networkidle" });
await page.locator(".filters select").first().selectOption("Jeep");
await page.waitForURL(/marca=Jeep/);
assert.match(await page.locator(".results-toolbar").innerText(), /3 veículos/);
await page.goto(base + "/estoque", { waitUntil: "networkidle" });
await page.locator(".favorite").first().click();
await page.getByRole("button", { name: "Favoritos", exact: true }).click();
await page.waitForURL(/favoritos=1/);
assert.equal(await page.locator(".vehicle-card").count(), 1);
await page.reload({ waitUntil: "networkidle" });
assert.equal(
  await page.locator(".vehicle-card").count(),
  1,
  "Favorito persiste",
);
await page.goto(base + "/estoque", { waitUntil: "networkidle" });
for (let i = 0; i < 3; i++)
  await page
    .getByRole("button", { name: "Comparar", exact: true })
    .nth(i)
    .click();
await page.getByRole("button", { name: "Comparar agora" }).click();
await page.getByRole("dialog").waitFor();
assert.equal(await page.getByRole("dialog").locator("thead th").count(), 4);
await page.keyboard.press("Escape");
const carHref = await page
  .locator(".vehicle-card h3")
  .first()
  .locator("..")
  .getAttribute("href");
await page.goto(base + carHref, { waitUntil: "networkidle" });
const carAxe = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
  .analyze();
report.push({
  route: carHref,
  viewport: 1440,
  violations: carAxe.violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  })),
});
await page
  .getByRole("button", { name: "Abrir galeria de fotografias" })
  .click();
await page.getByRole("dialog").waitFor();
await page.keyboard.press("ArrowRight");
assert.match(await page.locator(".lightbox-controls").innerText(), /2 \/ 3/);
await page.keyboard.press("Escape");
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "qa/veiculo-mobile.png", fullPage: true });
assert.equal(
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false,
);
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(base + "/financiamento", { waitUntil: "networkidle" });
const before = await page.locator(".finance-result>p").first().innerText();
await page.getByRole("button", { name: "60x", exact: true }).click();
assert.notEqual(
  await page.locator(".finance-result>p").first().innerText(),
  before,
);
await page.goto(base + "/contato", { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: "Iniciar atendimento", exact: true })
  .click();
await page.getByText("Informe seu nome completo.", { exact: true }).waitFor();
await page.locator("input[name=name]").fill("Cliente Demonstração");
await page.locator("input[name=phone]").fill("(62) 99985-8449");
await page.getByLabel(/Autorizo o uso/).check();
await page
  .getByRole("button", { name: "Iniciar atendimento", exact: true })
  .click();
await page
  .getByRole("heading", { name: "Sua mensagem está pronta." })
  .waitFor();
assert.match(
  await page
    .getByRole("link", { name: "Enviar pelo WhatsApp" })
    .getAttribute("href"),
  /^https:\/\/wa.me\/5562999858449\?/,
);
await page.goto(base + "/venda-seu-carro", { waitUntil: "networkidle" });
await page.getByLabel("Marca", { exact: true }).fill("Jeep");
await page.getByLabel("Modelo e versão").fill("Compass Limited");
await page.getByLabel("Ano do modelo", { exact: true }).fill("2021");
await page.getByLabel("Quilometragem", { exact: true }).fill("42000");
await page.getByRole("button", { name: "Continuar", exact: true }).click();
await page.locator("input[type=file]").setInputFiles("qa/estoque-mobile.png");
await page.getByRole("button", { name: "Continuar", exact: true }).click();
await page.locator("input[name=name]").fill("Cliente Avaliação");
await page.locator("input[name=phone]").fill("(62) 99985-8449");
await page.getByLabel(/Autorizo o uso/).check();
await page
  .getByRole("button", { name: "Solicitar avaliação", exact: true })
  .click();
await page
  .getByRole("heading", { name: "Sua mensagem está pronta." })
  .waitFor();
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
await page
  .getByRole("navigation", { name: "Menu móvel" })
  .getByRole("link", { name: /Estoque/ })
  .click();
await page.waitForURL(base + "/estoque");
assert.equal(await page.getByRole("dialog").count(), 0);
const invalid = await context.request.post(base + "/api/leads", {
  multipart: { lead: JSON.stringify({ name: "x" }) },
});
assert.equal(invalid.status(), 400);
const response404 = await page.goto(base + "/caminho-que-nao-existe");
assert.equal(response404.status(), 404);
for (const url of ["/robots.txt", "/sitemap.xml", "/opengraph-image"]) {
  const r = await context.request.get(base + url);
  assert.equal(r.status(), 200, url);
}
await fs.writeFile(
  "qa/results.json",
  JSON.stringify(
    {
      report,
      errors,
      flows:
        "filters, persistence, comparison, gallery, finance, validation, lead fallback, photo upload, mobile menu, API rejection, SEO endpoints",
      timestamp: new Date().toISOString(),
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    {
      checks: report.length,
      violations: report.filter((r) => r.violations?.length),
      overflow: report.filter((r) => r.overflow),
      errors,
    },
    null,
    2,
  ),
);
await browser.close();
if (errors.length || report.some((r) => r.overflow || r.violations?.length))
  process.exitCode = 1;
