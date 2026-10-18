// i18n language-toggle spec.
//
// Unlike the other visual specs (which rely on the bundled webServer at
// :4000 under the /al-folio baseurl used by the upstream starter), this fork
// is a personal site with baseurl "" and is normally served by Docker on :8080.
// Run against the running Docker build:
//
//   NO_WEBSERVER=1 I18N_BASE=http://127.0.0.1:8080 npx playwright test test/visual/i18n.spec.js
//
// It drives the real client-side toggle in assets/js/lang.js: switch to 中,
// verify the DOM flips and the preference persists across reload, switch back.
//
// These tests run against a live Docker build that loads third-party CDNs
// (fonts, icons), so we drive on DOMContentLoaded + an explicit wait for the
// injected toggle instead of the full `load` event, which can stall on slow
// external requests and flake the suite.
const { test, expect } = require("@playwright/test");

const BASE = process.env.I18N_BASE || "http://127.0.0.1:8080";

test.use({ baseURL: BASE });

// This fork is a personal site (baseurl "") normally served by Docker on :8080,
// and does not require the bundled chromium. Prefer the system Chrome install
// when available (works on machines without a Playwright browser download).
const useSystemChrome = process.env.USE_SYSTEM_CHROME === "1";
if (useSystemChrome) {
  test.use({ channel: "chrome" });
}

async function settleOnHome(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#al-lang-toggle", { timeout: 15000 });
}

test.describe("i18n language toggle", () => {
  test.beforeEach(async ({ page }) => {
    // Start from a clean, default-English state on every run.
    await settleOnHome(page);
    await page.evaluate(() => localStorage.removeItem("al_lang"));
  });

  test("nav toggle is present and defaults to English", async ({ page }) => {
    await settleOnHome(page);
    await expect(page.locator("#al-lang-toggle")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-lang", "en");
    // Nav labels are English by default (scoped to the navbar, exact match).
    const pubs = page.locator("#navbar").getByRole("link", { name: "publications", exact: true });
    await expect(pubs).toBeVisible();
  });

  test("clicking 中 switches the page to Chinese and persists it", async ({ page }) => {
    await settleOnHome(page);

    // Chinese blocks exist but are hidden while the language is en.
    await expect(page.locator('[data-lang="zh"]').first()).toBeHidden();

    await page.click('#al-lang-toggle .lang-opt[data-opt="zh"]');

    await expect(page.locator("html")).toHaveAttribute("data-lang", "zh");
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
    // Chinese content is now visible, English hidden.
    await expect(page.locator('[data-lang="zh"]').first()).toBeVisible();
    await expect(page.locator('[data-lang="en"]').first()).toBeHidden();
    // Nav labels flip to Chinese (scoped to the navbar; "论文" is the exact nav
    // label, distinct from the "精选论文" section link elsewhere on the page).
    await expect(page.locator("#navbar").getByRole("link", { name: "论文", exact: true })).toBeVisible();
    // Document title is localized.
    await expect(page).toHaveTitle(/关于/);

    // Preference survives a reload.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector('#al-lang-toggle .lang-opt[data-opt="zh"]');
    await expect(page.locator("html")).toHaveAttribute("data-lang", "zh");
    await expect(page.locator('[data-lang="zh"]').first()).toBeVisible();
  });

  test("switching back to English restores the original text", async ({ page }) => {
    await settleOnHome(page);
    await page.click('#al-lang-toggle .lang-opt[data-opt="zh"]');
    await expect(page.locator("html")).toHaveAttribute("data-lang", "zh");

    await page.click('#al-lang-toggle .lang-opt[data-opt="en"]');
    await expect(page.locator("html")).toHaveAttribute("data-lang", "en");
    await expect(page.locator('[data-lang="en"]').first()).toBeVisible();
    await expect(page.locator('[data-lang="zh"]').first()).toBeHidden();
    await expect(page).toHaveTitle(/about/i);
  });
});
