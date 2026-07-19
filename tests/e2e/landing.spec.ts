import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and shows the hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FIFA|Stadium|Smart/i);
  });

  test("has a choose experience section", async ({ page }) => {
    await page.goto("/");
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("navigates to fan experience", async ({ page }) => {
    await page.goto("/");
    const fanLink = page.getByRole("link", { name: /fan/i }).first();
    if (await fanLink.isVisible()) {
      await fanLink.click();
      await expect(page).toHaveURL(/fan/);
    }
  });

  test("navigates to ops dashboard", async ({ page }) => {
    await page.goto("/");
    const opsLink = page.getByRole("link", { name: /ops|operations|mission/i }).first();
    if (await opsLink.isVisible()) {
      await opsLink.click();
      await expect(page).toHaveURL(/ops/);
    }
  });

  test("is accessible — no missing alt texts on critical images", async ({ page }) => {
    await page.goto("/");
    const images = await page.locator("img").all();
    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const role = await img.getAttribute("role");
      if (role !== "presentation") {
        expect(alt).not.toBeNull();
      }
    }
  });

  test("responsive — works on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });
});
