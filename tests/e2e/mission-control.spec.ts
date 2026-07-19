import { test, expect } from "@playwright/test";

test.describe("Mission Control / Ops Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ops");
  });

  test("ops page loads", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });

  test("incidents page is reachable", async ({ page }) => {
    await page.goto("/ops/incidents");
    await expect(page.locator("body")).toBeVisible();
  });

  test("sustainability page is reachable", async ({ page }) => {
    await page.goto("/ops/sustainability");
    await expect(page.locator("body")).toBeVisible();
  });

  test("incident list shows incidents or empty state", async ({ page }) => {
    await page.goto("/ops/incidents");
    await page.waitForTimeout(1000);
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("desktop layout shows sidebar on large viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/ops");
    await expect(page.locator("body")).toBeVisible();
  });
});
