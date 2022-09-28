// https://www.aviasales.ru/search/MOW3009KGF1?request_source=search_form&payment_method=all

const puppeteer = require('puppeteer');
const notifier = require('node-notifier');

const CONFIG = {
  origin: 'MOW',
  departure: 'KGF',
  date: '3009', // 30 сент
  personCount: 1, // но это не точно
  period: 30_000, // ms
}

const url = `https://www.aviasales.ru/search/${CONFIG.origin}${CONFIG.date}${CONFIG.departure}${CONFIG.personCount}?request_source=search_form&payment_method=all`;

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(url);

  let isTicketsFounded = false;
  while(!isTicketsFounded) {
    try {
      await page.waitForSelector('.ticket-desktop');
      const price = await page.evaluate(() => {
        return document.querySelector('[data-test-id="price"]').textContent;
      });
      notifier.notify(`success! Price: ${price}`);
      await new Promise(r => setTimeout(r, pause));
      await page.click('.form-submit');
      console.log('click submit');
      // isTicketsFounded = true;
    } catch (e) {
      await page.click('.form-submit');
      console.log('click submit');
    }
  }
})()

