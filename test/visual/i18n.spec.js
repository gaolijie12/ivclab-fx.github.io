// Language-button integration tests for this user site, served by Docker on :8080.
// NO_WEBSERVER=1 I18N_BROWSER_CHANNEL=msedge npx playwright test --config test/visual/playwright.config.js test/visual/i18n.spec.js
const { test, expect } = require("@playwright/test");
const path = require("path");

const BASE = process.env.I18N_BASE || "http://127.0.0.1:8080";
test.use({ baseURL: BASE });
const channel = process.env.I18N_BROWSER_CHANNEL || (process.env.USE_SYSTEM_CHROME === "1" ? "chrome" : undefined);
if (channel) test.use({ browserName: "chromium", channel });

async function visit(page, route = "/") {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#al-lang-toggle", { state: "attached" });
}

async function openMenu(page) {
  const menu = page.locator('button[aria-controls="navbarNav"]');
  if ((await menu.isVisible()) && (await menu.getAttribute("aria-expanded")) !== "true") await menu.click();
}

async function expectLanguage(page, language) {
  await expect(page.locator("html")).toHaveAttribute("data-lang", language);
  await expect(page.locator("html")).toHaveAttribute("lang", language === "zh" ? "zh-CN" : "en");
  await expect(page.locator("#al-lang-toggle")).toHaveText(language === "zh" ? "EN" : "中文");
  await expect(page.locator("#al-lang-toggle")).toHaveAttribute("aria-label", language === "zh" ? "切换到英文" : "Switch to Chinese");
}

test.describe("Chinese default and target-language button", () => {
  test("first visit defaults to Chinese and shows only EN", async ({ page }) => {
    await visit(page);
    await expectLanguage(page, "zh");
    await openMenu(page);
    await expect(page.locator("#al-lang-toggle")).toBeVisible();
    await expect(page.locator("#al-lang-toggle").locator("span")).toHaveCount(0);
    await expect(page.locator("#navbar").getByRole("link", { name: "论文", exact: true })).toBeVisible();
    await expect(page.locator('main [data-lang="en"]').first()).toBeHidden();
  });

  test("both languages persist across reload and page navigation", async ({ page }) => {
    await visit(page);
    await openMenu(page);
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "en");
    await expect(page.locator('main [data-lang="zh"]').first()).toBeHidden();
    await page.reload({ waitUntil: "domcontentloaded" });
    await expectLanguage(page, "en");
    await visit(page, "/people/");
    await expectLanguage(page, "en");
    await openMenu(page);
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "zh");
    await page.reload({ waitUntil: "domcontentloaded" });
    await expectLanguage(page, "zh");
    await visit(page, "/publications/");
    await expectLanguage(page, "zh");
  });

  test("legacy automatically saved English does not override the new default", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("al_lang", "en"));
    await visit(page);
    await expectLanguage(page, "zh");
    await openMenu(page);
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "en");
    await page.reload({ waitUntil: "domcontentloaded" });
    await expectLanguage(page, "en");
  });

  test("language switching preserves the current route, query and anchor", async ({ page }) => {
    await visit(page, "/people/?preview=language#mentor");
    await openMenu(page);
    const originalUrl = page.url();
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "en");
    expect(page.url()).toBe(originalUrl);
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "zh");
    expect(page.url()).toBe(originalUrl);
  });

  test("keyboard switches both ways and the button width stays stable", async ({ page }) => {
    await visit(page);
    await openMenu(page);
    const button = page.locator("#al-lang-toggle");
    await button.focus();
    const width = (await button.boundingBox()).width;
    await page.keyboard.press("Enter");
    await expectLanguage(page, "en");
    expect(Math.abs((await button.boundingBox()).width - width)).toBeLessThan(1);
    await page.keyboard.press("Space");
    await expectLanguage(page, "zh");
  });

  test("both directions work even when localStorage is blocked", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("Storage blocked", "SecurityError");
        },
      });
    });
    await visit(page);
    await expectLanguage(page, "zh");
    await openMenu(page);
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "en");
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "zh");
  });

  test("button remains usable in light and dark mode", async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: "light" });
    await visit(page);
    await openMenu(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expectLanguage(page, "zh");
    await page.screenshot({ path: path.join("output/playwright", `language-${testInfo.project.name}-chinese.png`) });
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "en");
    await page.locator("#light-toggle").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("#al-lang-toggle")).toBeVisible();
    await page.screenshot({ path: path.join("output/playwright", `language-${testInfo.project.name}-english-dark.png`) });
    await page.locator("#al-lang-toggle").click();
    await expectLanguage(page, "zh");
  });
});
