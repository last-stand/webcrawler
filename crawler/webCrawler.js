import puppeteer from "puppeteer";


async function crawl(url) {
  url = url.trim();
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  console.log(`Started crawling to ${url}..`);
  await page.goto(url, { waitUntil:'networkidle2'});

  const title = await page.title();
  let content = await page.$eval('body', body => body.textContent.trim());
  content = content.replace(/\s/g, " ");

  await browser.close();
  console.log(`Crawling completed`);

  return { title, url, content };
}

export default crawl;

