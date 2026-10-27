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
  const link = page.getByRole("link", { name: "Pesan Batch Minggu Ini" }).first();
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
  // The hero mounts as soon as the poster frame lands; the rest of the
  // sequence streams in behind it, so this is quick even on a cold run.
  await expect(cta).toHaveCount(1, { timeout: 30_000 });
  // Still at the top of the page, so Beat D has not faded in yet. Opacity
  // alone would leave an invisible but tabbable link, so the wrapper is inert
  // and the anchor is out of the tab order.
  await expect(cta).toHaveAttribute("tabindex", "-1");
  await expect(cta.locator("xpath=ancestor::*[@inert]")).toHaveCount(1);
});

test("product cards carry prefilled WhatsApp order messages", async ({ page }) => {
  const card = page.getByRole("link", { name: /275 ml/ }).first();
  await card.scrollIntoViewIfNeeded();
  const href = await card.getAttribute("href");
  expect(href).toMatch(WA_ORDER_LINK);
  expect(decodeURIComponent(href ?? "")).toContain("275 ml");
  await expect(card.getByText("10 pcs / box")).toBeVisible();
});

test("offers section navigation from the sticky bar on desktop", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) <= 720, "compact bar hides links on phones");
  await page.locator("#produk").scrollIntoViewIfNeeded();
  const nav = page.getByRole("navigation", { name: "Navigasi halaman" });
  await expect(nav.getByRole("link", { name: "Produk" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Reseller" })).toBeVisible();
  const faq = nav.getByRole("link", { name: "FAQ" });
  await expect(faq).toBeVisible();
  await faq.click();
  await expect(page).toHaveURL(/#faq$/);
  await expect(page.locator("#faq")).toBeFocused();
  await expect(page.locator("#faq")).toBeInViewport();
});

test("offers a persistent order shortcut once the story begins", async ({ page }) => {
  // `exact` keeps the bar distinct from the card links, whose accessible
  // names also end in "Pesan via WhatsApp".
  const bar = page.getByRole("link", { name: "Pesan via WhatsApp", exact: true });
  await page.locator("#produk").scrollIntoViewIfNeeded();
  await expect(bar).toBeVisible();
  await expect(bar).toHaveAttribute("href", WA_ORDER_LINK);
  await page.getByRole("button", { name: "Tutup bilah pesan" }).click();
  await expect(bar).toHaveCount(0);
});

test("lets keyboard users skip the hero and land on the products", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Lewati ke produk" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#produk$/);
  await expect(page.locator("#produk")).toBeFocused();
  await expect(page.locator("#produk")).toBeInViewport();
});

test("has no horizontal overflow and exposes keyboard focus", async ({ page }) => {
  const link = page.getByRole("link", { name: "Pesan Batch Minggu Ini" }).first();
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
  await expect(page.getByRole("link", { name: "Pesan Batch Minggu Ini" }).first()).toBeVisible();
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
