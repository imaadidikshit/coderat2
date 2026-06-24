import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));

  // The prod server runs on 3000, wait let's start it on 3001
  await page.goto('http://localhost:3001');
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
