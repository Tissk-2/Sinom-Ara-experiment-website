import { expect, test } from "@playwright/test";

const WA_ORDER_LINK = /^https:\/\/wa\.me\/62\d+\?text=/;

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
});

test("shows the product story and verified order action", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "A Javanese classic, brewed for right now." })).toBeVisible();
  for (const name of ["275 ml", "180 ml", "120 ml"]) {
    await expect(
      page.getByRole("img", { name: `Kemasan Sinom ARA ${name}` }),
    ).toBeVisible();
  }
  const link = page.getByRole("link", { name: "Order this week on WhatsApp" }).first();
  await link.scrollIntoViewIfNeeded();
  await expect(link).toHaveAttribute("href", WA_ORDER_LINK);
});

test("shows the three verified ingredients", async ({ page }) => {
  const section = page.locator("#ingredients");
  await section.scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: "Three ingredients, held in balance." }),
  ).toBeVisible();
  for (const name of ["Young tamarind leaves", "Fresh turmeric", "Palm sugar"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  await expect(section.getByRole("listitem")).toHaveCount(3);
});

test("shows the reseller action", async ({ page }) => {
  const link = page.getByRole("link", { name: "Tanya Program Reseller" });
  await link.scrollIntoViewIfNeeded();
  const href = await link.getAttribute("href");
  expect(href).toMatch(WA_ORDER_LINK);
  expect(decodeURIComponent(href ?? "")).toContain("reseller");
});

test("the hero CTA is not reachable before it fades in", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const cta = page.locator('a[href="#order"]').first();
  // The hero only mounts once all 192 frames have loaded, and on a cold run
  // that takes longer than the default assertion timeout.
  await expect(cta).toHaveCount(1, { timeout: 120_000 });
  // Still at the top of the page, so Beat D has not faded in yet. Opacity
  // alone would leave an invisible but tabbable link, so the wrapper is inert
  // and the anchor is out of the tab order.
  await expect(cta).toHaveAttribute("tabindex", "-1");
  await expect(cta.locator("xpath=ancestor::*[@inert]")).toHaveCount(1);
});

test("product cards carry prefilled WhatsApp order messages", async ({ page }) => {
  const card = page.getByRole("link", { name: "Pesan via WhatsApp →" }).first();
  await card.scrollIntoViewIfNeeded();
  const href = await card.getAttribute("href");
  expect(href).toMatch(WA_ORDER_LINK);
  expect(decodeURIComponent(href ?? "")).toContain("275 ml");
});

test("has no horizontal overflow and exposes keyboard focus", async ({ page }) => {
  const link = page.getByRole("link", { name: "Order this week on WhatsApp" }).first();
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
  await expect(page.getByRole("link", { name: "Order this week on WhatsApp" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Lihat aktivitas kami di Instagram" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tanya Program Reseller" })).toBeVisible();
  await context.close();
});

test("matches the reviewed below-animation composition", async ({ page }) => {
  // Capture in reduced-motion mode. motion-reveal/motion-stagger set their
  // opacity from JS and reveal via IntersectionObserver, so under smooth
  // scrolling their state at snapshot time is timing-dependent. With reduced
  // motion they render fully opaque immediately, which makes this a stable
  // test of the layout and typography (the behaviour itself is covered by the
  // dedicated reduced-motion test below).
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "domcontentloaded" });

  const content = page.locator("[data-product-content]");
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    for (let y = 0; y < total; y += 350) {
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
