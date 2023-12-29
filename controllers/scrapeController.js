const puppeteer = require('puppeteer');
const { newsUrl } = require('./constants');
const News = require('../models/news');

async function scrapeNews() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    await page.goto(newsUrl, { waitUntil: 'networkidle2', timeout: 45000 });
  } catch (error) {
    console.error(`Error loading main news page: ${error.message}`);
    await browser.close();
    return [];
  }

  let articles;
  try {
    articles = await page.$$eval(
      'li.item[data-testid="article-card"]',
      items => items.slice(0, 1).map(item => item.querySelector('a[href]').href)
    );
  } catch (error) {
    console.error(`Error extracting article links: ${error.message}`);
    await browser.close();
    return [];
  }

  console.log(`Found ${articles.length} articles, starting scrape...`);

  const allNews = [];
  for (const link of articles) {
    try {
      await page.goto(link, { waitUntil: 'networkidle2', timeout: 45000 });
      console.log(`Processing: ${link}`);

      await page.waitForTimeout(5000); // Wait for content to load

      const articleDetails = await page.evaluate(link => {
        const name = document.querySelector('h1.article_title__9p8Mp')?.innerText;
        const author = document.querySelector('.author-link_authors__7vfIl a')?.innerText || 'Unknown';
        const date = document.querySelector('time[datetime]')?.getAttribute('datetime');
        const body = Array.from(document.querySelectorAll('.article-body_body__ASOmp p')).map(p => p.innerText).join('\n\n');
        const imageElement = document.querySelector('.article_poster__96vwU img');
        const image = imageElement ? imageElement.src : null;

        // Scrape all topics
        const topicElements = document.querySelectorAll('.tag-list_list__JJGGX .tag_tag__bj3Yq');
        const topics = Array.from(topicElements).map(element => element.textContent.trim());

        return { link, name, author, date, body, image, topics };
      }, link);

      allNews.push(new News(articleDetails));
    } catch (error) {
      console.error(`Error scraping article at ${link}: ${error.message}`);
    }
  }

  await browser.close();
  return allNews;
}

module.exports = {
  scrapeNews,
};
