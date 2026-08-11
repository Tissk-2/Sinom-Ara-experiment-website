import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log("Navigating to localhost:3000...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for loading to finish
  console.log("Waiting for loading screen to disappear...");
  try {
    await page.waitForFunction(() => {
      const texts = Array.from(document.querySelectorAll('h1, h2')).map(el => el.textContent);
      return texts.some(t => t && t.includes('THE PERFECT POUR'));
    }, { timeout: 15000 });
  } catch {
    console.log("Timed out waiting for THE PERFECT POUR");
  }

  // Initial state
  await page.screenshot({ path: 'screenshot_0.png' });
  console.log("Took screenshot 0 (scroll 0)");

  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(500); // let animations settle
  
  await page.screenshot({ path: 'screenshot_1000.png' });
  console.log("Took screenshot 1000 (scroll 1000)");

  await browser.close();
})();
