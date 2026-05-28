// Playwright scraper example
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');

  const images = await page.$$eval('img', imgs => imgs.map(i => i.src));
  console.log(images);

  await browser.close();
})();
