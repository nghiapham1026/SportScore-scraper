const puppeteer = require('puppeteer');
const { newsUrl } = require('./constants');
const News = require('../models/news');

async function scrapeNews() {
    const browser = await puppeteer.launch({ headless: false });
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
        articles = await page.$$eval('li.item[data-testid="article-card"]', items => 
            items.slice(0, 5).map(item => item.querySelector('a[href]').href)
        );
    } catch (error) {
        console.error(`Error extracting article links: ${error.message}`);
        await browser.close();
        return [];
    }

    console.log(`Found ${articles.length} articles, starting scrape...`);

    let allNews = [];
    for (const link of articles) {
        try {
            await page.goto(link, { waitUntil: 'networkidle2', timeout: 45000 });
            console.log(`Processing: ${link}`);

            // Wait for a fixed time after navigation to ensure page content loads
            await page.waitForTimeout(5000); 

            const articleDetails = await page.evaluate(() => {
                const name = document.querySelector('h1.article_title__9p8Mp')?.innerText;
                const author = document.querySelector('.author-link_authors__7vfIl a')?.innerText || 'Unknown';
                const date = document.querySelector('time[datetime]')?.getAttribute('datetime');
                const body = document.querySelector('.article-body_body__ASOmp')?.innerText;
                return { name, author, date, body };
            });

            allNews.push(new News(articleDetails));
        } catch (error) {
            console.error(`Error scraping article at ${link}: ${error.message}`);
            // If an error occurs, continue with the next article
        }
    }

    await browser.close();
    return allNews; // This returns the scraped data as a JSON array
}

module.exports = {
    scrapeNews,
};

// Example usage
(async () => {
    const newsData = await scrapeNews();
    console.log(JSON.stringify(newsData, null, 2)); // Print the JSON formatted news data
})();
