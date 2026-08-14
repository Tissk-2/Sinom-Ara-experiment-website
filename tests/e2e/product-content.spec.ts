import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
});

test("shows the product story and verified order action", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "A Javanese classic, brewed for right now." })).toBeVisible();
  for (const name of ["Young tamarind leaves", "Fresh turmeric", "Palm sugar"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  const link = page.getByRole("link", { name: "Order this week on Instagram" });
  await link.scrollIntoViewIfNeeded();
  await expect(link).toHaveAttribute("href", "https://www.instagram.com/sinomaramalang/");
});

test("has no horizontal overflow and exposes keyboard focus", async ({ page }) => {
  const link = page.getByRole("link", { name: "Order this week on Instagram" });
  await link.scrollIntoViewIfNeeded();
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-style", "solid");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("keeps content visible with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#order").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Freshly brewed. Ready when the batch is." })).toBeVisible();
});

test("keeps content and ordering usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("#order").scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: "Order this week on Instagram" })).toBeVisible();
  await context.close();
});

test("matches the reviewed below-animation composition", async ({ page }) => {
  const content = page.locator("[data-product-content]");
  await page.evaluate(async () => {
    const totalHeight = document.body.scrollHeight;
    for (let y = 0; y < totalHeight; y += 350) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForFunction(() => {
    const images = Array.from(
      document.querySelectorAll("[data-product-content] img"),
    ) as HTMLImageElement[];
    return (
      images.length >= 5 &&
      images.every((img) => img.complete && img.naturalWidth > 0)
    );
  });
  await content.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await expect(content).toHaveScreenshot("product-content.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.05,
    threshold: 0.2,
  });
});
