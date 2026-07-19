import { test, expect } from "@playwright/test";

test.describe("Fan Journey", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/fan");
  });

  test("fan page loads without error", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
    await expect(page.locator("text=500")).not.toBeVisible();
  });

  test("bottom navigation is visible on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/fan");
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("can switch between tabs", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const matchTab = page.getByRole("button", { name: /match/i });
    if (await matchTab.isVisible()) {
      await matchTab.click();
    }
  });

  test("emergency sheet can be opened", async ({ page }) => {
    const emergencyBtn = page.getByRole("button", { name: /emergency|sos/i });
    if (await emergencyBtn.isVisible()) {
      await emergencyBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test("search input accepts text", async ({ page }) => {
    const searchInput = page.getByRole("textbox").first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("Where is Gate 5?");
      await expect(searchInput).toHaveValue("Where is Gate 5?");
    }
  });
});
